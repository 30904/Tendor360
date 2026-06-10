const mongoose = require('mongoose');
const Tender = require('../models/Tender');
const User = require('../models/User');

// Get all tenders with filtering, pagination, and search
const getTenders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      pipelineStage,
      tenderType,
      therapeuticArea,
      priority,
      urgency,
      minValue,
      maxValue,
      currency,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const companyId = req.user.companyId;

    // Build filter object
    const filter = {
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (pipelineStage) {
      filter.pipelineStage = pipelineStage;
    }
    
    if (tenderType) {
      filter.tenderType = tenderType;
    }
    
    if (therapeuticArea) {
      filter.therapeuticArea = therapeuticArea;
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (urgency) {
      filter.urgency = urgency;
    }
    
    if (minValue || maxValue) {
      filter.estimatedValue = {};
      if (minValue) filter.estimatedValue.$gte = parseFloat(minValue);
      if (maxValue) filter.estimatedValue.$lte = parseFloat(maxValue);
    }
    
    if (currency) {
      filter.currency = currency;
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination and populate
    const tenders = await Tender.find(filter)
      .populate('owner', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Tender.countDocuments(filter);

    // Transform tender data
    const transformedTenders = tenders.map(tender => ({
      id: tender._id,
      reference: tender.reference,
      title: tender.title,
      description: tender.description,
      organization: tender.organization,
      location: tender.location,
      estimatedValue: tender.estimatedValue,
      currency: tender.currency,
      deadline: tender.deadline,
      tenderType: tender.tenderType,
      therapeuticArea: tender.therapeuticArea,
      aiMatchScore: tender.aiMatchScore,
      status: tender.status,
      tags: tender.tags,
      publishedDate: tender.publishedDate,
      updatedDate: tender.updatedDate,
      urgency: tender.urgency,
      source: tender.source,
      owner: tender.owner,
      assignedTo: tender.assignedTo,
      dueDates: tender.dueDates,
      requirements: tender.requirements,
      attachments: tender.attachments,
      notes: tender.notes,
      pipelineStage: tender.pipelineStage,
      priority: tender.priority,
      winProbability: tender.winProbability,
      competitors: tender.competitors,
      daysUntilDeadline: tender.daysUntilDeadline,
      urgencyStatus: tender.urgencyStatus,
      discovery: tender.discovery,
      createdAt: tender.createdAt,
      updatedAt: tender.updatedAt
    }));

    res.json({
      success: true,
      data: {
        tenders: transformedTenders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      },
      message: 'Tenders retrieved successfully'
    });

  } catch (error) {
    console.error('Get tenders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tenders',
      message: error.message
    });
  }
};

// Get tender by ID
const getTenderById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    
    const tender = await Tender.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    })
      .populate('owner', 'name email')
      .populate('assignedTo', 'name email')
      .populate('notes.user', 'name email');

    if (!tender) {
      return res.status(404).json({
        success: false,
        error: 'Tender not found',
        message: 'The requested tender does not exist'
      });
    }

    // Transform tender data
    const transformedTender = {
      id: tender._id,
      reference: tender.reference,
      title: tender.title,
      description: tender.description,
      organization: tender.organization,
      location: tender.location,
      estimatedValue: tender.estimatedValue,
      currency: tender.currency,
      deadline: tender.deadline,
      tenderType: tender.tenderType,
      therapeuticArea: tender.therapeuticArea,
      aiMatchScore: tender.aiMatchScore,
      status: tender.status,
      tags: tender.tags,
      publishedDate: tender.publishedDate,
      updatedDate: tender.updatedDate,
      urgency: tender.urgency,
      source: tender.source,
      owner: tender.owner,
      assignedTo: tender.assignedTo,
      dueDates: tender.dueDates,
      requirements: tender.requirements,
      attachments: tender.attachments,
      notes: tender.notes,
      pipelineStage: tender.pipelineStage,
      priority: tender.priority,
      winProbability: tender.winProbability,
      competitors: tender.competitors,
      daysUntilDeadline: tender.daysUntilDeadline,
      urgencyStatus: tender.urgencyStatus,
      discovery: tender.discovery,
      createdAt: tender.createdAt,
      updatedAt: tender.updatedAt
    };

    res.json({
      success: true,
      data: { tender: transformedTender },
      message: 'Tender retrieved successfully'
    });

  } catch (error) {
    console.error('Get tender by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tender',
      message: error.message
    });
  }
};

// Create new tender
const createTender = async (req, res) => {
  try {
    const {
      reference,
      title,
      organization,
      location,
      description,
      estimatedValue,
      currency = 'USD',
      deadline,
      tenderType,
      therapeuticArea,
      source,
      tags = [],
      urgency = 'medium',
      priority = 'medium',
      pipelineStage = 'identified',
      winProbability = 50,
      dueDates = {},
      requirements = {},
      competitors = []
    } = req.body;

    // Validate required fields
    if (!reference || !title || !organization || !location || !description || !estimatedValue || !deadline || !tenderType || !therapeuticArea || !source) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Reference, title, organization, location, description, estimated value, deadline, tender type, therapeutic area, and source are required'
      });
    }

    // Check if tender reference already exists for this company
    const existingTender = await Tender.findOne({
      companyId: req.user.companyId,
      reference: reference.toUpperCase()
    });

    if (existingTender) {
      return res.status(400).json({
        success: false,
        error: 'Tender reference already exists',
        message: 'A tender with this reference already exists'
      });
    }

    // Create tender
    const tender = new Tender({
      companyId: req.user.companyId,
      reference: reference.toUpperCase(),
      title,
      organization,
      location,
      description,
      estimatedValue: parseFloat(estimatedValue),
      currency,
      deadline: new Date(deadline),
      tenderType,
      therapeuticArea,
      source,
      tags,
      urgency,
      priority,
      pipelineStage,
      winProbability: parseInt(winProbability),
      dueDates,
      requirements,
      competitors,
      owner: req.user._id
    });

    await tender.save();

    // Populate the created tender
    await tender.populate('owner', 'name email');

    // Transform tender data for response
    const transformedTender = {
      id: tender._id,
      reference: tender.reference,
      title: tender.title,
      description: tender.description,
      organization: tender.organization,
      location: tender.location,
      estimatedValue: tender.estimatedValue,
      currency: tender.currency,
      deadline: tender.deadline,
      tenderType: tender.tenderType,
      therapeuticArea: tender.therapeuticArea,
      aiMatchScore: tender.aiMatchScore,
      status: tender.status,
      tags: tender.tags,
      publishedDate: tender.publishedDate,
      updatedDate: tender.updatedDate,
      urgency: tender.urgency,
      source: tender.source,
      owner: tender.owner,
      assignedTo: tender.assignedTo,
      dueDates: tender.dueDates,
      requirements: tender.requirements,
      attachments: tender.attachments,
      notes: tender.notes,
      pipelineStage: tender.pipelineStage,
      priority: tender.priority,
      winProbability: tender.winProbability,
      competitors: tender.competitors,
      daysUntilDeadline: tender.daysUntilDeadline,
      urgencyStatus: tender.urgencyStatus,
      discovery: tender.discovery,
      createdAt: tender.createdAt,
      updatedAt: tender.updatedAt
    };

    res.status(201).json({
      success: true,
      data: { tender: transformedTender },
      message: 'Tender created successfully'
    });

  } catch (error) {
    console.error('Create tender error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create tender',
      message: error.message
    });
  }
};

// Update tender
const updateTender = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const updateData = req.body;

    // Find tender
    const tender = await Tender.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!tender) {
      return res.status(404).json({
        success: false,
        error: 'Tender not found',
        message: 'The requested tender does not exist'
      });
    }

    // Check if reference is being changed and if it already exists
    if (updateData.reference && updateData.reference.toUpperCase() !== tender.reference) {
      const existingTender = await Tender.findOne({
        companyId: new mongoose.Types.ObjectId(companyId),
        reference: updateData.reference.toUpperCase(),
        _id: { $ne: id }
      });
      
      if (existingTender) {
        return res.status(400).json({
          success: false,
          error: 'Tender reference already exists',
          message: 'A tender with this reference already exists'
        });
      }
    }

    // Update tender fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (key === 'reference') {
          tender[key] = updateData[key].toUpperCase();
        } else if (key === 'deadline') {
          tender[key] = new Date(updateData[key]);
        } else if (key === 'estimatedValue') {
          tender[key] = parseFloat(updateData[key]);
        } else if (key === 'winProbability') {
          tender[key] = parseInt(updateData[key]);
        } else {
          tender[key] = updateData[key];
        }
      }
    });

    tender.updatedDate = new Date();
    await tender.save();

    // Populate the updated tender
    await tender.populate('owner', 'name email');
    await tender.populate('assignedTo', 'name email');

    // Transform tender data for response
    const transformedTender = {
      id: tender._id,
      reference: tender.reference,
      title: tender.title,
      description: tender.description,
      organization: tender.organization,
      location: tender.location,
      estimatedValue: tender.estimatedValue,
      currency: tender.currency,
      deadline: tender.deadline,
      tenderType: tender.tenderType,
      therapeuticArea: tender.therapeuticArea,
      aiMatchScore: tender.aiMatchScore,
      status: tender.status,
      tags: tender.tags,
      publishedDate: tender.publishedDate,
      updatedDate: tender.updatedDate,
      urgency: tender.urgency,
      source: tender.source,
      owner: tender.owner,
      assignedTo: tender.assignedTo,
      dueDates: tender.dueDates,
      requirements: tender.requirements,
      attachments: tender.attachments,
      notes: tender.notes,
      pipelineStage: tender.pipelineStage,
      priority: tender.priority,
      winProbability: tender.winProbability,
      competitors: tender.competitors,
      daysUntilDeadline: tender.daysUntilDeadline,
      urgencyStatus: tender.urgencyStatus,
      discovery: tender.discovery,
      createdAt: tender.createdAt,
      updatedAt: tender.updatedAt
    };

    res.json({
      success: true,
      data: { tender: transformedTender },
      message: 'Tender updated successfully'
    });

  } catch (error) {
    console.error('Update tender error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update tender',
      message: error.message
    });
  }
};

// Delete tender (soft delete)
const deleteTender = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    // Find tender
    const tender = await Tender.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!tender) {
      return res.status(404).json({
        success: false,
        error: 'Tender not found',
        message: 'The requested tender does not exist'
      });
    }

    // Soft delete
    tender.isDeleted = true;
    tender.updatedDate = new Date();
    await tender.save();

    res.json({
      success: true,
      message: 'Tender deleted successfully'
    });

  } catch (error) {
    console.error('Delete tender error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete tender',
      message: error.message
    });
  }
};

// Get tender statistics
const getTenderStats = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    // Get basic counts
    const totalTenders = await Tender.countDocuments({
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    const activeTenders = await Tender.countDocuments({
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false,
      status: 'active'
    });

    const overdueTenders = await Tender.countDocuments({
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false,
      deadline: { $lt: new Date() },
      status: { $in: ['active', 'overdue'] }
    });

    // Get total value
    const valueAggregation = await Tender.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$estimatedValue' },
          avgValue: { $avg: '$estimatedValue' }
        }
      }
    ]);

    const totalValue = valueAggregation.length > 0 ? valueAggregation[0].totalValue : 0;
    const avgValue = valueAggregation.length > 0 ? valueAggregation[0].avgValue : 0;

    // Get average win probability
    const probabilityAggregation = await Tender.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          avgProbability: { $avg: '$winProbability' }
        }
      }
    ]);

    const avgProbability = probabilityAggregation.length > 0 ? Math.round(probabilityAggregation[0].avgProbability) : 0;

    // Get pipeline stage distribution
    const stageDistribution = await Tender.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$pipelineStage',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get priority distribution
    const priorityDistribution = await Tender.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get upcoming deadlines (next 30 days)
    const upcomingDeadlines = await Tender.countDocuments({
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false,
      deadline: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      status: { $in: ['active', 'overdue'] }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalTenders,
          activeTenders,
          overdueTenders,
          totalValue,
          avgValue,
          avgProbability,
          upcomingDeadlines
        },
        stageDistribution,
        priorityDistribution
      },
      message: 'Tender statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Get tender stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tender statistics',
      message: error.message
    });
  }
};

// Add note to tender
const addTenderNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const companyId = req.user.companyId;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Note content is required',
        message: 'Note content cannot be empty'
      });
    }

    // Find tender
    const tender = await Tender.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!tender) {
      return res.status(404).json({
        success: false,
        error: 'Tender not found',
        message: 'The requested tender does not exist'
      });
    }

    // Add note
    tender.notes.push({
      user: req.user._id,
      content: content.trim()
    });

    tender.updatedDate = new Date();
    await tender.save();

    // Populate the note with user info
    await tender.populate('notes.user', 'name email');

    res.json({
      success: true,
      data: { tender },
      message: 'Note added successfully'
    });

  } catch (error) {
    console.error('Add tender note error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add note',
      message: error.message
    });
  }
};

// Update tender pipeline stage
const updatePipelineStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { pipelineStage } = req.body;
    const companyId = req.user.companyId;

    const validStages = ['identified', 'evaluating', 'pursuing', 'submitted', 'awarded', 'lost'];

    if (!pipelineStage || !validStages.includes(pipelineStage)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pipeline stage',
        message: 'Pipeline stage must be one of: ' + validStages.join(', ')
      });
    }

    // Find tender
    const tender = await Tender.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!tender) {
      return res.status(404).json({
        success: false,
        error: 'Tender not found',
        message: 'The requested tender does not exist'
      });
    }

    // Update pipeline stage
    tender.pipelineStage = pipelineStage;
    tender.updatedDate = new Date();
    await tender.save();

    res.json({
      success: true,
      data: { tender },
      message: 'Pipeline stage updated successfully'
    });

  } catch (error) {
    console.error('Update pipeline stage error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update pipeline stage',
      message: error.message
    });
  }
};

module.exports = {
  getTenders,
  getTenderById,
  createTender,
  updateTender,
  deleteTender,
  getTenderStats,
  addTenderNote,
  updatePipelineStage
};