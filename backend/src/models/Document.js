const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  // Basic document info
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ['TENDER_DOCUMENT', 'CONTRACT', 'SPECIFICATION', 'DRAWING', 'REPORT', 'OTHER']
  },
  
  // AI Extraction Results
  aiExtraction: {
    isProcessed: {
      type: Boolean,
      default: false
    },
    processedAt: Date,
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    extractedData: {
      tenderTitle: String,
      organization: String,
      estimatedValue: {
        amount: Number,
        currency: String
      },
      deadline: Date,
      location: String,
      description: String,
      requirements: [String],
      categories: [String],
      contactInfo: {
        name: String,
        email: String,
        phone: String
      }
    },
    rawText: String,
    summary: String,
    keywords: [String]
  },
  
  // Tender Record Creation
  tenderRecord: {
    isCreated: {
      type: Boolean,
      default: false
    },
    tenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tender'
    },
    createdAt: Date
  },
  
  // File storage
  storage: {
    path: String,
    url: String,
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number
  },
  
  sharePointUrl: {
    type: String,
    trim: true
  },
  
  // Versioning
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    version: Number,
    path: String,
    uploadedAt: Date
  }],
  
  // Metadata
  tags: [String],
  category: String,
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  
  // Status and workflow
  status: {
    type: String,
    enum: ['UPLOADED', 'PROCESSING', 'EXTRACTED', 'REVIEWED', 'APPROVED', 'REJECTED', 'ARCHIVED'],
    default: 'UPLOADED'
  },
  
  // Comments and collaboration
  comments: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isResolved: {
      type: Boolean,
      default: false
    }
  }],
  
  // Audit trail
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'Document'
});

// Indexes for performance
documentSchema.index({ type: 1, status: 1 });
documentSchema.index({ 'aiExtraction.isProcessed': 1 });
documentSchema.index({ 'tenderRecord.isCreated': 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ priority: 1 });
documentSchema.index({ isDeleted: 1 });

// Filter out deleted documents by default
documentSchema.pre(/^find/, function(next) {
  if (this.getQuery().isDeleted !== true) {
    this.where({ isDeleted: false });
  }
  next();
});

// Virtual for file extension
documentSchema.virtual('fileExtension').get(function() {
  if (!this.storage.originalName) return '';
  return this.storage.originalName.split('.').pop().toLowerCase();
});

// Virtual for file size in MB
documentSchema.virtual('fileSizeMB').get(function() {
  if (!this.storage.size) return 0;
  return (this.storage.size / (1024 * 1024)).toFixed(2);
});

// Virtual for processing status
documentSchema.virtual('processingStatus').get(function() {
  if (this.status === 'UPLOADED') return 'Ready for Processing';
  if (this.status === 'PROCESSING') return 'AI Processing...';
  if (this.status === 'EXTRACTED') return 'Data Extracted';
  if (this.status === 'REVIEWED') return 'Under Review';
  if (this.status === 'APPROVED') return 'Approved';
  if (this.status === 'REJECTED') return 'Rejected';
  return this.status;
});

// Instance method to extract tender data
documentSchema.methods.extractTenderData = function() {
  if (!this.aiExtraction.extractedData) return null;
  
  const data = this.aiExtraction.extractedData;
  return {
    title: data.tenderTitle,
    organization: data.organization,
    estimatedValue: data.estimatedValue,
    deadline: data.deadline,
    location: data.location,
    description: data.description,
    requirements: data.requirements,
    categories: data.categories,
    contactInfo: data.contactInfo
  };
};

// Instance method to create tender record
documentSchema.methods.createTenderRecord = async function() {
  if (this.tenderRecord.isCreated) {
    throw new Error('Tender record already exists for this document');
  }
  
  if (!this.aiExtraction.isProcessed) {
    throw new Error('Document must be processed by AI before creating tender record');
  }
  
  // This will be implemented in the controller
  return true;
};

module.exports = mongoose.model('Document', documentSchema);
