const mongoose = require('mongoose');

const extractedRequirementSchema = new mongoose.Schema({
  requirement: { type: String, required: true },
  category: {
    type: String,
    enum: ['TECHNICAL', 'COMMERCIAL', 'COMPLIANCE', 'TIMELINE', 'GENERAL'],
    default: 'GENERAL'
  },
  mandatory: { type: Boolean, default: false },
  addressed: { type: Boolean, default: false },
  addressedBySectionId: { type: String, default: null }
}, { _id: true });

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'EXECUTIVE_SUMMARY', 'TECHNICAL_APPROACH', 'METHODOLOGY',
      'TEAM_QUALIFICATIONS', 'PAST_PERFORMANCE', 'COMPLIANCE_MATRIX',
      'PRICING_SUMMARY', 'RISK_MITIGATION', 'CUSTOM'
    ],
    default: 'CUSTOM'
  },
  content: { type: String, default: '' },
  status: {
    type: String,
    enum: ['PENDING', 'GENERATING', 'DRAFT', 'NEEDS_REVIEW', 'APPROVED', 'MANUALLY_WRITTEN'],
    default: 'PENDING'
  },
  aiMetadata: {
    model: { type: String, default: '' },
    promptVersion: { type: String, default: '1.0' },
    groundingSources: [{ type: String }],
    schemaValid: { type: Boolean, default: false },
    factCheckScore: { type: Number, min: 0, max: 100, default: 0 },
    confidenceScore: { type: Number, min: 0, max: 100, default: 0 },
    generatedAt: { type: Date },
    retryCount: { type: Number, default: 0 },
    rawTokensUsed: { type: Number, default: 0 }
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  reviewComments: { type: String, default: '' },
  wordCount: { type: Number, default: 0 },
  order: { type: Number, default: 0 }
}, { _id: true });

const rfpResponseSchema = new mongoose.Schema({
  tenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender',
    required: true,
    index: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  evaluationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evaluation'
  },
  pricingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pricing'
  },

  metadata: {
    projectName: { type: String, required: true, trim: true },
    rfpNumber: { type: String, trim: true, default: '' },
    submissionDeadline: { type: Date },
    status: {
      type: String,
      enum: ['DRAFT', 'IN_PROGRESS', 'REVIEW', 'APPROVED', 'SUBMITTED'],
      default: 'DRAFT'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date }
  },

  extractedRequirements: [extractedRequirementSchema],

  sections: [sectionSchema],

  complianceAudit: {
    totalRequirements: { type: Number, default: 0 },
    addressedCount: { type: Number, default: 0 },
    coveragePercentage: { type: Number, default: 0 },
    unaddressedRequirements: [{ type: String }],
    auditedAt: { type: Date }
  },

  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: 'RfpResponse'
});

// Indexes
rfpResponseSchema.index({ companyId: 1, 'metadata.status': 1 });
rfpResponseSchema.index({ tenderId: 1, companyId: 1 });

// Filter out deleted by default
rfpResponseSchema.pre(/^find/, function(next) {
  if (this.getQuery().isDeleted !== true) {
    this.where({ isDeleted: false });
  }
  next();
});

// Virtual for overall readiness
rfpResponseSchema.virtual('readiness').get(function() {
  if (!this.sections || this.sections.length === 0) return 0;
  const approved = this.sections.filter(s =>
    s.status === 'APPROVED' || s.status === 'MANUALLY_WRITTEN'
  ).length;
  return Math.round((approved / this.sections.length) * 100);
});

rfpResponseSchema.set('toJSON', { virtuals: true });
rfpResponseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('RfpResponse', rfpResponseSchema);
