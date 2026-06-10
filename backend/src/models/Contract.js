const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  tender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender',
    required: true
  },
  contractNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  vendor: {
    type: String,
    required: true,
    trim: true
  },
  contractValue: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'COMPLETED', 'TERMINATED', 'SUSPENDED'],
    default: 'DRAFT'
  },
  milestones: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'],
      default: 'PENDING'
    },
    completionDate: Date,
    notes: String
  }],
  deliverables: [{
    title: String,
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'],
      default: 'PENDING'
    },
    notes: String
  }],
  paymentTerms: {
    advance: {
      type: Number,
      min: 0,
      max: 100
    },
    milestones: [{
      milestone: String,
      percentage: {
        type: Number,
        min: 0,
        max: 100
      },
      trigger: String
    }],
    retention: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  performanceMetrics: [{
    metric: String,
    target: String,
    actual: String,
    status: {
      type: String,
      enum: ['ON_TRACK', 'AT_RISK', 'BEHIND'],
      default: 'ON_TRACK'
    }
  }],
  risks: [{
    description: String,
    impact: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    },
    probability: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH']
    },
    mitigation: String,
    status: {
      type: String,
      enum: ['OPEN', 'MITIGATED', 'CLOSED']
    }
  }],
  attachments: [{
    fileName: String,
    fileType: String,
    fileSize: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'Contract'
});

// Indexes
contractSchema.index({ tender: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ vendor: 1 });
contractSchema.index({ startDate: 1, endDate: 1 });

// Virtual for contract duration
contractSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Virtual for progress percentage
contractSchema.virtual('progressPercentage').get(function() {
  if (this.milestones && this.milestones.length > 0) {
    const completed = this.milestones.filter(m => m.status === 'COMPLETED').length;
    return Math.round((completed / this.milestones.length) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
contractSchema.set('toJSON', { virtuals: true });
contractSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Contract', contractSchema);
