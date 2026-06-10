const MarketDeclaration = require('../models/MarketDeclaration');
const mongoose = require('mongoose');

// @desc    Get all market declarations
// @route   GET /api/market-declarations
// @access  Private (market-declaration:read)
exports.getMarketDeclarations = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { 
      page = 1, 
      limit = 20, 
      search, 
      type, 
      category, 
      status, 
      priority,
      sortBy = 'createdAt', 
      sortOrder = -1 
    } = req.query;

    const query = {
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    };

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { keywords: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter functionality
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const sort = {};
    sort[sortBy] = parseInt(sortOrder);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: [
        { path: 'createdBy', select: 'name email' },
        { path: 'updatedBy', select: 'name email' }
      ],
      lean: true
    };

    const result = await MarketDeclaration.paginate(query, options);

    res.status(200).json({
      success: true,
      data: {
        declarations: result.docs,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalItems: result.totalDocs,
          itemsPerPage: result.limit
        }
      },
      message: 'Market declarations retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting market declarations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve market declarations', 
      error: error.message 
    });
  }
};

// @desc    Get market declaration by ID
// @route   GET /api/market-declarations/:id
// @access  Private (market-declaration:read)
exports.getMarketDeclarationById = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const declaration = await MarketDeclaration.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    })
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .populate('reviewers.user', 'name email');

    if (!declaration) {
      return res.status(404).json({
        success: false,
        message: 'Market declaration not found'
      });
    }

    // Increment view count
    await MarketDeclaration.findByIdAndUpdate(id, {
      $inc: { 'analytics.views': 1 },
      $set: { 'analytics.lastViewed': new Date() }
    });

    res.status(200).json({
      success: true,
      data: { declaration },
      message: 'Market declaration retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting market declaration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve market declaration', 
      error: error.message 
    });
  }
};

// @desc    Create new market declaration
// @route   POST /api/market-declarations
// @access  Private (market-declaration:create)
exports.createMarketDeclaration = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user._id;

    const declarationData = {
      ...req.body,
      companyId: new mongoose.Types.ObjectId(companyId),
      createdBy: userId,
      updatedBy: userId
    };

    // Set publish date if status is Published
    if (declarationData.status === 'Published' && !declarationData.publishDate) {
      declarationData.publishDate = new Date();
    }

    const declaration = await MarketDeclaration.create(declarationData);

    const populatedDeclaration = await MarketDeclaration.findById(declaration._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.status(201).json({
      success: true,
      data: { declaration: populatedDeclaration },
      message: 'Market declaration created successfully'
    });
  } catch (error) {
    console.error('Error creating market declaration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create market declaration', 
      error: error.message 
    });
  }
};

// @desc    Update market declaration
// @route   PUT /api/market-declarations/:id
// @access  Private (market-declaration:update)
exports.updateMarketDeclaration = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user._id;
    const { id } = req.params;

    const existingDeclaration = await MarketDeclaration.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!existingDeclaration) {
      return res.status(404).json({
        success: false,
        message: 'Market declaration not found'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: userId
    };

    // Set publish date if status is being changed to Published
    if (updateData.status === 'Published' && existingDeclaration.status !== 'Published') {
      updateData.publishDate = new Date();
    }

    // Increment version if significant changes
    if (updateData.title || updateData.description) {
      updateData.version = existingDeclaration.version + 1;
      
      // Store previous version
      updateData.previousVersions = [
        ...existingDeclaration.previousVersions,
        {
          version: existingDeclaration.version,
          title: existingDeclaration.title,
          description: existingDeclaration.description,
          updatedAt: existingDeclaration.updatedAt,
          updatedBy: existingDeclaration.updatedBy
        }
      ];
    }

    const declaration = await MarketDeclaration.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      data: { declaration },
      message: 'Market declaration updated successfully'
    });
  } catch (error) {
    console.error('Error updating market declaration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update market declaration', 
      error: error.message 
    });
  }
};

// @desc    Delete market declaration (soft delete)
// @route   DELETE /api/market-declarations/:id
// @access  Private (market-declaration:delete)
exports.deleteMarketDeclaration = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const declaration = await MarketDeclaration.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!declaration) {
      return res.status(404).json({
        success: false,
        message: 'Market declaration not found'
      });
    }

    await MarketDeclaration.findByIdAndUpdate(id, {
      isDeleted: true,
      updatedBy: req.user._id
    });

    res.status(200).json({
      success: true,
      message: 'Market declaration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting market declaration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete market declaration', 
      error: error.message 
    });
  }
};

// @desc    Get market declaration statistics
// @route   GET /api/market-declarations/stats/overview
// @access  Private (market-declaration:read)
exports.getMarketDeclarationStats = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const stats = await MarketDeclaration.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          totalDeclarations: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ['$status', 'Published'] }, 1, 0] }
          },
          draft: {
            $sum: { $cond: [{ $eq: ['$status', 'Draft'] }, 1, 0] }
          },
          review: {
            $sum: { $cond: [{ $eq: ['$status', 'Review'] }, 1, 0] }
          },
          archived: {
            $sum: { $cond: [{ $eq: ['$status', 'Archived'] }, 1, 0] }
          },
          totalViews: { $sum: '$analytics.views' },
          totalDownloads: { $sum: '$analytics.downloads' },
          avgGrowthRate: { $avg: '$growthRate' },
          avgAiConfidence: { $avg: '$aiConfidence' },
          totalMarketSize: { $sum: '$marketSize' }
        }
      }
    ]);

    const categoryStats = await MarketDeclaration.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgGrowthRate: { $avg: '$growthRate' },
          totalMarketSize: { $sum: '$marketSize' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const typeStats = await MarketDeclaration.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgAiConfidence: { $avg: '$aiConfidence' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const expiringSoon = await MarketDeclaration.countDocuments({
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false,
      expiryDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    });

    const result = stats[0] || {
      totalDeclarations: 0,
      published: 0,
      draft: 0,
      review: 0,
      archived: 0,
      totalViews: 0,
      totalDownloads: 0,
      avgGrowthRate: 0,
      avgAiConfidence: 0,
      totalMarketSize: 0
    };

    res.status(200).json({
      success: true,
      data: {
        overview: {
          ...result,
          expiringSoon,
          avgGrowthRate: Math.round(result.avgGrowthRate * 10) / 10,
          avgAiConfidence: Math.round(result.avgAiConfidence * 10) / 10
        },
        categoryStats,
        typeStats
      },
      message: 'Market declaration statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting market declaration stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve market declaration statistics', 
      error: error.message 
    });
  }
};

// @desc    Publish market declaration
// @route   PATCH /api/market-declarations/:id/publish
// @access  Private (market-declaration:update)
exports.publishMarketDeclaration = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const declaration = await MarketDeclaration.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!declaration) {
      return res.status(404).json({
        success: false,
        message: 'Market declaration not found'
      });
    }

    if (declaration.status === 'Published') {
      return res.status(400).json({
        success: false,
        message: 'Market declaration is already published'
      });
    }

    const updatedDeclaration = await MarketDeclaration.findByIdAndUpdate(
      id,
      {
        status: 'Published',
        publishDate: new Date(),
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      data: { declaration: updatedDeclaration },
      message: 'Market declaration published successfully'
    });
  } catch (error) {
    console.error('Error publishing market declaration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to publish market declaration', 
      error: error.message 
    });
  }
};

// @desc    Archive market declaration
// @route   PATCH /api/market-declarations/:id/archive
// @access  Private (market-declaration:update)
exports.archiveMarketDeclaration = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const declaration = await MarketDeclaration.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!declaration) {
      return res.status(404).json({
        success: false,
        message: 'Market declaration not found'
      });
    }

    const updatedDeclaration = await MarketDeclaration.findByIdAndUpdate(
      id,
      {
        status: 'Archived',
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      data: { declaration: updatedDeclaration },
      message: 'Market declaration archived successfully'
    });
  } catch (error) {
    console.error('Error archiving market declaration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to archive market declaration', 
      error: error.message 
    });
  }
};

// @desc    Add reviewer to market declaration
// @route   POST /api/market-declarations/:id/reviewers
// @access  Private (market-declaration:update)
exports.addReviewer = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;
    const { userId, comments } = req.body;

    const declaration = await MarketDeclaration.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!declaration) {
      return res.status(404).json({
        success: false,
        message: 'Market declaration not found'
      });
    }

    // Check if reviewer already exists
    const existingReviewer = declaration.reviewers.find(
      reviewer => reviewer.user.toString() === userId
    );

    if (existingReviewer) {
      return res.status(400).json({
        success: false,
        message: 'Reviewer already added to this declaration'
      });
    }

    const updatedDeclaration = await MarketDeclaration.findByIdAndUpdate(
      id,
      {
        $push: {
          reviewers: {
            user: userId,
            status: 'Pending',
            comments: comments || ''
          }
        },
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .populate('reviewers.user', 'name email');

    res.status(200).json({
      success: true,
      data: { declaration: updatedDeclaration },
      message: 'Reviewer added successfully'
    });
  } catch (error) {
    console.error('Error adding reviewer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add reviewer', 
      error: error.message 
    });
  }
};
