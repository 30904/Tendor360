const mongoose = require('mongoose');

const evaluationTemplateSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  category: {
    type: String,
    enum: ['GENERAL', 'HEALTHCARE', 'IT', 'CONSTRUCTION', 'FINANCIAL', 'EDUCATION'],
    default: 'GENERAL'
  },
  evaluationType: {
    type: String,
    enum: ['PRELIMINARY', 'TECHNICAL', 'FINANCIAL', 'COMPREHENSIVE'],
    default: 'COMPREHENSIVE'
  },
  criteria: [{
    category: {
      type: String,
      enum: ['TECHNICAL', 'FINANCIAL', 'EXPERIENCE', 'CAPACITY', 'COMPLIANCE', 'RISK'],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    weight: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    maxScore: {
      type: Number,
      min: 1,
      max: 10,
      default: 10
    },
    scoringMethod: {
      type: String,
      enum: ['NUMERIC', 'PERCENTAGE', 'BOOLEAN', 'RATING'],
      default: 'NUMERIC'
    },
    scoringGuide: {
      type: Map,
      of: String,
      default: new Map([
        ['10', 'Excellent - Exceeds all requirements'],
        ['9', 'Very Good - Meets all requirements with minor enhancements'],
        ['8', 'Good - Meets all requirements'],
        ['7', 'Satisfactory - Meets most requirements'],
        ['6', 'Adequate - Meets basic requirements'],
        ['5', 'Marginal - Barely meets requirements'],
        ['4', 'Below Average - Partially meets requirements'],
        ['3', 'Poor - Significantly below requirements'],
        ['2', 'Very Poor - Major deficiencies'],
        ['1', 'Unacceptable - Does not meet requirements'],
        ['0', 'Not Applicable - Cannot be evaluated']
      ])
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  thresholds: {
    bidThreshold: {
      type: Number,
      min: 0,
      max: 100,
      default: 70
    },
    noBidThreshold: {
      type: Number,
      min: 0,
      max: 100,
      default: 40
    },
    riskThreshold: {
      type: Number,
      min: 0,
      max: 100,
      default: 60
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  tags: [String],
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: Date,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'EvaluationTemplate'
});

// Indexes
evaluationTemplateSchema.index({ category: 1, evaluationType: 1 });
evaluationTemplateSchema.index({ isActive: 1, isDefault: 1 });
evaluationTemplateSchema.index({ createdBy: 1 });
evaluationTemplateSchema.index({ isDeleted: 1 });

// Filter out deleted templates by default
evaluationTemplateSchema.pre(/^find/, function(next) {
  if (this.getQuery().isDeleted !== true) {
    this.where({ isDeleted: false });
  }
  next();
});

// Instance method to clone template
evaluationTemplateSchema.methods.clone = function(newName, newCreatedBy) {
  const cloned = new this.constructor({
    ...this.toObject(),
    _id: undefined,
    name: newName,
    createdBy: newCreatedBy,
    isDefault: false,
    version: 1,
    usageCount: 0,
    lastUsed: undefined,
    createdAt: undefined,
    updatedAt: undefined
  });
  return cloned;
};

// Static method to get default templates
evaluationTemplateSchema.statics.getDefaultTemplates = function() {
  return this.find({ isDefault: true, isActive: true });
};

module.exports = mongoose.model('EvaluationTemplate', evaluationTemplateSchema);
