const mongoose = require('mongoose');
const { Schema } = mongoose;

const PreQualificationAuditSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'PreQualificationVendor',
    required: true,
    index: true,
  },
  auditNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  auditType: {
    type: String,
    enum: ['Initial', 'Annual', 'Surprise', 'Compliance', 'Performance', 'Follow-up'],
    required: true,
  },
  auditDate: {
    type: Date,
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled',
  },
  auditor: {
    name: { type: String, required: true },
    email: String,
    phone: String,
    company: String,
    certification: String,
  },
  auditScope: {
    areas: [{ type: String }],
    objectives: [String],
    methodology: String,
    duration: Number, // in hours
  },
  findings: [{
    category: {
      type: String,
      enum: ['Compliance', 'Quality', 'Safety', 'Financial', 'Technical', 'Environmental', 'Other'],
    },
    severity: {
      type: String,
      enum: ['Critical', 'Major', 'Minor', 'Observation'],
    },
    description: { type: String, required: true },
    evidence: [String],
    rootCause: String,
    impact: String,
    recommendation: String,
    correctiveAction: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed', 'Overdue'],
      default: 'Open',
    },
    assignedTo: String,
    closedDate: Date,
  }],
  score: {
    overall: { type: Number, min: 0, max: 100 },
    compliance: { type: Number, min: 0, max: 100 },
    quality: { type: Number, min: 0, max: 100 },
    safety: { type: Number, min: 0, max: 100 },
    financial: { type: Number, min: 0, max: 100 },
    technical: { type: Number, min: 0, max: 100 },
  },
  recommendations: [{
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
    },
    description: { type: String, required: true },
    dueDate: Date,
    assignedTo: String,
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Overdue'],
      default: 'Pending',
    },
  }],
  documents: [{
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['Report', 'Evidence', 'Certificate', 'Photo', 'Other'],
    },
    url: String,
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  }],
  nextAuditDate: {
    type: Date,
  },
  followUpRequired: {
    type: Boolean,
    default: false,
  },
  followUpDate: {
    type: Date,
  },
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
  tags: [{ type: String, trim: true }],
}, {
  timestamps: true,
});

// Indexes
PreQualificationAuditSchema.index({ companyId: 1, auditDate: -1 });
PreQualificationAuditSchema.index({ vendorId: 1, auditDate: -1 });
PreQualificationAuditSchema.index({ status: 1 });
PreQualificationAuditSchema.index({ auditType: 1 });

// Virtual for audit result
PreQualificationAuditSchema.virtual('auditResult').get(function() {
  if (this.score.overall >= 90) return 'Excellent';
  if (this.score.overall >= 80) return 'Good';
  if (this.score.overall >= 70) return 'Satisfactory';
  if (this.score.overall >= 60) return 'Needs Improvement';
  return 'Poor';
});

// Method to calculate overall score
PreQualificationAuditSchema.methods.calculateOverallScore = function() {
  const scores = [
    this.score.compliance,
    this.score.quality,
    this.score.safety,
    this.score.financial,
    this.score.technical
  ].filter(score => score !== undefined && score !== null);
  
  if (scores.length === 0) return 0;
  
  this.score.overall = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  return this.score.overall;
};

// Pre-save middleware to calculate overall score
PreQualificationAuditSchema.pre('save', function(next) {
  this.calculateOverallScore();
  next();
});

const PreQualificationAudit = mongoose.model('PreQualificationAudit', PreQualificationAuditSchema);
module.exports = PreQualificationAudit;
