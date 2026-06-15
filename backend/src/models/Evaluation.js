const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { EVALUATION_DECISION } = require('../config/constants');

const evaluationSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  tenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender',
    required: true
  },
  evaluationName: {
    type: String,
    required: true,
    trim: true
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
    score: {
      type: Number,
      min: 0,
      max: 10,
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
    notes: String,
    evidence: String,
    evaluator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    evaluatedAt: Date
  }],
  scoringMatrix: {
    technicalScore: { type: Number, min: 0, max: 100, default: 0 },
    financialScore: { type: Number, min: 0, max: 100, default: 0 },
    experienceScore: { type: Number, min: 0, max: 100, default: 0 },
    capacityScore: { type: Number, min: 0, max: 100, default: 0 },
    complianceScore: { type: Number, min: 0, max: 100, default: 0 },
    riskScore: { type: Number, min: 0, max: 100, default: 0 }
  },
  totalScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  weightedScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  decision: {
    type: String,
    enum: Object.values(EVALUATION_DECISION),
    default: EVALUATION_DECISION.PENDING
  },
  decisionReason: String,
  confidenceLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['DRAFT', 'IN_PROGRESS', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
    default: 'DRAFT'
  },
  notes: {
    type: String,
    trim: true
  },
  recommendations: [String],
  attachments: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    reviewedAt: Date,
    comments: String
  }],
  approver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'Evaluation'
});

// Indexes
evaluationSchema.index({ tenderId: 1 });
evaluationSchema.index({ evaluator: 1 });
evaluationSchema.index({ decision: 1 });
evaluationSchema.index({ status: 1 });
evaluationSchema.index({ evaluationType: 1 });
evaluationSchema.index({ isDeleted: 1 });
evaluationSchema.index({ createdAt: -1 });

// Calculate scores before saving
evaluationSchema.pre('save', function(next) {
  if (this.criteria && this.criteria.length > 0) {
    // Calculate category scores
    const categoryScores = {};
    this.criteria.forEach(criterion => {
      if (!categoryScores[criterion.category]) {
        categoryScores[criterion.category] = { total: 0, weight: 0 };
      }
      categoryScores[criterion.category].total += criterion.score;
      categoryScores[criterion.category].weight += criterion.weight;
    });

    // Update scoring matrix
    Object.keys(categoryScores).forEach(category => {
      const score = categoryScores[category].total;
      const weight = categoryScores[category].weight;
      const categoryKey = category.toLowerCase() + 'Score';
      if (this.schema.paths[categoryKey]) {
        this.scoringMatrix[categoryKey] = weight > 0 ? (score / weight) * 100 : 0;
      }
    });

    // Calculate total score
    this.totalScore = this.criteria.reduce((total, criterion) => {
      return total + criterion.score;
    }, 0);

    // Calculate weighted score
    this.weightedScore = this.criteria.reduce((total, criterion) => {
      return total + (criterion.score * criterion.weight / 100);
    }, 0);
  }
  next();
});

// Filter out deleted evaluations by default
evaluationSchema.pre(/^find/, function(next) {
  if (this.getQuery().isDeleted !== true) {
    this.where({ isDeleted: false });
  }
  next();
});

// Virtual for decision summary
evaluationSchema.virtual('decisionSummary').get(function() {
  if (this.decision === EVALUATION_DECISION.BID) {
    return `BID - Score: ${this.weightedScore.toFixed(1)}%`;
  } else if (this.decision === EVALUATION_DECISION.NO_BID) {
    return `NO BID - Score: ${this.weightedScore.toFixed(1)}%`;
  }
  return `PENDING - Score: ${this.weightedScore.toFixed(1)}%`;
});

// Instance method to get evaluation insights
evaluationSchema.methods.getInsights = function() {
  const insights = {
    strengths: [],
    weaknesses: [],
    recommendations: []
  };

  this.criteria.forEach(criterion => {
    if (criterion.score >= 8) {
      insights.strengths.push(criterion.name);
    } else if (criterion.score <= 4) {
      insights.weaknesses.push(criterion.name);
      insights.recommendations.push(`Improve ${criterion.name} to increase score`);
    }
  });

  return insights;
};

// Add pagination plugin
evaluationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Evaluation', evaluationSchema);
