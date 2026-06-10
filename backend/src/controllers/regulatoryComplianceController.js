const RegulatoryDeclaration = require('../models/RegulatoryDeclaration');
const Certificate = require('../models/Certificate');
const Vendor = require('../models/Vendor');
const mongoose = require('mongoose');

// @desc    Get all regulatory declarations
// @route   GET /api/regulatory-compliance/declarations
// @access  Private
exports.getRegulatoryDeclarations = async (req, res) => {
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
        { jurisdiction: { $regex: search, $options: 'i' } },
        { regulatoryBody: { $regex: search, $options: 'i' } },
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
        { path: 'updatedBy', select: 'name email' },
        { path: 'approvedBy', select: 'name email' }
      ],
      lean: true
    };

    const result = await RegulatoryDeclaration.paginate(query, options);

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
      message: 'Regulatory declarations retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting regulatory declarations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve regulatory declarations', 
      error: error.message 
    });
  }
};

// @desc    Get all certificates
// @route   GET /api/regulatory-compliance/certificates
// @access  Private
exports.getCertificates = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { 
      page = 1, 
      limit = 20, 
      search, 
      type, 
      category, 
      status,
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
        { name: { $regex: search, $options: 'i' } },
        { certificateNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { issuingBody: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter functionality
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;

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

    const result = await Certificate.paginate(query, options);

    res.status(200).json({
      success: true,
      data: {
        certificates: result.docs,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalItems: result.totalDocs,
          itemsPerPage: result.limit
        }
      },
      message: 'Certificates retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting certificates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve certificates', 
      error: error.message 
    });
  }
};

// @desc    Get all vendors
// @route   GET /api/regulatory-compliance/vendors
// @access  Private
exports.getVendors = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { 
      page = 1, 
      limit = 20, 
      search, 
      category, 
      status,
      preQualificationStatus,
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
        { companyName: { $regex: search, $options: 'i' } },
        { legalName: { $regex: search, $options: 'i' } },
        { vendorId: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter functionality
    if (category) query.category = category;
    if (status) query.status = status;
    if (preQualificationStatus) query.preQualificationStatus = preQualificationStatus;

    const sort = {};
    sort[sortBy] = parseInt(sortOrder);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: [
        { path: 'createdBy', select: 'name email' },
        { path: 'updatedBy', select: 'name email' },
        { path: 'approvedBy', select: 'name email' }
      ],
      lean: true
    };

    const result = await Vendor.paginate(query, options);

    res.status(200).json({
      success: true,
      data: {
        vendors: result.docs,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalItems: result.totalDocs,
          itemsPerPage: result.limit
        }
      },
      message: 'Vendors retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting vendors:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve vendors', 
      error: error.message 
    });
  }
};

// @desc    Get regulatory compliance statistics
// @route   GET /api/regulatory-compliance/stats/overview
// @access  Private
exports.getRegulatoryComplianceStats = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    // Get declarations stats
    const declarationsStats = await RegulatoryDeclaration.aggregate([
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
          approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } },
          underReview: { $sum: { $cond: [{ $eq: ['$status', 'Under Review'] }, 1, 0] } },
          expired: { $sum: { $cond: [{ $eq: ['$status', 'Expired'] }, 1, 0] } },
          expiringSoon: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$expiryDate', new Date()] },
                    { $lte: ['$expiryDate', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Get certificates stats
    const certificatesStats = await Certificate.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          totalCertificates: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] } },
          expired: { $sum: { $cond: [{ $eq: ['$status', 'Expired'] }, 1, 0] } },
          expiringSoon: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$expiryDate', new Date()] },
                    { $lte: ['$expiryDate', new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Get vendors stats
    const vendorsStats = await Vendor.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          totalVendors: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          preQualExpiringSoon: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$preQualificationExpiry', new Date()] },
                    { $lte: ['$preQualificationExpiry', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const declarations = declarationsStats[0] || {
      totalDeclarations: 0,
      approved: 0,
      underReview: 0,
      expired: 0,
      expiringSoon: 0
    };

    const certificates = certificatesStats[0] || {
      totalCertificates: 0,
      active: 0,
      expired: 0,
      expiringSoon: 0
    };

    const vendors = vendorsStats[0] || {
      totalVendors: 0,
      approved: 0,
      pending: 0,
      preQualExpiringSoon: 0
    };

    res.status(200).json({
      success: true,
      data: {
        overview: {
          declarations,
          certificates,
          vendors,
          totalItems: declarations.totalDeclarations + certificates.totalCertificates + vendors.totalVendors,
          totalExpiringSoon: declarations.expiringSoon + certificates.expiringSoon + vendors.preQualExpiringSoon
        }
      },
      message: 'Regulatory compliance statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting regulatory compliance stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve regulatory compliance statistics', 
      error: error.message 
    });
  }
};

// @desc    Create new regulatory declaration
// @route   POST /api/regulatory-compliance/declarations
// @access  Private
exports.createRegulatoryDeclaration = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user._id;

    const declarationData = {
      ...req.body,
      companyId: new mongoose.Types.ObjectId(companyId),
      createdBy: userId,
      updatedBy: userId
    };

    const declaration = await RegulatoryDeclaration.create(declarationData);

    const populatedDeclaration = await RegulatoryDeclaration.findById(declaration._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.status(201).json({
      success: true,
      data: { declaration: populatedDeclaration },
      message: 'Regulatory declaration created successfully'
    });
  } catch (error) {
    console.error('Error creating regulatory declaration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create regulatory declaration', 
      error: error.message 
    });
  }
};

// @desc    Create new certificate
// @route   POST /api/regulatory-compliance/certificates
// @access  Private
exports.createCertificate = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user._id;

    const certificateData = {
      ...req.body,
      companyId: new mongoose.Types.ObjectId(companyId),
      createdBy: userId,
      updatedBy: userId
    };

    const certificate = await Certificate.create(certificateData);

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.status(201).json({
      success: true,
      data: { certificate: populatedCertificate },
      message: 'Certificate created successfully'
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create certificate', 
      error: error.message 
    });
  }
};

// @desc    Create new vendor
// @route   POST /api/regulatory-compliance/vendors
// @access  Private
exports.createVendor = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user._id;

    const vendorData = {
      ...req.body,
      companyId: new mongoose.Types.ObjectId(companyId),
      createdBy: userId,
      updatedBy: userId
    };

    const vendor = await Vendor.create(vendorData);

    const populatedVendor = await Vendor.findById(vendor._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.status(201).json({
      success: true,
      data: { vendor: populatedVendor },
      message: 'Vendor created successfully'
    });
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create vendor', 
      error: error.message 
    });
  }
};

// @desc    Update regulatory declaration
// @route   PUT /api/regulatory-compliance/declarations/:id
// @access  Private
exports.updateRegulatoryDeclaration = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user._id;
    const { id } = req.params;

    const existingDeclaration = await RegulatoryDeclaration.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!existingDeclaration) {
      return res.status(404).json({
        success: false,
        message: 'Regulatory declaration not found'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: userId
    };

    const declaration = await RegulatoryDeclaration.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .populate('approvedBy', 'name email');

    res.status(200).json({
      success: true,
      data: { declaration },
      message: 'Regulatory declaration updated successfully'
    });
  } catch (error) {
    console.error('Error updating regulatory declaration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update regulatory declaration', 
      error: error.message 
    });
  }
};

// @desc    Update certificate
// @route   PUT /api/regulatory-compliance/certificates/:id
// @access  Private
exports.updateCertificate = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user._id;
    const { id } = req.params;

    const existingCertificate = await Certificate.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!existingCertificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: userId
    };

    const certificate = await Certificate.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      data: { certificate },
      message: 'Certificate updated successfully'
    });
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update certificate', 
      error: error.message 
    });
  }
};

// @desc    Update vendor
// @route   PUT /api/regulatory-compliance/vendors/:id
// @access  Private
exports.updateVendor = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user._id;
    const { id } = req.params;

    const existingVendor = await Vendor.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!existingVendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: userId
    };

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .populate('approvedBy', 'name email');

    res.status(200).json({
      success: true,
      data: { vendor },
      message: 'Vendor updated successfully'
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update vendor', 
      error: error.message 
    });
  }
};

// @desc    Delete regulatory declaration (soft delete)
// @route   DELETE /api/regulatory-compliance/declarations/:id
// @access  Private
exports.deleteRegulatoryDeclaration = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const declaration = await RegulatoryDeclaration.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!declaration) {
      return res.status(404).json({
        success: false,
        message: 'Regulatory declaration not found'
      });
    }

    await RegulatoryDeclaration.findByIdAndUpdate(id, {
      isDeleted: true,
      updatedBy: req.user._id
    });

    res.status(200).json({
      success: true,
      message: 'Regulatory declaration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting regulatory declaration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete regulatory declaration', 
      error: error.message 
    });
  }
};

// @desc    Delete certificate (soft delete)
// @route   DELETE /api/regulatory-compliance/certificates/:id
// @access  Private
exports.deleteCertificate = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const certificate = await Certificate.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    await Certificate.findByIdAndUpdate(id, {
      isDeleted: true,
      updatedBy: req.user._id
    });

    res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete certificate', 
      error: error.message 
    });
  }
};

// @desc    Delete vendor (soft delete)
// @route   DELETE /api/regulatory-compliance/vendors/:id
// @access  Private
exports.deleteVendor = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const vendor = await Vendor.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    await Vendor.findByIdAndUpdate(id, {
      isDeleted: true,
      updatedBy: req.user._id
    });

    res.status(200).json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete vendor', 
      error: error.message 
    });
  }
};
