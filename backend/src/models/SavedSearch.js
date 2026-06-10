const mongoose = require('mongoose')

const savedSearchSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Search name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  filters: {
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
  isDefault: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }],
  lastUsed: {
    type: Date,
    default: Date.now
  },
  useCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'SavedSearch'
})

// Indexes
savedSearchSchema.index({ user: 1, isDeleted: 1 })
savedSearchSchema.index({ name: 1, user: 1 })
savedSearchSchema.index({ isPublic: 1, isDeleted: 1 })

// Ensure only one default search per user
savedSearchSchema.pre('save', function(next) {
  if (this.isDefault) {
    this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    ).exec()
  }
  next()
})

module.exports = mongoose.model('SavedSearch', savedSearchSchema)
