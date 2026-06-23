const mongoose = require('mongoose')

const tenderSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  reference: {
    type: String,
    required: [true, 'Tender reference is required'],
    trim: true,
    uppercase: true
  },
  title: {
    type: String,
    required: [true, 'Tender title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  organization: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  estimatedValue: {
    type: Number,
    required: [true, 'Estimated value is required'],
    min: [0, 'Value cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']
  },
  deadline: {
    type: Date,
    required: [true, 'Submission deadline is required']
  },
  tenderType: {
    type: String,
    required: [true, 'Tender type is required'],
    enum: ['Public Procurement', 'Hospital Tender', 'Government RFP', 'Private Tender', 'Framework Agreement', 'Supply Agreement']
  },
  therapeuticArea: {
    type: String,
    required: [true, 'Therapeutic area is required'],
    enum: ['Diabetes', 'Rare Diseases', 'Cardiovascular', 'Oncology', 'Neurology', 'Respiratory', 'Other']
  },
  aiMatchScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'overdue', 'closed', 'awarded', 'cancelled'],
    default: 'active'
  },
  tags: [{
    type: String,
    trim: true
  }],
  publishedDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  source: {
    type: String,
    required: [true, 'Tender source is required'],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tender owner is required']
  },
  dueDates: {
    submission: {
      type: Date,
      required: false
    },
    clarification: Date,
    award: Date
  },
  requirements: {
    technical: [String],
    financial: [String],
    legal: [String]
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  pipelineStage: {
    type: String,
    enum: ['identified', 'evaluating', 'pursuing', 'submitted', 'awarded', 'lost'],
    default: 'identified'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  winProbability: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  competitors: [{
    name: String,
    strength: {
      type: String,
      enum: ['weak', 'medium', 'strong']
    }
  }],
  discovery: {
    externalKey: { type: String, trim: true, index: true },
    connectorType: { type: String, trim: true },
    importedAt: Date,
    externalUpdatedAt: Date,
    lastSyncedAt: Date,
    contentHash: { type: String, trim: true },
    changeStatus: {
      type: String,
      enum: ['new', 'updated', 'unchanged'],
      default: 'new'
    },
    metadata: {
      programSummary: String,
      timeline: mongoose.Schema.Types.Mixed,
      contacts: [mongoose.Schema.Types.Mixed],
      agency: String,
      naics: String,
      setAside: String,
      sourceConnector: String,
      extractedAt: Date
    },
    attachments: {
      downloaded: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      samFallbackUsed: { type: Boolean, default: false },
      documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
    },
    isDemo: { type: Boolean, default: false }
  },
  intelligence: {
    metadata: mongoose.Schema.Types.Mixed,
    commercial: {
      shipTo: String,
      quantity: [mongoose.Schema.Types.Mixed],
      scope: String,
      skus: [String],
      extractedAt: Date
    },
    terms: {
      insurance: [String],
      freight: [String],
      pricingTerms: [String],
      clauses: [mongoose.Schema.Types.Mixed],
      extractedAt: Date
    },
    pricing: {
      lineItems: [mongoose.Schema.Types.Mixed],
      extractedAt: Date
    },
    relevancy: {
      compositeScore: Number,
      recommendation: String,
      dimensions: mongoose.Schema.Types.Mixed,
      scoredAt: Date,
      modelProvider: String
    }
  },
  crmValidation: {
    status: {
      type: String,
      enum: ['validated', 'partial', 'not_found', 'pending'],
      default: 'pending'
    },
    salesforceAccountId: String,
    matchedAccountName: String,
    matchScore: Number,
    matchMethod: {
      type: String,
      enum: ['salesforce_api', 'crm_cache', 'heuristic']
    },
    matchedBy: mongoose.Schema.Types.Mixed,
    validatedAt: Date,
    snapshot: mongoose.Schema.Types.Mixed
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'Tender'
})

// Indexes for better search performance
tenderSchema.index({ companyId: 1, reference: 1 }, { unique: true }) // Unique reference per company
tenderSchema.index({ companyId: 1, title: 'text', description: 'text', organization: 'text' })
tenderSchema.index({ companyId: 1, status: 1, deadline: 1 })
tenderSchema.index({ companyId: 1, aiMatchScore: -1 })
tenderSchema.index({ companyId: 1, estimatedValue: -1 })
tenderSchema.index({ companyId: 1, therapeuticArea: 1 })
tenderSchema.index({ companyId: 1, tenderType: 1 })
tenderSchema.index({ companyId: 1, location: 1 })
tenderSchema.index({ companyId: 1, pipelineStage: 1 })
tenderSchema.index({ companyId: 1, owner: 1 })
tenderSchema.index({ companyId: 1, isDeleted: 1 })

// Virtual for days until deadline
tenderSchema.virtual('daysUntilDeadline').get(function() {
  const today = new Date()
  const deadline = new Date(this.deadline)
  const diffTime = deadline - today
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Virtual for urgency status
tenderSchema.virtual('urgencyStatus').get(function() {
  const daysUntil = this.daysUntilDeadline
  if (daysUntil < 0) return { status: 'Overdue', variant: 'danger', icon: '⚠️' }
  if (daysUntil <= 7) return { status: 'Urgent', variant: 'warning', icon: '🚨' }
  if (daysUntil <= 30) return { status: 'Due Soon', variant: 'info', icon: '⏰' }
  return { status: 'Active', variant: 'success', icon: '✅' }
})

// Ensure virtuals are included in JSON output
tenderSchema.set('toJSON', { virtuals: true })
tenderSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Tender', tenderSchema)
