const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  
  // Basic information
  name: {
    type: String,
    required: [true, 'Watchlist name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Status and configuration
  status: {
    type: String,
    enum: ['active', 'inactive', 'paused'],
    default: 'active'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Monitoring configuration
  frequency: {
    type: String,
    enum: ['realtime', 'hourly', 'every_4_hours', 'daily', 'weekly'],
    default: 'daily'
  },
  
  lastRun: {
    type: Date,
    default: null
  },
  
  nextRun: {
    type: Date,
    default: null
  },
  
  // Search criteria
  keywords: [{
    type: String,
    trim: true,
    required: true
  }],
  
  categories: [{
    type: String,
    trim: true
  }],
  
  sectors: [{
    type: String,
    trim: true
  }],
  
  regions: [{
    type: String,
    trim: true
  }],
  
  // Value and size filters
  minValue: {
    type: Number,
    default: 0,
    min: 0
  },
  
  maxValue: {
    type: Number,
    default: null
  },
  
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']
  },
  
  // Date filters
  daysAhead: {
    type: Number,
    default: 30,
    min: 1,
    max: 365
  },
  
  daysBehind: {
    type: Number,
    default: 7,
    min: 0,
    max: 90
  },
  
  // Organization filters
  organizations: [{
    type: String,
    trim: true
  }],
  
  excludeOrganizations: [{
    type: String,
    trim: true
  }],
  
  // Advanced filters
  tenderTypes: [{
    type: String,
    enum: ['Public Procurement', 'Hospital Tender', 'Government RFP', 'Private Tender', 'Framework Agreement', 'Supply Agreement']
  }],
  
  therapeuticAreas: [{
    type: String,
    enum: ['Diabetes', 'Rare Diseases', 'Cardiovascular', 'Oncology', 'Neurology', 'Respiratory', 'Other']
  }],
  
  // Performance metrics
  totalMatches: {
    type: Number,
    default: 0,
    min: 0
  },
  
  newMatches: {
    type: Number,
    default: 0,
    min: 0
  },
  
  totalAlerts: {
    type: Number,
    default: 0,
    min: 0
  },
  
  lastAlert: {
    type: Date,
    default: null
  },
  
  successRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // AI and optimization
  aiConfidence: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  aiOptimization: {
    type: String,
    default: 'Standard keyword matching configuration'
  },
  
  // Notification settings
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: true
    },
    webhook: {
      type: Boolean,
      default: false
    },
    webhookUrl: String,
    immediate: {
      type: Boolean,
      default: false
    },
    digest: {
      type: Boolean,
      default: true
    },
    digestFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    }
  },
  
  // Alert history
  alerts: [{
    tenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tender'
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100
    },
    matchedKeywords: [String],
    matchedCategories: [String],
    alertType: {
      type: String,
      enum: ['new_match', 'high_value', 'deadline_approaching', 'custom_criteria'],
      default: 'new_match'
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  
  // Ownership and management
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Sharing and collaboration
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permissions: {
      type: String,
      enum: ['read', 'edit', 'admin'],
      default: 'read'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Metadata
  tags: [{
    type: String,
    trim: true
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
  
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'Watchlist'
});

// Indexes for better search performance
watchlistSchema.index({ companyId: 1, name: 1 }, { unique: true });
watchlistSchema.index({ companyId: 1, status: 1 });
watchlistSchema.index({ companyId: 1, priority: 1 });
watchlistSchema.index({ companyId: 1, lastRun: 1 });
watchlistSchema.index({ companyId: 1, nextRun: 1 });
watchlistSchema.index({ companyId: 1, isDeleted: 1 });
watchlistSchema.index({ companyId: 1, 'keywords': 1 });
watchlistSchema.index({ companyId: 1, 'categories': 1 });
watchlistSchema.index({ companyId: 1, 'owner': 1 });

// Virtual for match rate
watchlistSchema.virtual('matchRate').get(function() {
  if (this.totalMatches === 0) return 0;
  return Math.round((this.newMatches / this.totalMatches) * 100);
});

// Virtual for alert status
watchlistSchema.virtual('alertStatus').get(function() {
  if (!this.lastAlert) return { status: 'No Alerts', variant: 'secondary', icon: '🔕' };
  
  const now = new Date();
  const lastAlert = new Date(this.lastAlert);
  const diffHours = (now - lastAlert) / (1000 * 60 * 60);
  
  if (diffHours < 1) return { status: 'Recent Alert', variant: 'success', icon: '🔔' };
  if (diffHours < 24) return { status: 'Alert Today', variant: 'info', icon: '🔔' };
  if (diffHours < 168) return { status: 'Alert This Week', variant: 'warning', icon: '🔕' };
  return { status: 'No Recent Alerts', variant: 'secondary', icon: '🔕' };
});

// Virtual for health score
watchlistSchema.virtual('healthScore').get(function() {
  let score = 100;
  
  // Deduct for no recent activity
  if (this.lastRun) {
    const now = new Date();
    const lastRun = new Date(this.lastRun);
    const diffHours = (now - lastRun) / (1000 * 60 * 60);
    if (diffHours > 168) score -= 30; // More than a week
    else if (diffHours > 72) score -= 15; // More than 3 days
  } else {
    score -= 50; // Never run
  }
  
  // Deduct for low success rate
  if (this.successRate < 50) score -= 20;
  else if (this.successRate < 80) score -= 10;
  
  // Bonus for high match rate
  if (this.matchRate > 80) score += 10;
  else if (this.matchRate > 60) score += 5;
  
  return Math.max(Math.min(score, 100), 0);
});

// Ensure virtuals are included in JSON output
watchlistSchema.set('toJSON', { virtuals: true });
watchlistSchema.set('toObject', { virtuals: true });

// Pre-save middleware
watchlistSchema.pre('save', function(next) {
  // Calculate next run time based on frequency
  if (this.frequency && this.isModified('frequency')) {
    const now = new Date();
    let nextRun = new Date(now);
    
    switch (this.frequency) {
      case 'realtime':
        nextRun.setMinutes(now.getMinutes() + 1);
        break;
      case 'hourly':
        nextRun.setHours(now.getHours() + 1);
        break;
      case 'every_4_hours':
        nextRun.setHours(now.getHours() + 4);
        break;
      case 'daily':
        nextRun.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        nextRun.setDate(now.getDate() + 7);
        break;
    }
    
    this.nextRun = nextRun;
  }
  
  next();
});

// Static methods
watchlistSchema.statics.findActive = function(companyId) {
  return this.find({ 
    companyId: new mongoose.Types.ObjectId(companyId), 
    status: 'active', 
    isDeleted: false 
  });
};

watchlistSchema.statics.findDueForRun = function(companyId) {
  return this.find({
    companyId: new mongoose.Types.ObjectId(companyId),
    status: 'active',
    isDeleted: false,
    $or: [
      { nextRun: { $lte: new Date() } },
      { lastRun: { $exists: false } },
      { lastRun: null }
    ]
  });
};

watchlistSchema.statics.findByKeywords = function(companyId, keywords) {
  return this.find({
    companyId: new mongoose.Types.ObjectId(companyId),
    status: 'active',
    isDeleted: false,
    keywords: { $in: keywords }
  });
};

// Instance methods
watchlistSchema.methods.updateRunStatus = function(success, matchesFound = 0) {
  this.lastRun = new Date();
  
  if (success) {
    this.newMatches = matchesFound;
    this.totalMatches += matchesFound;
  }
  
  // Calculate next run time
  const now = new Date();
  let nextRun = new Date(now);
  
  switch (this.frequency) {
    case 'realtime':
      nextRun.setMinutes(now.getMinutes() + 1);
      break;
    case 'hourly':
      nextRun.setHours(now.getHours() + 1);
      break;
    case 'every_4_hours':
      nextRun.setHours(now.getHours() + 4);
      break;
    case 'daily':
      nextRun.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      nextRun.setDate(now.getDate() + 7);
      break;
  }
  
  this.nextRun = nextRun;
  return this.save();
};

watchlistSchema.methods.addAlert = function(tenderId, matchScore, matchedKeywords, matchedCategories, alertType = 'new_match') {
  this.alerts.push({
    tenderId,
    matchScore,
    matchedKeywords,
    matchedCategories,
    alertType,
    sentAt: new Date()
  });
  
  this.totalAlerts += 1;
  this.lastAlert = new Date();
  
  return this.save();
};

watchlistSchema.methods.addNote = function(userId, content) {
  this.notes.push({
    user: userId,
    content: content.trim()
  });
  return this.save();
};

watchlistSchema.methods.shareWith = function(userId, permissions = 'read') {
  // Check if already shared
  const existingShare = this.sharedWith.find(share => share.user.toString() === userId.toString());
  if (existingShare) {
    existingShare.permissions = permissions;
  } else {
    this.sharedWith.push({
      user: userId,
      permissions
    });
  }
  return this.save();
};

watchlistSchema.methods.removeShare = function(userId) {
  this.sharedWith = this.sharedWith.filter(share => share.user.toString() !== userId.toString());
  return this.save();
};

module.exports = mongoose.model('Watchlist', watchlistSchema);
