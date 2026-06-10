const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['PERFORMANCE', 'ANALYTICS', 'FINANCIAL', 'OPERATIONAL', 'COMPLIANCE', 'CUSTOM'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  parameters: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'],
    default: 'DRAFT'
  },
  schedule: {
    type: String,
    enum: ['MANUAL', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'],
    default: 'MANUAL'
  },
  lastGenerated: {
    type: Date
  },
  nextGeneration: {
    type: Date
  },
  recipients: [{
    email: String,
    name: String,
    role: String
  }],
  format: {
    type: String,
    enum: ['PDF', 'EXCEL', 'CSV', 'HTML'],
    default: 'PDF'
  },
  filters: {
    dateRange: {
      start: Date,
      end: Date
    },
    sectors: [String],
    regions: [String],
    statuses: [String],
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  charts: [{
    type: {
      type: String,
      enum: ['BAR', 'LINE', 'PIE', 'DONUT', 'TABLE', 'METRIC']
    },
    title: String,
    dataSource: String,
    config: mongoose.Schema.Types.Mixed
  }],
  metrics: [{
    name: String,
    value: mongoose.Schema.Types.Mixed,
    unit: String,
    trend: {
      type: String,
      enum: ['UP', 'DOWN', 'STABLE']
    },
    change: Number
  }],
  generatedFiles: [{
    fileName: String,
    filePath: String,
    fileSize: Number,
    generatedAt: {
      type: Date,
      default: Date.now
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'Report'
});

// Indexes
reportSchema.index({ title: 1 });
reportSchema.index({ type: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ schedule: 1 });
reportSchema.index({ lastGenerated: 1 });

// Virtual for report age
reportSchema.virtual('age').get(function() {
  if (this.lastGenerated) {
    const diffTime = Math.abs(Date.now() - this.lastGenerated);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Virtual for next generation countdown
reportSchema.virtual('nextGenerationCountdown').get(function() {
  if (this.nextGeneration) {
    const diffTime = this.nextGeneration - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Ensure virtual fields are serialized
reportSchema.set('toJSON', { virtuals: true });
reportSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Report', reportSchema);
