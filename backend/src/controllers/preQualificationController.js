const PreQualificationVendor = require('../models/PreQualificationVendor');
const PreQualificationAudit = require('../models/PreQualificationAudit');
const { getPagination } = require('../utils/pagination');

// --- Vendor Management ---

exports.createVendor = async (req, res) => {
  try {
    const { companyId, _id: userId } = req.user;
    const vendor = new PreQualificationVendor({
      ...req.body,
      companyId,
      createdBy: userId,
    });
    await vendor.save();
    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getVendors = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { page, limit, skip } = getPagination(req.query);
    const query = { companyId };

    // Build search query
    if (req.query.search) {
      query.$or = [
        { companyName: { $regex: req.query.search, $options: 'i' } },
        { vendorId: { $regex: req.query.search, $options: 'i' } },
        { industry: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Add filters
    if (req.query.status) query.status = req.query.status;
    if (req.query.qualificationLevel) query.qualificationLevel = req.query.qualificationLevel;
    if (req.query.industry) query.industry = req.query.industry;
    if (req.query.category) query.category = req.query.category;
    if (req.query.preQualificationStatus) query.preQualificationStatus = req.query.preQualificationStatus;

    const vendors = await PreQualificationVendor.find(query)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalItems = await PreQualificationVendor.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        vendors,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVendorById = async (req, res) => {
  try {
    const { companyId } = req.user;
    const vendor = await PreQualificationVendor.findOne({ _id: req.params.id, companyId })
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('lastReviewedBy', 'name email');
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    const { companyId, _id: userId } = req.user;
    const vendor = await PreQualificationVendor.findOneAndUpdate(
      { _id: req.params.id, companyId },
      { ...req.body, lastReviewedBy: userId, lastReviewedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    const { companyId } = req.user;
    const vendor = await PreQualificationVendor.findOneAndDelete({ _id: req.params.id, companyId });
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({ success: true, message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveVendor = async (req, res) => {
  try {
    const { companyId, _id: userId } = req.user;
    const { qualificationLevel, preQualificationExpiry } = req.body;
    
    const vendor = await PreQualificationVendor.findOneAndUpdate(
      { _id: req.params.id, companyId },
      {
        status: 'Approved',
        qualificationLevel,
        preQualificationStatus: 'Completed',
        preQualificationDate: new Date(),
        preQualificationExpiry,
        approvedBy: userId,
        approvedAt: new Date(),
        lastReviewedBy: userId,
        lastReviewedAt: new Date(),
      },
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.rejectVendor = async (req, res) => {
  try {
    const { companyId, _id: userId } = req.user;
    const { reason } = req.body;
    
    const vendor = await PreQualificationVendor.findOneAndUpdate(
      { _id: req.params.id, companyId },
      {
        status: 'Rejected',
        preQualificationStatus: 'Expired',
        lastReviewedBy: userId,
        lastReviewedAt: new Date(),
        $push: {
          notes: {
            user: userId,
            note: `Vendor rejected: ${reason}`,
          },
        },
      },
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getVendorStats = async (req, res) => {
  try {
    const { companyId } = req.user;
    
    const totalVendors = await PreQualificationVendor.countDocuments({ companyId });
    const statusCounts = await PreQualificationVendor.aggregate([
      { $match: { companyId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const qualificationLevelCounts = await PreQualificationVendor.aggregate([
      { $match: { companyId } },
      { $group: { _id: '$qualificationLevel', count: { $sum: 1 } } },
    ]);
    const industryCounts = await PreQualificationVendor.aggregate([
      { $match: { companyId } },
      { $group: { _id: '$industry', count: { $sum: 1 } } },
    ]);

    // Calculate expiring certifications
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    
    const expiringCertifications = await PreQualificationVendor.aggregate([
      { $match: { companyId } },
      { $unwind: '$certifications' },
      {
        $match: {
          'certifications.expiryDate': { $lte: threeMonthsFromNow },
          'certifications.status': 'VALID'
        }
      },
      { $count: 'count' }
    ]);

    // Calculate average performance metrics
    const avgPerformance = await PreQualificationVendor.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: null,
          avgOnTimeDelivery: { $avg: '$performanceMetrics.onTimeDelivery' },
          avgQualityRating: { $avg: '$performanceMetrics.qualityRating' },
          avgCostCompetitiveness: { $avg: '$performanceMetrics.costCompetitiveness' },
          avgCommunicationRating: { $avg: '$performanceMetrics.communicationRating' },
          avgOverallRating: { $avg: '$performanceMetrics.overallRating' },
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalVendors,
        statusCounts,
        qualificationLevelCounts,
        industryCounts,
        expiringCertifications: expiringCertifications[0]?.count || 0,
        avgPerformance: avgPerformance[0] || {},
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Audit Management ---

exports.createAudit = async (req, res) => {
  try {
    const { companyId, _id: userId } = req.user;
    const audit = new PreQualificationAudit({
      ...req.body,
      companyId,
      createdBy: userId,
    });
    await audit.save();
    res.status(201).json({ success: true, data: audit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAudits = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { page, limit, skip } = getPagination(req.query);
    const query = { companyId };

    if (req.query.vendorId) query.vendorId = req.query.vendorId;
    if (req.query.auditType) query.auditType = req.query.auditType;
    if (req.query.status) query.status = req.query.status;

    const audits = await PreQualificationAudit.find(query)
      .populate('vendorId', 'companyName vendorId')
      .populate('createdBy', 'name email')
      .sort({ auditDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalItems = await PreQualificationAudit.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        audits,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuditById = async (req, res) => {
  try {
    const { companyId } = req.user;
    const audit = await PreQualificationAudit.findOne({ _id: req.params.id, companyId })
      .populate('vendorId', 'companyName vendorId')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email');
    
    if (!audit) {
      return res.status(404).json({ success: false, message: 'Audit not found' });
    }
    res.status(200).json({ success: true, data: audit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAudit = async (req, res) => {
  try {
    const { companyId } = req.user;
    const audit = await PreQualificationAudit.findOneAndUpdate(
      { _id: req.params.id, companyId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!audit) {
      return res.status(404).json({ success: false, message: 'Audit not found' });
    }
    res.status(200).json({ success: true, data: audit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAudit = async (req, res) => {
  try {
    const { companyId } = req.user;
    const audit = await PreQualificationAudit.findOneAndDelete({ _id: req.params.id, companyId });
    
    if (!audit) {
      return res.status(404).json({ success: false, message: 'Audit not found' });
    }
    res.status(200).json({ success: true, message: 'Audit deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuditStats = async (req, res) => {
  try {
    const { companyId } = req.user;
    
    const totalAudits = await PreQualificationAudit.countDocuments({ companyId });
    const statusCounts = await PreQualificationAudit.aggregate([
      { $match: { companyId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const typeCounts = await PreQualificationAudit.aggregate([
      { $match: { companyId } },
      { $group: { _id: '$auditType', count: { $sum: 1 } } },
    ]);

    // Calculate average scores
    const avgScores = await PreQualificationAudit.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: null,
          avgOverall: { $avg: '$score.overall' },
          avgCompliance: { $avg: '$score.compliance' },
          avgQuality: { $avg: '$score.quality' },
          avgSafety: { $avg: '$score.safety' },
          avgFinancial: { $avg: '$score.financial' },
          avgTechnical: { $avg: '$score.technical' },
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalAudits,
        statusCounts,
        typeCounts,
        avgScores: avgScores[0] || {},
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Dashboard and Analytics ---

exports.getDashboardStats = async (req, res) => {
  try {
    const { companyId } = req.user;
    
    // Vendor statistics
    const vendorStats = await PreQualificationVendor.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: null,
          totalVendors: { $sum: 1 },
          approvedVendors: {
            $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] }
          },
          pendingVendors: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          underReviewVendors: {
            $sum: { $cond: [{ $eq: ['$status', 'Under Review'] }, 1, 0] }
          },
        }
      }
    ]);

    // Expiring certifications
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    
    const expiringCertifications = await PreQualificationVendor.aggregate([
      { $match: { companyId } },
      { $unwind: '$certifications' },
      {
        $match: {
          'certifications.expiryDate': { $lte: threeMonthsFromNow },
          'certifications.status': 'VALID'
        }
      },
      { $count: 'count' }
    ]);

    // Upcoming audits
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    
    const upcomingAudits = await PreQualificationAudit.countDocuments({
      companyId,
      scheduledDate: { $lte: oneMonthFromNow },
      status: { $in: ['Scheduled', 'In Progress'] }
    });

    // Recent activities
    const recentVendors = await PreQualificationVendor.find({ companyId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('companyName status updatedAt');

    const recentAudits = await PreQualificationAudit.find({ companyId })
      .populate('vendorId', 'companyName')
      .sort({ auditDate: -1 })
      .limit(5)
      .select('auditType auditDate status vendorId');

    res.status(200).json({
      success: true,
      data: {
        overview: vendorStats[0] || {
          totalVendors: 0,
          approvedVendors: 0,
          pendingVendors: 0,
          underReviewVendors: 0,
        },
        expiringCertifications: expiringCertifications[0]?.count || 0,
        upcomingAudits,
        recentVendors,
        recentAudits,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
