const Document = require('../models/Document');
const Tender = require('../models/Tender');
const { catchAsync } = require('../utils/errorHandler');
const path = require('path');
const fs = require('fs');
const extractionPipeline = require('../modules/document-intelligence/services/ExtractionPipeline');
const { readDocumentText } = extractionPipeline;
const aiOrchestrator = require('../modules/ai-core/AiOrchestrator');
const webhookDispatcher = require('../modules/integrations/services/WebhookDispatcherService');

// Get all documents with filters and pagination
const getDocuments = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status, type, priority, search } = req.query;
  
  console.log('📄 Getting documents for companyId:', req.companyId);
  console.log('📄 User:', req.user?.email);
  
  const filter = {
    companyId: req.companyId // Add company filtering
  };
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (priority) filter.priority = priority;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
      { 'aiExtraction.extractedData.tenderTitle': { $regex: search, $options: 'i' } }
    ];
  }

  const documents = await Document.find(filter)
    .populate('uploadedBy', 'name email')
    .populate('reviewedBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Document.countDocuments(filter);
  
  console.log('📄 Found documents:', documents.length, 'out of', total, 'total');
  console.log('📄 Filter used:', JSON.stringify(filter, null, 2));

  res.json({
    success: true,
    data: {
      documents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalDocuments: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    },
    message: 'Documents retrieved successfully'
  });
});

// Get document by ID
const getDocument = catchAsync(async (req, res) => {
  const document = await Document.findOne({ 
    _id: req.params.id, 
    companyId: req.companyId 
  })
    .populate('uploadedBy', 'name email')
    .populate('reviewedBy', 'name email')
    .populate('comments.author', 'name email');

  if (!document) {
    return res.status(404).json({
      error: 'Document not found',
      message: 'The requested document does not exist'
    });
  }

  res.json({
    success: true,
    data: { document },
    message: 'Document retrieved successfully'
  });
});

// Upload document (handled by multer middleware)
const uploadDocument = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'No file uploaded',
      message: 'Please select a file to upload'
    });
  }

  const documentData = {
    name: req.body.name || req.file.originalname,
    type: req.body.type || 'OTHER',
    tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
    category: req.body.category,
    priority: req.body.priority || 'MEDIUM',
    uploadedBy: req.user.id,
    companyId: req.companyId, // Add companyId
    storage: {
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    }
  };

  const document = await Document.create(documentData);

  // Trigger outbound webhook event
  webhookDispatcher.triggerEvent(req.companyId, 'document.uploaded', document);

  // Auto-process tender documents
  if (document.type === 'TENDER_DOCUMENT') {
    // Queue for AI processing
    setTimeout(() => processDocumentWithAI(document._id), 1000);
  }

  res.status(201).json({
    data: { document },
    message: 'Document uploaded successfully'
  });
});

// Process document with AI
const processDocumentWithAI = async (documentId) => {
  try {
    const document = await Document.findById(documentId);
    if (!document) return;

    // Update status to processing
    document.status = 'PROCESSING';
    await document.save();

    // Route processing to the unified extraction pipeline
    await extractionPipeline.run(document.companyId, document._id, {
      pipeline: 'metadata'
    });

    const updatedDoc = await Document.findById(documentId);
    if (updatedDoc) {
      webhookDispatcher.triggerEvent(updatedDoc.companyId, 'document.processed', updatedDoc);
    }

    console.log(`✅ Document ${documentId} processed with real unified AI pipeline`);
  } catch (error) {
    console.error(`❌ AI processing failed for document ${documentId}:`, error);
    
    // Update status to uploaded if processing fails
    const document = await Document.findById(documentId);
    if (document) {
      document.status = 'UPLOADED';
      await document.save();
    }
  }
};

// Process document with AI manually
const processDocumentAI = catchAsync(async (req, res) => {
  const document = await Document.findOne({ 
    _id: req.params.id, 
    companyId: req.companyId 
  });
  
  if (!document) {
    return res.status(404).json({
      error: 'Document not found',
      message: 'The requested document does not exist'
    });
  }

  if (document.aiExtraction.isProcessed) {
    return res.status(400).json({
      error: 'Already processed',
      message: 'Document has already been processed by AI'
    });
  }

  // Start AI processing
  processDocumentWithAI(document._id);

  res.json({
    message: 'AI processing started for document',
    data: { documentId: document._id }
  });
});

// Create tender record from extracted document
const createTenderRecord = catchAsync(async (req, res) => {
  const document = await Document.findOne({ 
    _id: req.params.id, 
    companyId: req.companyId 
  });
  
  if (!document) {
    return res.status(404).json({
      error: 'Document not found',
      message: 'The requested document does not exist'
    });
  }

  if (!document.aiExtraction.isProcessed) {
    return res.status(400).json({
      error: 'Document not processed',
      message: 'Document must be processed by AI before creating tender record'
    });
  }

  if (document.tenderRecord.isCreated) {
    return res.status(400).json({
      error: 'Tender already created',
      message: 'Tender record already exists for this document'
    });
  }

  const extractedData = document.aiExtraction.extractedData;
  
  // Create tender record
  const tenderData = {
    title: extractedData.tenderTitle,
    organization: extractedData.organization,
    estimatedValue: extractedData.estimatedValue.amount,
    currency: extractedData.estimatedValue.currency,
    deadline: extractedData.deadline,
    location: extractedData.location,
    description: extractedData.description,
    requirements: extractedData.requirements,
    categories: extractedData.categories,
    contactInfo: extractedData.contactInfo,
    status: 'DRAFT',
    sourceDocument: document._id,
    createdBy: req.user.id,
    companyId: req.companyId // Add companyId
  };

  const tender = await Tender.create(tenderData);

  // Update document with tender record info
  document.tenderRecord = {
    isCreated: true,
    tenderId: tender._id,
    createdAt: new Date()
  };
  document.status = 'APPROVED';
  await document.save();

  // Trigger outbound webhook event
  webhookDispatcher.triggerEvent(req.companyId, 'tender.created', tender);

  res.status(201).json({
    data: { tender, document },
    message: 'Tender record created successfully from document'
  });
});

// Update document metadata
const updateDocument = catchAsync(async (req, res) => {
  const allowedUpdates = ['name', 'type', 'tags', 'category', 'priority', 'status'];
  const updates = {};
  
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const document = await Document.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId },
    updates,
    { new: true, runValidators: true }
  ).populate('uploadedBy', 'name email');

  if (!document) {
    return res.status(404).json({
      error: 'Document not found',
      message: 'The requested document does not exist'
    });
  }

  res.json({
    data: { document },
    message: 'Document updated successfully'
  });
});

// Add comment to document
const addComment = catchAsync(async (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      error: 'Comment text required',
      message: 'Please provide comment text'
    });
  }

  const document = await Document.findOne({ 
    _id: req.params.id, 
    companyId: req.companyId 
  });
  
  if (!document) {
    return res.status(404).json({
      error: 'Document not found',
      message: 'The requested document does not exist'
    });
  }

  document.comments.push({
    text: text.trim(),
    author: req.user.id
  });

  await document.save();

  const updatedDocument = await Document.findById(req.params.id)
    .populate('uploadedBy', 'name email')
    .populate('comments.author', 'name email');

  res.json({
    data: { document: updatedDocument },
    message: 'Comment added successfully'
  });
});

// Delete document (soft delete)
const deleteDocument = catchAsync(async (req, res) => {
  const document = await Document.findOne({ 
    _id: req.params.id, 
    companyId: req.companyId 
  });
  
  if (!document) {
    return res.status(404).json({
      error: 'Document not found',
      message: 'The requested document does not exist'
    });
  }

  document.isDeleted = true;
  await document.save();

  res.json({
    message: 'Document deleted successfully'
  });
});

// Get document statistics
const getDocumentStats = catchAsync(async (req, res) => {
  const stats = await Document.aggregate([
    { $match: { isDeleted: false, companyId: req.companyId } },
    {
      $group: {
        _id: null,
        totalDocuments: { $sum: 1 },
        totalSize: { $sum: '$storage.size' },
        byStatus: {
          $push: '$status'
        },
        byType: {
          $push: '$type'
        },
        byPriority: {
          $push: '$priority'
        }
      }
    }
  ]);

  const processedCount = await Document.countDocuments({
    'aiExtraction.isProcessed': true,
    isDeleted: false,
    companyId: req.companyId
  });

  const tenderRecordsCount = await Document.countDocuments({
    'tenderRecord.isCreated': true,
    isDeleted: false,
    companyId: req.companyId
  });

  const result = {
    totalDocuments: stats[0]?.totalDocuments || 0,
    totalSizeMB: ((stats[0]?.totalSize || 0) / (1024 * 1024)).toFixed(2),
    processedByAI: processedCount,
    tenderRecordsCreated: tenderRecordsCount,
    byStatus: {
      UPLOADED: stats[0]?.byStatus?.filter(s => s === 'UPLOADED').length || 0,
      PROCESSING: stats[0]?.byStatus?.filter(s => s === 'PROCESSING').length || 0,
      EXTRACTED: stats[0]?.byStatus?.filter(s => s === 'EXTRACTED').length || 0,
      REVIEWED: stats[0]?.byStatus?.filter(s => s === 'REVIEWED').length || 0,
      APPROVED: stats[0]?.byStatus?.filter(s => s === 'APPROVED').length || 0
    },
    byType: {
      TENDER_DOCUMENT: stats[0]?.byType?.filter(t => t === 'TENDER_DOCUMENT').length || 0,
      CONTRACT: stats[0]?.byType?.filter(t => t === 'CONTRACT').length || 0,
      SPECIFICATION: stats[0]?.byType?.filter(t => t === 'SPECIFICATION').length || 0,
      OTHER: stats[0]?.byType?.filter(t => t === 'OTHER').length || 0
    }
  };

  res.json({
    data: { stats: result },
    message: 'Document statistics retrieved successfully'
  });
});

module.exports = {
  getDocuments,
  getDocument,
  uploadDocument,
  processDocumentAI,
  createTenderRecord,
  updateDocument,
  addComment,
  deleteDocument,
  getDocumentStats
};
