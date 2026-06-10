const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  name: {
    type: String,
    required: [true, 'Alert name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['new_tender', 'deadline_reminder', 'status_change', 'custom'],
    required: [true, 'Alert type is required']
  },
  criteria: {
    searchQuery: String,
    therapeuticAreas: [String],
    tenderTypes: [String],
    aiMatchScore: {
      min: { type: Number, min: 0, max: 100, default: 0 },
      max: { type: Number, min: 0, max: 100, default: 100 }
    },
    estimatedValue: {
      min: Number,
      max: Number
    },
    regions: [String],
    organizations: [String],
    status: [String],
    pipelineStage: [String]
  },
  frequency: {
    type: String,
    enum: ['immediate', 'daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  channels: [{
    type: String,
    enum: ['email', 'in_app', 'sms'],
    default: 'email'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastTriggered: Date,
  nextTrigger: Date,
  triggerCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'Alert'
})

// Indexes
alertSchema.index({ user: 1, isActive: 1, isDeleted: 1 })
alertSchema.index({ type: 1, isActive: 1 })
alertSchema.index({ nextTrigger: 1 })

// Calculate next trigger date
alertSchema.pre('save', function(next) {
  if (this.frequency !== 'immediate' && this.isActive) {
    const now = new Date()
    let nextTrigger = new Date(now)
    
    switch (this.frequency) {
      case 'daily':
        nextTrigger.setDate(now.getDate() + 1)
        break
      case 'weekly':
        nextTrigger.setDate(now.getDate() + 7)
        break
      case 'monthly':
        nextTrigger.setMonth(now.getMonth() + 1)
        break
    }
    
    this.nextTrigger = nextTrigger
  }
  next()
})

module.exports = mongoose.model('Alert', alertSchema)
