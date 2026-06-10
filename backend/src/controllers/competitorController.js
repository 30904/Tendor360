const Competitor = require('../models/Competitor');
const WinLossAnalysis = require('../models/WinLossAnalysis');
const Tender = require('../models/Tender');
const mongoose = require('mongoose');

// Helper to format competitor data
const formatCompetitorData = (competitor) => {
  if (!competitor) return null;
  const competitorObj = competitor.toObject ? competitor.toObject({ virtuals: true }) : { ...competitor };
  return competitorObj;
};

// @desc    Get all competitors
// @route   GET /api/competitors
// @access  Private (competitor:read)
exports.getCompetitors = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { 
      page = 1, 
      limit = 20, 
      search, 
      industry, 
      threatLevel, 
      marketPosition, 
      size,
      sortBy = 'threatLevel', 
      sortOrder = -1 
    } = req.query;

    const query = {
      companyId: new mongoose.Types.ObjectId(companyId),
      isActive: true
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (industry) query.industry = industry;
    if (threatLevel) query.threatLevel = threatLevel;
    if (marketPosition) query.marketPosition = marketPosition;
    if (size) query.size = size;

    const sort = {};
    sort[sortBy] = parseInt(sortOrder);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: { path: 'createdBy updatedBy', select: 'name email' },
      lean: true
    };

    const result = await Competitor.paginate(query, options);

    const competitorsWithFormattedData = result.docs.map(formatCompetitorData);

    res.status(200).json({
      success: true,
      data: {
        competitors: competitorsWithFormattedData,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalItems: result.totalDocs,
          itemsPerPage: result.limit
        }
      },
      message: 'Competitors retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting competitors:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve competitors', error: error.message });
  }
};

// @desc    Get competitor by ID
// @route   GET /api/competitors/:id
// @access  Private (competitor:read)
exports.getCompetitorById = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const competitor = await Competitor.findOne({
      _id: req.params.id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isActive: true
    }).populate('createdBy updatedBy', 'name email');

    if (!competitor) {
      return res.status(404).json({ success: false, message: 'Competitor not found' });
    }

    res.status(200).json({ 
      success: true, 
      data: formatCompetitorData(competitor), 
      message: 'Competitor retrieved successfully' 
    });
  } catch (error) {
    console.error('Error getting competitor by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve competitor', error: error.message });
  }
};

// @desc    Create a new competitor
// @route   POST /api/competitors
// @access  Private (competitor:create)
exports.createCompetitor = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const {
      name,
      description,
      website,
      industry,
      size,
      location,
      contactInfo,
      financialInfo,
      capabilities,
      marketPosition,
      threatLevel,
      strengths,
      weaknesses,
      opportunities,
      threats,
      tags
    } = req.body;

    // Check if competitor with same name already exists for this company
    const existingCompetitor = await Competitor.findOne({
      companyId: new mongoose.Types.ObjectId(companyId),
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      isActive: true
    });

    if (existingCompetitor) {
      return res.status(400).json({ 
        success: false, 
        message: 'A competitor with this name already exists for your company.' 
      });
    }

    const newCompetitor = await Competitor.create({
      companyId,
      name,
      description,
      website,
      industry,
      size,
      location,
      contactInfo,
      financialInfo,
      capabilities,
      marketPosition,
      threatLevel,
      strengths,
      weaknesses,
      opportunities,
      threats,
      tags,
      createdBy: req.user.id
    });

    res.status(201).json({ 
      success: true, 
      data: formatCompetitorData(newCompetitor), 
      message: 'Competitor created successfully' 
    });
  } catch (error) {
    console.error('Error creating competitor:', error);
    res.status(500).json({ success: false, message: 'Failed to create competitor', error: error.message });
  }
};

// @desc    Update a competitor
// @route   PUT /api/competitors/:id
// @access  Private (competitor:update)
exports.updateCompetitor = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const {
      name,
      description,
      website,
      industry,
      size,
      location,
      contactInfo,
      financialInfo,
      capabilities,
      marketPosition,
      threatLevel,
      strengths,
      weaknesses,
      opportunities,
      threats,
      tags
    } = req.body;

    const competitor = await Competitor.findOne({
      _id: req.params.id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isActive: true
    });

    if (!competitor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Competitor not found or you do not have permission to update it' 
      });
    }

    // Check for duplicate name if name is changed
    if (name && name.toLowerCase() !== competitor.name.toLowerCase()) {
      const existingCompetitor = await Competitor.findOne({
        companyId: new mongoose.Types.ObjectId(companyId),
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        isActive: true,
        _id: { $ne: competitor._id }
      });

      if (existingCompetitor) {
        return res.status(400).json({ 
          success: false, 
          message: 'A competitor with this name already exists for your company.' 
        });
      }
    }

    // Update competitor fields
    competitor.name = name || competitor.name;
    competitor.description = description || competitor.description;
    competitor.website = website || competitor.website;
    competitor.industry = industry || competitor.industry;
    competitor.size = size || competitor.size;
    competitor.location = location || competitor.location;
    competitor.contactInfo = contactInfo || competitor.contactInfo;
    competitor.financialInfo = financialInfo || competitor.financialInfo;
    competitor.capabilities = capabilities || competitor.capabilities;
    competitor.marketPosition = marketPosition || competitor.marketPosition;
    competitor.threatLevel = threatLevel || competitor.threatLevel;
    competitor.strengths = strengths || competitor.strengths;
    competitor.weaknesses = weaknesses || competitor.weaknesses;
    competitor.opportunities = opportunities || competitor.opportunities;
    competitor.threats = threats || competitor.threats;
    competitor.tags = tags || competitor.tags;
    competitor.updatedBy = req.user.id;

    await competitor.save();

    res.status(200).json({ 
      success: true, 
      data: formatCompetitorData(competitor), 
      message: 'Competitor updated successfully' 
    });
  } catch (error) {
    console.error('Error updating competitor:', error);
    res.status(500).json({ success: false, message: 'Failed to update competitor', error: error.message });
  }
};

// @desc    Delete a competitor
// @route   DELETE /api/competitors/:id
// @access  Private (competitor:delete)
exports.deleteCompetitor = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const competitor = await Competitor.findOneAndUpdate(
      { 
        _id: req.params.id, 
        companyId: new mongoose.Types.ObjectId(companyId), 
        isActive: true 
      },
      { 
        $set: { 
          isActive: false, 
          updatedBy: req.user.id 
        } 
      },
      { new: true }
    );

    if (!competitor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Competitor not found or already deleted' 
      });
    }

    res.status(200).json({ success: true, message: 'Competitor deleted successfully' });
  } catch (error) {
    console.error('Error deleting competitor:', error);
    res.status(500).json({ success: false, message: 'Failed to delete competitor', error: error.message });
  }
};

// @desc    Add intelligence note to competitor
// @route   POST /api/competitors/:id/intelligence
// @access  Private (competitor:update)
exports.addIntelligenceNote = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Intelligence note content is required' 
      });
    }

    const competitor = await Competitor.findOne({
      _id: req.params.id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isActive: true
    });

    if (!competitor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Competitor not found' 
      });
    }

    competitor.intelligence.notes.push({
      content: content.trim(),
      author: req.user.id
    });
    competitor.intelligence.lastUpdated = new Date();
    competitor.updatedBy = req.user.id;

    await competitor.save();

    res.status(200).json({ 
      success: true, 
      data: formatCompetitorData(competitor), 
      message: 'Intelligence note added successfully' 
    });
  } catch (error) {
    console.error('Error adding intelligence note:', error);
    res.status(500).json({ success: false, message: 'Failed to add intelligence note', error: error.message });
  }
};

// @desc    Get competitor statistics
// @route   GET /api/competitors/stats/overview
// @access  Private (competitor:read)
exports.getCompetitorStats = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const totalCompetitors = await Competitor.countDocuments({
      companyId: new mongoose.Types.ObjectId(companyId),
      isActive: true
    });

    const threatLevelStats = await Competitor.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId), isActive: true } },
      { $group: { _id: '$threatLevel', count: { $sum: 1 } } }
    ]);

    const marketPositionStats = await Competitor.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId), isActive: true } },
      { $group: { _id: '$marketPosition', count: { $sum: 1 } } }
    ]);

    const industryStats = await Competitor.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId), isActive: true } },
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const avgWinRate = await Competitor.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId), isActive: true, totalTenders: { $gt: 0 } } },
      { $group: { _id: null, avgWinRate: { $avg: '$winRate' } } }
    ]);

    const totalTenders = await Competitor.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId), isActive: true } },
      { $group: { _id: null, total: { $sum: '$totalTenders' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalCompetitors,
          threatLevelStats: threatLevelStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {}),
          marketPositionStats: marketPositionStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {}),
          industryStats,
          avgWinRate: avgWinRate.length > 0 ? Math.round(avgWinRate[0].avgWinRate) : 0,
          totalTenders: totalTenders.length > 0 ? totalTenders[0].total : 0
        }
      },
      message: 'Competitor statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting competitor stats:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve competitor statistics', error: error.message });
  }
};

// @desc    Get win/loss analysis for a competitor
// @route   GET /api/competitors/:id/win-loss-analysis
// @access  Private (competitor:read)
exports.getWinLossAnalysis = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { page = 1, limit = 20, outcome, sortBy = 'analysisDate', sortOrder = -1 } = req.query;

    const query = {
      companyId: new mongoose.Types.ObjectId(companyId),
      competitorId: new mongoose.Types.ObjectId(req.params.id),
      isActive: true
    };

    if (outcome) query.outcome = outcome;

    const sort = {};
    sort[sortBy] = parseInt(sortOrder);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: { path: 'analyzedBy', select: 'name email' },
      lean: true
    };

    const result = await WinLossAnalysis.paginate(query, options);

    res.status(200).json({
      success: true,
      data: {
        analyses: result.docs,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalItems: result.totalDocs,
          itemsPerPage: result.limit
        }
      },
      message: 'Win/loss analysis retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting win/loss analysis:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve win/loss analysis', error: error.message });
  }
};

// @desc    Create win/loss analysis
// @route   POST /api/competitors/:id/win-loss-analysis
// @access  Private (competitor:create)
exports.createWinLossAnalysis = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const {
      tenderId,
      outcome,
      bidValue,
      currency,
      winValue,
      competitorBidValue,
      competitorWinValue,
      analysisFactors,
      keyFactors,
      lessonsLearned,
      recommendations,
      competitorInsights,
      marketInsights
    } = req.body;

    // Check if analysis already exists for this tender
    const existingAnalysis = await WinLossAnalysis.findOne({
      companyId: new mongoose.Types.ObjectId(companyId),
      tenderId: new mongoose.Types.ObjectId(tenderId),
      isActive: true
    });

    if (existingAnalysis) {
      return res.status(400).json({ 
        success: false, 
        message: 'Win/loss analysis already exists for this tender' 
      });
    }

    // Get tender details
    const tender = await Tender.findOne({
      _id: tenderId,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!tender) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tender not found' 
      });
    }

    const newAnalysis = await WinLossAnalysis.create({
      companyId,
      competitorId: req.params.id,
      tenderId,
      outcome,
      bidValue,
      currency,
      winValue,
      competitorBidValue,
      competitorWinValue,
      analysisFactors,
      keyFactors,
      lessonsLearned,
      recommendations,
      competitorInsights,
      marketInsights,
      tenderDetails: {
        title: tender.title,
        organization: tender.organization,
        tenderType: tender.tenderType,
        estimatedValue: tender.estimatedValue,
        deadline: tender.deadline,
        location: tender.location
      },
      analyzedBy: req.user.id
    });

    // Update competitor statistics
    const competitor = await Competitor.findById(req.params.id);
    if (competitor) {
      competitor.totalTenders += 1;
      if (outcome === 'Won') {
        competitor.wonTenders += 1;
      } else if (outcome === 'Lost') {
        competitor.lostTenders += 1;
      }
      competitor.winRate = competitor.calculatedWinRate;
      competitor.updatedBy = req.user.id;
      await competitor.save();
    }

    res.status(201).json({ 
      success: true, 
      data: newAnalysis, 
      message: 'Win/loss analysis created successfully' 
    });
  } catch (error) {
    console.error('Error creating win/loss analysis:', error);
    res.status(500).json({ success: false, message: 'Failed to create win/loss analysis', error: error.message });
  }
};
