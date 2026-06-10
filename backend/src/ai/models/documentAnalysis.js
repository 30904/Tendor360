const mongoose = require('mongoose');

const documentAnalysisSchema = new mongoose.Schema({
  // Document reference
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  
  // Company and user context
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Analysis metadata
  analysisType: {
    type: String,
    enum: ['full', 'requirements', 'risks', 'summary', 'dates'],
    default: 'full'
  },

  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },

  // Document information
  documentInfo: {
    filePath: String,
    fileType: String,
    textLength: Number,
    analyzedAt: {
      type: Date,
      default: Date.now
    }
  },

  // AI Analysis Results
  requirements: {
    technical_requirements: [{
      requirement: String,
      category: String,
      mandatory: Boolean,
      description: String
    }],
    commercial_requirements: [{
      requirement: String,
      category: String,
      mandatory: Boolean,
      description: String
    }],
    compliance_requirements: [{
      requirement: String,
      category: String,
      mandatory: Boolean,
      description: String
    }],
    timeline_requirements: [{
      requirement: String,
      deadline: String,
      mandatory: Boolean,
      description: String
    }],
    summary: String
  },

  risks: {
    high_risks: [{
      risk: String,
      category: String,
      description: String,
      mitigation: String,
      impact: String
    }],
    medium_risks: [{
      risk: String,
      category: String,
      description: String,
      mitigation: String,
      impact: String
    }],
    low_risks: [{
      risk: String,
      category: String,
      description: String,
      mitigation: String,
      impact: String
    }],
    overall_risk_score: {
      type: Number,
      min: 1,
      max: 10
    },
    risk_summary: String
  },

  summary: {
    summary: String,
    generated_at: Date,
    word_count: Number
  },

  dates: {
    key_dates: [{
      date: Date,
      description: String,
      type: {
        type: String,
        enum: ['deadline', 'milestone', 'meeting', 'other']
      },
      importance: {
        type: String,
        enum: ['high', 'medium', 'low']
      }
    }],
    timeline_summary: String
  },

  // Analysis quality metrics
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1
  },

  // Error handling
  error: {
    message: String,
    code: String,
    timestamp: Date
  },

  // Processing metadata
  processingTime: Number, // in milliseconds
  aiModel: String,
  tokensUsed: Number,

  // User feedback
  userFeedback: {
    helpful: Boolean,
    accuracy: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    feedbackDate: Date
  }
}, {
  timestamps: true,
  collection: 'document_analyses'
});

// Indexes for performance
documentAnalysisSchema.index({ documentId: 1, companyId: 1 });
documentAnalysisSchema.index({ createdBy: 1, createdAt: -1 });
documentAnalysisSchema.index({ status: 1 });
documentAnalysisSchema.index({ 'risks.overall_risk_score': 1 });

// Virtual for total requirements count
documentAnalysisSchema.virtual('totalRequirements').get(function() {
  if (!this.requirements) return 0;
  return (this.requirements.technical_requirements?.length || 0) +
         (this.requirements.commercial_requirements?.length || 0) +
         (this.requirements.compliance_requirements?.length || 0) +
         (this.requirements.timeline_requirements?.length || 0);
});

// Virtual for total risks count
documentAnalysisSchema.virtual('totalRisks').get(function() {
  if (!this.risks) return 0;
  return (this.risks.high_risks?.length || 0) +
         (this.risks.medium_risks?.length || 0) +
         (this.risks.low_risks?.length || 0);
});

// Method to get risk level based on score
documentAnalysisSchema.methods.getRiskLevel = function() {
  if (!this.risks?.overall_risk_score) return 'unknown';
  const score = this.risks.overall_risk_score;
  if (score >= 8) return 'very_high';
  if (score >= 6) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
};

// Method to get analysis summary
documentAnalysisSchema.methods.getAnalysisSummary = function() {
  return {
    id: this._id,
    documentId: this.documentId,
    status: this.status,
    analysisType: this.analysisType,
    totalRequirements: this.totalRequirements,
    totalRisks: this.totalRisks,
    risks: {
      overall_risk_score: this.risks?.overall_risk_score ?? null
    },
    riskLevel: this.getRiskLevel(),
    confidenceScore: this.confidenceScore,
    createdAt: this.createdAt,
    analyzedAt: this.documentInfo?.analyzedAt,
    processingTime: this.processingTime
  };
};

// Static method to get analysis statistics
documentAnalysisSchema.statics.getAnalysisStats = async function(companyId, dateRange = null) {
  const match = { companyId };
  if (dateRange) {
    match.createdAt = {
      $gte: dateRange.start,
      $lte: dateRange.end
    };
  }

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalAnalyses: { $sum: 1 },
        completedAnalyses: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        failedAnalyses: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        avgConfidenceScore: { $avg: '$confidenceScore' },
        avgProcessingTime: { $avg: '$processingTime' },
        avgRiskScore: { $avg: '$risks.overall_risk_score' }
      }
    }
  ]);

  return stats[0] || {
    totalAnalyses: 0,
    completedAnalyses: 0,
    failedAnalyses: 0,
    avgConfidenceScore: 0,
    avgProcessingTime: 0,
    avgRiskScore: 0
  };
};

module.exports = mongoose.model('DocumentAnalysis', documentAnalysisSchema);
