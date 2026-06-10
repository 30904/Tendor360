const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const winLossAnalysisSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  competitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competitor',
    required: true,
    index: true
  },
  tenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender',
    required: true,
    index: true
  },
  outcome: {
    type: String,
    enum: ['Won', 'Lost', 'Withdrawn', 'Pending'],
    required: true
  },
  bidValue: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']
  },
  winValue: {
    type: Number,
    min: 0
  },
  competitorBidValue: {
    type: Number,
    min: 0
  },
  competitorWinValue: {
    type: Number,
    min: 0
  },
  bidDifference: {
    type: Number,
    default: 0
  },
  percentageDifference: {
    type: Number,
    default: 0
  },
  analysisFactors: {
    pricing: {
      score: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
      },
      notes: {
        type: String,
        trim: true
      }
    },
    technical: {
      score: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
      },
      notes: {
        type: String,
        trim: true
      }
    },
    commercial: {
      score: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
      },
      notes: {
        type: String,
        trim: true
      }
    },
    relationship: {
      score: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
      },
      notes: {
        type: String,
        trim: true
      }
    },
    timing: {
      score: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
      },
      notes: {
        type: String,
        trim: true
      }
    }
  },
  overallScore: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  keyFactors: [{
    factor: {
      type: String,
      required: true,
      trim: true
    },
    impact: {
      type: String,
      enum: ['Positive', 'Negative', 'Neutral'],
      required: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  lessonsLearned: [{
    type: String,
    trim: true
  }],
  recommendations: [{
    type: String,
    trim: true
  }],
  competitorInsights: {
    strengths: [{
      type: String,
      trim: true
    }],
    weaknesses: [{
      type: String,
      trim: true
    }],
    strategies: [{
      type: String,
      trim: true
    }]
  },
  marketInsights: {
    trends: [{
      type: String,
      trim: true
    }],
    opportunities: [{
      type: String,
      trim: true
    }],
    threats: [{
      type: String,
      trim: true
    }]
  },
  tenderDetails: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    organization: {
      type: String,
      required: true,
      trim: true
    },
    tenderType: {
      type: String,
      trim: true
    },
    estimatedValue: {
      type: Number,
      min: 0
    },
    deadline: {
      type: Date
    },
    location: {
      type: String,
      trim: true
    }
  },
  analysisDate: {
    type: Date,
    default: Date.now
  },
  analyzedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'WinLossAnalysis'
});

// Indexes for better search performance
winLossAnalysisSchema.index({ companyId: 1, competitorId: 1 });
winLossAnalysisSchema.index({ companyId: 1, tenderId: 1 }, { unique: true });
winLossAnalysisSchema.index({ companyId: 1, outcome: 1 });
winLossAnalysisSchema.index({ companyId: 1, analysisDate: -1 });
winLossAnalysisSchema.index({ companyId: 1, overallScore: -1 });
winLossAnalysisSchema.index({ companyId: 1, isActive: 1 });

// Add pagination plugin
winLossAnalysisSchema.plugin(mongoosePaginate);

// Virtual for competitive advantage
winLossAnalysisSchema.virtual('competitiveAdvantage').get(function() {
  if (this.outcome === 'Won') {
    return this.bidDifference < 0 ? 'Price Advantage' : 'Value Advantage';
  } else if (this.outcome === 'Lost') {
    return this.bidDifference > 0 ? 'Price Disadvantage' : 'Value Disadvantage';
  }
  return 'Neutral';
});

// Virtual for analysis quality
winLossAnalysisSchema.virtual('analysisQuality').get(function() {
  const factors = this.analysisFactors;
  const scores = [
    factors.pricing.score,
    factors.technical.score,
    factors.commercial.score,
    factors.relationship.score,
    factors.timing.score
  ];
  
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  if (avgScore >= 8) return 'Excellent';
  if (avgScore >= 6) return 'Good';
  if (avgScore >= 4) return 'Fair';
  return 'Poor';
});

// Ensure virtuals are included in JSON output
winLossAnalysisSchema.set('toJSON', { virtuals: true });
winLossAnalysisSchema.set('toObject', { virtuals: true });

// Pre-save middleware to calculate derived fields
winLossAnalysisSchema.pre('save', function(next) {
  // Calculate bid difference
  if (this.competitorBidValue && this.bidValue) {
    this.bidDifference = this.bidValue - this.competitorBidValue;
    this.percentageDifference = Math.round((this.bidDifference / this.competitorBidValue) * 100);
  }
  
  // Calculate overall score
  const factors = this.analysisFactors;
  const scores = [
    factors.pricing.score,
    factors.technical.score,
    factors.commercial.score,
    factors.relationship.score,
    factors.timing.score
  ];
  
  this.overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  
  next();
});

module.exports = mongoose.model('WinLossAnalysis', winLossAnalysisSchema);
