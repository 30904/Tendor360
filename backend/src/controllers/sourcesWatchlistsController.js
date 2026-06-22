const mongoose = require('mongoose');
const TenderSource = require('../models/TenderSource');
const Watchlist = require('../models/Watchlist');
const User = require('../models/User');
const { resolveCompanyObjectId } = require('../utils/resolveCompanyObjectId');
const { executeWatchlistRun } = require('../services/WatchlistMatchService');

// ==================== TENDER SOURCES ====================

// Get all tender sources with filtering, pagination, and search
const getTenderSources = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      status,
      priority,
      reliability,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const companyOid = resolveCompanyObjectId(req.companyId || req.user?.companyId);
    if (!companyOid) {
      return res.status(400).json({ success: false, message: 'Company context required' });
    }

    // Build filter object
    const filter = {
      companyId: companyOid,
      isDeleted: false
    };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type) {
      filter.type = type;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (reliability) {
      filter.reliability = reliability;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination and populate
    const sources = await TenderSource.find(filter)
      .populate('owner', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await TenderSource.countDocuments(filter);

    res.json({
      success: true,
      data: {
        sources: sources.map((s) => maskSourceCredentials(s)),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      },
      message: 'Tender sources retrieved successfully'
    });

  } catch (error) {
    console.error('Get tender sources error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tender sources',
      message: error.message
    });
  }
};

// Get tender source by ID
const getTenderSourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    
    const source = await TenderSource.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    })
      .populate('owner', 'name email')
      .populate('assignedTo', 'name email')
      .populate('notes.user', 'name email');

    if (!source) {
      return res.status(404).json({
        success: false,
        error: 'Tender source not found',
        message: 'The requested tender source does not exist'
      });
    }

    let responseSource = maskSourceCredentials(source);
    
    // Check if we have an Excel file attached, and load its keywords to show in UI
    if (source.keywordFilePath) {
      try {
        const { loadKeywordsFromFile } = require('../modules/tender-discovery/services/ExcelKeywordLoaderService');
        responseSource.excelKeywords = loadKeywordsFromFile(source.keywordFilePath);
      } catch (e) {
        responseSource.excelKeywords = [];
        console.warn(`Could not load excel keywords for UI display:`, e.message);
      }
    }

    res.json({
      success: true,
      data: { source: responseSource },
      message: 'Tender source retrieved successfully'
    });

  } catch (error) {
    console.error('Get tender source by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tender source',
      message: error.message
    });
  }
};

// Create new tender source
const createTenderSource = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      url,
      priority = 'medium',
      reliability = 'medium',
      frequency = 'daily',
      categories = [],
      keywords = [],
      regions = [],
      sectors = [],
      requiresAuth = false,
      authCredentials = {},
      parsingConfig = {},
      notifications = {},
      tags = [],
      integrationMode = 'api',
      connectorTemplate = 'generic_api',
      discoveryConfig = {},
      scrapingConfig = {}
    } = req.body;

    // Validate required fields
    if (!name || !description || !type || !url) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, description, type, and URL are required'
      });
    }

    // Check if source name already exists for this company
    const existingSource = await TenderSource.findOne({
      companyId: req.user.companyId,
      name: name.trim()
    });

    if (existingSource) {
      return res.status(400).json({
        success: false,
        error: 'Source name already exists',
        message: 'A source with this name already exists'
      });
    }

    // Create source
    const source = new TenderSource({
      companyId: req.user.companyId,
      name: name.trim(),
      description: description.trim(),
      type,
      url: url.trim(),
      priority,
      reliability,
      frequency,
      categories,
      keywords,
      regions,
      sectors,
      requiresAuth,
      authCredentials,
      parsingConfig,
      notifications,
      tags,
      integrationMode,
      connectorTemplate,
      discoveryConfig,
      scrapingConfig,
      owner: req.user._id
    });

    await source.save();

    // Populate the created source
    await source.populate('owner', 'name email');

    res.status(201).json({
      success: true,
      data: { source: maskSourceCredentials(source) },
      message: 'Tender source created successfully'
    });

  } catch (error) {
    console.error('Create tender source error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create tender source',
      message: error.message
    });
  }
};

// Update tender source
const updateTenderSource = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const updateData = req.body;

    // Find source
    const source = await TenderSource.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        error: 'Tender source not found',
        message: 'The requested tender source does not exist'
      });
    }

    // Check if name is being changed and if it already exists
    if (updateData.name && updateData.name.trim() !== source.name) {
      const existingSource = await TenderSource.findOne({
        companyId: new mongoose.Types.ObjectId(companyId),
        name: updateData.name.trim(),
        _id: { $ne: id }
      });
      
      if (existingSource) {
        return res.status(400).json({
          success: false,
          error: 'Source name already exists',
          message: 'A source with this name already exists'
        });
      }
    }

    if (updateData.authCredentials) {
      source.authCredentials = applyCredentialMerge(
        source.authCredentials || {},
        updateData.authCredentials
      );
      delete updateData.authCredentials;
    }

    if (updateData.scrapingConfig) {
      const scraping = { ...(source.scrapingConfig || {}), ...updateData.scrapingConfig };
      if (updateData.scrapingConfig.loginPassword === MASK) {
        scraping.loginPassword = source.scrapingConfig?.loginPassword;
      }
      source.scrapingConfig = scraping;
      delete updateData.scrapingConfig;
    }

    if (updateData.discoveryConfig) {
      source.discoveryConfig = { ...(source.discoveryConfig || {}), ...updateData.discoveryConfig };
      delete updateData.discoveryConfig;
    }

    // Update source fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (key === 'name' || key === 'description' || key === 'url') {
          source[key] = updateData[key].trim();
        } else {
          source[key] = updateData[key];
        }
      }
    });

    await source.save();

    // Populate the updated source
    await source.populate('owner', 'name email');
    await source.populate('assignedTo', 'name email');

    res.json({
      success: true,
      data: { source: maskSourceCredentials(source) },
      message: 'Tender source updated successfully'
    });

  } catch (error) {
    console.error('Update tender source error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update tender source',
      message: error.message
    });
  }
};

// Delete tender source (soft delete)
const deleteTenderSource = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    // Find source
    const source = await TenderSource.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        error: 'Tender source not found',
        message: 'The requested tender source does not exist'
      });
    }

    // Soft delete
    source.isDeleted = true;
    await source.save();

    res.json({
      success: true,
      message: 'Tender source deleted successfully'
    });

  } catch (error) {
    console.error('Delete tender source error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete tender source',
      message: error.message
    });
  }
};

// Sync tender source
const discoveryService = require('../modules/tender-discovery/services/DiscoveryService');
const { resolveConnectorType } = require('../modules/tender-discovery/utils/resolveConnectorType');
const {
  maskSourceCredentials,
  applyCredentialMerge,
  MASK
} = require('../modules/tender-discovery/utils/connectorConfigBuilder');

const syncTenderSource = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    // Find source
    const source = await TenderSource.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        error: 'Tender source not found',
        message: 'The requested tender source does not exist'
      });
    }

    const connectorType = resolveConnectorType(source);
    const job = await discoveryService.createJob({
      companyId,
      userId: req.user._id,
      connectorType,
      sourceId: source._id,
      trigger: 'manual'
    });

    const completedJob = await discoveryService.runJob(job._id);
    const TenderDiscoveryJob = require('../modules/tender-discovery/models/TenderDiscoveryJob');
    const freshJob = await TenderDiscoveryJob.findById(completedJob._id).lean();

    const updatedSource = await TenderSource.findById(source._id);
    const newTendersCount = freshJob?.stats?.imported || 0;

    res.json({
      success: true,
      data: { 
        source: maskSourceCredentials(updatedSource),
        job: freshJob,
        syncResult: {
          success: true,
          newTenders: newTendersCount,
          duplicates: freshJob?.stats?.duplicates || 0,
          failed: freshJob?.stats?.failed || 0
        }
      },
      message: 'Discovery run completed successfully'
    });

  } catch (error) {
    console.error('Sync tender source error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync tender source',
      message: error.message
    });
  }
};

// ==================== WATCHLISTS ====================

// Get all watchlists with filtering, pagination, and search
const getWatchlists = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      priority,
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
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination and populate
    const watchlists = await Watchlist.find(filter)
      .populate('owner', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Watchlist.countDocuments(filter);

    res.json({
      success: true,
      data: {
        watchlists,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      },
      message: 'Watchlists retrieved successfully'
    });

  } catch (error) {
    console.error('Get watchlists error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve watchlists',
      message: error.message
    });
  }
};

// Get watchlist by ID
const getWatchlistById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    
    const watchlist = await Watchlist.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    })
      .populate('owner', 'name email')
      .populate('assignedTo', 'name email')
      .populate('notes.user', 'name email')
      .populate('alerts.tenderId', 'title reference organization estimatedValue deadline');

    if (!watchlist) {
      return res.status(404).json({
        success: false,
        error: 'Watchlist not found',
        message: 'The requested watchlist does not exist'
      });
    }

    res.json({
      success: true,
      data: { watchlist },
      message: 'Watchlist retrieved successfully'
    });

  } catch (error) {
    console.error('Get watchlist by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve watchlist',
      message: error.message
    });
  }
};

// Create new watchlist
const createWatchlist = async (req, res) => {
  try {
    const {
      name,
      description,
      priority = 'medium',
      frequency = 'daily',
      keywords = [],
      categories = [],
      sectors = [],
      regions = [],
      minValue = 0,
      maxValue = null,
      currency = 'USD',
      daysAhead = 30,
      daysBehind = 7,
      organizations = [],
      excludeOrganizations = [],
      tenderTypes = [],
      therapeuticAreas = [],
      notifications = {},
      tags = []
    } = req.body;

    // Validate required fields
    if (!name || !description || !keywords || keywords.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, description, and at least one keyword are required'
      });
    }

    // Check if watchlist name already exists for this company
    const existingWatchlist = await Watchlist.findOne({
      companyId: req.user.companyId,
      name: name.trim()
    });

    if (existingWatchlist) {
      return res.status(400).json({
        success: false,
        error: 'Watchlist name already exists',
        message: 'A watchlist with this name already exists'
      });
    }

    // Create watchlist
    const watchlist = new Watchlist({
      companyId: req.user.companyId,
      name: name.trim(),
      description: description.trim(),
      priority,
      frequency,
      keywords,
      categories,
      sectors,
      regions,
      minValue,
      maxValue,
      currency,
      daysAhead,
      daysBehind,
      organizations,
      excludeOrganizations,
      tenderTypes,
      therapeuticAreas,
      notifications,
      tags,
      owner: req.user._id
    });

    await watchlist.save();

    // Populate the created watchlist
    await watchlist.populate('owner', 'name email');

    res.status(201).json({
      success: true,
      data: { watchlist },
      message: 'Watchlist created successfully'
    });

  } catch (error) {
    console.error('Create watchlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create watchlist',
      message: error.message
    });
  }
};

// Update watchlist
const updateWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const updateData = req.body;

    // Find watchlist
    const watchlist = await Watchlist.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!watchlist) {
      return res.status(404).json({
        success: false,
        error: 'Watchlist not found',
        message: 'The requested watchlist does not exist'
      });
    }

    // Check if name is being changed and if it already exists
    if (updateData.name && updateData.name.trim() !== watchlist.name) {
      const existingWatchlist = await Watchlist.findOne({
        companyId: new mongoose.Types.ObjectId(companyId),
        name: updateData.name.trim(),
        _id: { $ne: id }
      });
      
      if (existingWatchlist) {
        return res.status(400).json({
          success: false,
          error: 'Watchlist name already exists',
          message: 'A watchlist with this name already exists'
        });
      }
    }

    // Update watchlist fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (key === 'name' || key === 'description') {
          watchlist[key] = updateData[key].trim();
        } else {
          watchlist[key] = updateData[key];
        }
      }
    });

    await watchlist.save();

    // Populate the updated watchlist
    await watchlist.populate('owner', 'name email');
    await watchlist.populate('assignedTo', 'name email');

    res.json({
      success: true,
      data: { watchlist },
      message: 'Watchlist updated successfully'
    });

  } catch (error) {
    console.error('Update watchlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update watchlist',
      message: error.message
    });
  }
};

// Delete watchlist (soft delete)
const deleteWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    // Find watchlist
    const watchlist = await Watchlist.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!watchlist) {
      return res.status(404).json({
        success: false,
        error: 'Watchlist not found',
        message: 'The requested watchlist does not exist'
      });
    }

    // Soft delete
    watchlist.isDeleted = true;
    await watchlist.save();

    res.json({
      success: true,
      message: 'Watchlist deleted successfully'
    });

  } catch (error) {
    console.error('Delete watchlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete watchlist',
      message: error.message
    });
  }
};

// Run watchlist
const runWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    // Find watchlist
    const watchlist = await Watchlist.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!watchlist) {
      return res.status(404).json({
        success: false,
        error: 'Watchlist not found',
        message: 'The requested watchlist does not exist'
      });
    }

    if (watchlist.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Watchlist inactive',
        message: 'Only active watchlists can be run'
      });
    }

    const runResult = await executeWatchlistRun(watchlist);

    res.json({
      success: true,
      data: {
        watchlist,
        runResult
      },
      message:
        runResult.matchesFound > 0
          ? `Watchlist run completed — ${runResult.matchesFound} new match(es) found`
          : 'Watchlist run completed — no new matches found'
    });

  } catch (error) {
    console.error('Run watchlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run watchlist',
      message: error.message
    });
  }
};

// ==================== STATISTICS ====================

// Get sources and watchlists statistics
const getSourcesWatchlistsStats = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    // Get source statistics
    const totalSources = await TenderSource.countDocuments({
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    const activeSources = await TenderSource.countDocuments({
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false,
      status: 'active'
    });

    // Get watchlist statistics
    const totalWatchlists = await Watchlist.countDocuments({
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    const activeWatchlists = await Watchlist.countDocuments({
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false,
      status: 'active'
    });

    // Get total alerts
    const totalAlertsResult = await Watchlist.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          totalAlerts: { $sum: '$totalAlerts' }
        }
      }
    ]);
    const totalAlerts = totalAlertsResult.length > 0 ? totalAlertsResult[0].totalAlerts : 0;

    // Get total tenders from sources
    const totalTendersResult = await TenderSource.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          totalTenders: { $sum: '$totalTenders' }
        }
      }
    ]);
    const totalTenders = totalTendersResult.length > 0 ? totalTendersResult[0].totalTenders : 0;

    // Get new tenders from sources
    const newTendersResult = await TenderSource.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          newTenders: { $sum: '$newTenders' }
        }
      }
    ]);
    const newTenders = newTendersResult.length > 0 ? newTendersResult[0].newTenders : 0;

    // Calculate average AI confidence
    const aiConfidenceResult = await TenderSource.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: '$aiConfidence' }
        }
      }
    ]);
    const avgAiConfidence = aiConfidenceResult.length > 0 ? Math.round(aiConfidenceResult[0].avgConfidence) : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalSources,
          activeSources,
          totalWatchlists,
          activeWatchlists,
          totalAlerts,
          totalTenders,
          newTenders,
          avgAiConfidence
        }
      },
      message: 'Sources and watchlists statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Get sources watchlists stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics',
      message: error.message
    });
  }
};

// Add note to source or watchlist
const addNote = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { content } = req.body;
    const companyId = req.user.companyId;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Note content is required',
        message: 'Note content cannot be empty'
      });
    }

    let item;
    if (type === 'source') {
      item = await TenderSource.findOne({
        _id: id,
        companyId: new mongoose.Types.ObjectId(companyId),
        isDeleted: false
      });
    } else if (type === 'watchlist') {
      item = await Watchlist.findOne({
        _id: id,
        companyId: new mongoose.Types.ObjectId(companyId),
        isDeleted: false
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid type',
        message: 'Type must be either "source" or "watchlist"'
      });
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        error: `${type} not found`,
        message: `The requested ${type} does not exist`
      });
    }

    // Add note
    await item.addNote(req.user._id, content);

    // Populate the item with user info
    await item.populate('notes.user', 'name email');

    res.json({
      success: true,
      data: { [type]: item },
      message: 'Note added successfully'
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add note',
      message: error.message
    });
  }
};

module.exports = {
  // Tender Sources
  getTenderSources,
  getTenderSourceById,
  createTenderSource,
  updateTenderSource,
  deleteTenderSource,
  syncTenderSource,
  
  // Watchlists
  getWatchlists,
  getWatchlistById,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  runWatchlist,
  
  // Statistics and utilities
  getSourcesWatchlistsStats,
  addNote
};
