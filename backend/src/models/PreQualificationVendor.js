const mongoose = require('mongoose');
const { Schema } = mongoose;

const PreQualificationVendorSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  },
  vendorId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  legalName: {
    type: String,
    trim: true,
  },
  businessType: {
    type: String,
    enum: ['Corporation', 'Partnership', 'Sole Proprietorship', 'LLC', 'Non-Profit', 'Government Entity', 'Other'],
    required: true,
  },
  industry: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Goods Supplier', 'Service Provider', 'Consultant', 'Contractor', 'Technology Provider', 'Professional Services', 'Manufacturing', 'Distribution', 'Other'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Suspended', 'Blacklisted'],
    default: 'Pending',
  },
  qualificationLevel: {
    type: String,
    enum: ['TIER_1', 'TIER_2', 'TIER_3', 'TIER_4'],
    default: 'TIER_3',
  },
  preQualificationStatus: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Expired', 'Under Review'],
    default: 'Not Started',
  },
  preQualificationDate: {
    type: Date,
  },
  preQualificationExpiry: {
    type: Date,
  },
  contactInformation: {
    primaryContact: {
      name: { type: String, required: true },
      title: String,
      email: { type: String, required: true },
      phone: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    website: String,
  },
  businessInformation: {
    registrationNumber: String,
    taxId: String,
    establishedYear: Number,
    numberOfEmployees: {
      min: Number,
      max: Number,
    },
    annualRevenue: Number,
    businessDescription: String,
  },
  certifications: [{
    type: {
      type: String,
      enum: ['ISO_9001', 'ISO_14001', 'ISO_45001', 'ISO_27001', 'CE_MARKING', 'UL_LISTING', 'FDA_510K', 'FDA_APPROVAL', 'SOC_2', 'Other'],
      required: true,
    },
    name: { type: String, required: true },
    issuedBy: { type: String, required: true },
    issuedDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['VALID', 'EXPIRED', 'EXPIRING_SOON', 'SUSPENDED'],
      default: 'VALID',
    },
    certificateNumber: { type: String, required: true },
    documentPath: String,
    scope: String,
  }],
  complianceRequirements: [{
    requirement: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Non-compliant'],
      default: 'Not Started',
    },
    dueDate: Date,
    completedDate: Date,
    evidence: [{
      name: String,
      url: String,
      uploadedAt: { type: Date, default: Date.now },
    }],
    isRequired: { type: Boolean, default: true },
  }],
  performanceMetrics: {
    onTimeDelivery: { type: Number, min: 0, max: 100 },
    qualityRating: { type: Number, min: 0, max: 5 },
    costCompetitiveness: { type: Number, min: 0, max: 5 },
    communicationRating: { type: Number, min: 0, max: 5 },
    overallRating: { type: Number, min: 0, max: 5 },
    lastUpdated: { type: Date, default: Date.now },
  },
  auditHistory: [{
    auditDate: { type: Date, required: true },
    auditType: {
      type: String,
      enum: ['Initial', 'Annual', 'Surprise', 'Compliance', 'Performance'],
      required: true,
    },
    auditor: { type: String, required: true },
    score: { type: Number, min: 0, max: 100 },
    findings: [String],
    recommendations: [String],
    status: {
      type: String,
      enum: ['Passed', 'Failed', 'Conditional', 'Pending'],
      required: true,
    },
    nextAuditDate: Date,
    documents: [{
      name: String,
      url: String,
      uploadedAt: { type: Date, default: Date.now },
    }],
  }],
  riskAssessment: {
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    riskFactors: [{
      factor: String,
      impact: String,
      probability: String,
      mitigation: String,
    }],
    lastAssessed: { type: Date, default: Date.now },
    assessedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  financialInformation: {
    creditRating: String,
    financialStability: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    },
    paymentTerms: String,
    insuranceCoverage: {
      generalLiability: Number,
      professionalLiability: Number,
      workersCompensation: Number,
    },
  },
  capabilities: [{
    category: { type: String, required: true },
    description: String,
    experience: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    },
    yearsOfExperience: Number,
    references: [{
      company: String,
      contact: String,
      project: String,
      rating: Number,
    }],
  }],
  documents: [{
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['Certificate', 'Insurance', 'Financial', 'Legal', 'Technical', 'Other'],
    },
    url: String,
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    expiryDate: Date,
  }],
  notes: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    note: String,
    createdAt: { type: Date, default: Date.now },
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: Date,
  lastReviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  lastReviewedAt: Date,
  tags: [{ type: String, trim: true }],
}, {
  timestamps: true,
});

// Indexes for better performance
PreQualificationVendorSchema.index({ companyId: 1, status: 1 });
PreQualificationVendorSchema.index({ companyId: 1, qualificationLevel: 1 });
PreQualificationVendorSchema.index({ companyId: 1, industry: 1 });
PreQualificationVendorSchema.index({ 'certifications.expiryDate': 1 });
PreQualificationVendorSchema.index({ preQualificationExpiry: 1 });

// Virtual for expiring certifications
PreQualificationVendorSchema.virtual('expiringCertifications').get(function() {
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  
  return this.certifications.filter(cert => {
    return cert.expiryDate <= threeMonthsFromNow && cert.status === 'VALID';
  });
});

// Method to update certification statuses
PreQualificationVendorSchema.methods.updateCertificationStatuses = function() {
  const now = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  
  this.certifications.forEach(cert => {
    if (cert.expiryDate < now) {
      cert.status = 'EXPIRED';
    } else if (cert.expiryDate <= threeMonthsFromNow) {
      cert.status = 'EXPIRING_SOON';
    } else {
      cert.status = 'VALID';
    }
  });
  
  return this.save();
};

// Pre-save middleware to update certification statuses
PreQualificationVendorSchema.pre('save', function(next) {
  if (this.isModified('certifications')) {
    this.updateCertificationStatuses();
  }
  next();
});

const PreQualificationVendor = mongoose.model('PreQualificationVendor', PreQualificationVendorSchema);
module.exports = PreQualificationVendor;
