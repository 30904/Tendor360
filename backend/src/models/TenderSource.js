const mongoose = require('mongoose');

const tenderSourceSchema = new mongoose.Schema({
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
    required: [true, 'Source name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  type: {
    type: String,
    required: [true, 'Source type is required'],
    enum: ['Government', 'News', 'Private', 'Industry', 'Consortium', 'Direct'],
    default: 'Government'
  },
  
  url: {
    type: String,
    required: [true, 'Source URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'URL must be a valid HTTP/HTTPS URL'
    }
  },

  /** Product-level discovery integration (TB-001 generic) */
  integrationMode: {
    type: String,
    enum: ['api', 'web_scraping', 'email', 'manual'],
    default: 'api'
  },

  connectorTemplate: {
    type: String,
    enum: ['generic_api', 'govwin', 'sam_gov', 'web_scrape', 'email', 'manual'],
    default: 'generic_api'
  },

  discoveryConfig: {
    baseUrl: { type: String, trim: true },
    opportunitiesPath: { type: String, trim: true, default: '/opportunities' },
    authType: {
      type: String,
      enum: ['none', 'bearer', 'api_key', 'basic'],
      default: 'bearer'
    },
    apiKeyHeader: { type: String, trim: true, default: 'Authorization' },
    apiKeyPrefix: { type: String, trim: true, default: 'Bearer' },
    lookbackHours: { type: Number, default: 24, min: 1, max: 720 },
    pageSize: { type: Number, default: 25, min: 1, max: 100 },
    searchQuery: { type: String, trim: true, default: '' },
    searchParams: { type: mongoose.Schema.Types.Mixed, default: {} },
    scheduleEnabled: { type: Boolean, default: true }
  },

  scrapingConfig: {
    loginUrl: { type: String, trim: true },
    searchUrl: { type: String, trim: true },
    loginUsername: { type: String, trim: true },
    loginPassword: { type: String, trim: true },
    resultsContainerSelector: { type: String, trim: true },
    itemLinkSelector: { type: String, trim: true, default: 'a[href]' }
  },
  
  // Status and configuration
  status: {
    type: String,
    enum: ['active', 'inactive', 'error', 'pending'],
    default: 'active'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  reliability: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Monitoring configuration
  frequency: {
    type: String,
    enum: ['realtime', 'hourly', 'every_4_hours', 'daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  
  lastSync: {
    type: Date,
    default: null
  },
  
  nextSync: {
    type: Date,
    default: null
  },
  
  // Performance metrics
  totalTenders: {
    type: Number,
    default: 0,
    min: 0
  },
  
  newTenders: {
    type: Number,
    default: 0,
    min: 0
  },
  
  successRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  errorCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  lastError: {
    type: String,
    default: null
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
    default: 'Standard monitoring configuration'
  },
  
  // Categories and filtering
  categories: [{
    type: String,
    trim: true
  }],
  
  keywords: [{
    type: String,
    trim: true
  }],
  
  keywordFilePath: {
    type: String,
    trim: true,
    default: null
  },
  
  // Geographic and sector filters
  regions: [{
    type: String,
    trim: true
  }],
  
  sectors: [{
    type: String,
    trim: true
  }],
  
  // Authentication and access
  requiresAuth: {
    type: Boolean,
    default: false
  },
  
  authCredentials: {
    username: String,
    password: String, // Should be encrypted in production
    apiKey: String,
    token: String
  },
  
  // Parsing configuration
  parsingConfig: {
    tenderSelector: String,
    titleSelector: String,
    descriptionSelector: String,
    deadlineSelector: String,
    valueSelector: String,
    organizationSelector: String,
    customSelectors: mongoose.Schema.Types.Mixed
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
    webhookUrl: String
  },
  
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
  collection: 'TenderSource'
});

// Indexes for better search performance
tenderSourceSchema.index({ companyId: 1, name: 1 }, { unique: true });
tenderSourceSchema.index({ companyId: 1, type: 1 });
tenderSourceSchema.index({ companyId: 1, status: 1 });
tenderSourceSchema.index({ companyId: 1, priority: 1 });
tenderSourceSchema.index({ companyId: 1, lastSync: 1 });
tenderSourceSchema.index({ companyId: 1, nextSync: 1 });
tenderSourceSchema.index({ companyId: 1, isDeleted: 1 });
tenderSourceSchema.index({ companyId: 1, 'categories': 1 });
tenderSourceSchema.index({ companyId: 1, 'keywords': 1 });

// Virtual for sync status
tenderSourceSchema.virtual('syncStatus').get(function() {
  if (!this.lastSync) return { status: 'Never Synced', variant: 'secondary', icon: '⏰' };
  
  const now = new Date();
  const lastSync = new Date(this.lastSync);
  const diffHours = (now - lastSync) / (1000 * 60 * 60);
  
  if (diffHours < 1) return { status: 'Just Synced', variant: 'success', icon: '✅' };
  if (diffHours < 24) return { status: 'Recently Synced', variant: 'info', icon: '🔄' };
  if (diffHours < 168) return { status: 'Synced This Week', variant: 'warning', icon: '⚠️' };
  return { status: 'Stale', variant: 'danger', icon: '❌' };
});

// Virtual for health score
tenderSourceSchema.virtual('healthScore').get(function() {
  let score = 100;
  
  // Deduct for errors
  if (this.errorCount > 0) score -= Math.min(this.errorCount * 5, 30);
  
  // Deduct for stale sync
  if (this.lastSync) {
    const now = new Date();
    const lastSync = new Date(this.lastSync);
    const diffHours = (now - lastSync) / (1000 * 60 * 60);
    if (diffHours > 168) score -= 20; // More than a week
    else if (diffHours > 72) score -= 10; // More than 3 days
  } else {
    score -= 50; // Never synced
  }
  
  // Deduct for low success rate
  if (this.successRate < 50) score -= 20;
  else if (this.successRate < 80) score -= 10;
  
  return Math.max(score, 0);
});

// Ensure virtuals are included in JSON output
tenderSourceSchema.set('toJSON', { virtuals: true });
tenderSourceSchema.set('toObject', { virtuals: true });

// Pre-save middleware
tenderSourceSchema.pre('save', function(next) {
  if (!this.connectorTemplate) {
    if (this.integrationMode === 'web_scraping') this.connectorTemplate = 'web_scrape';
    else if (this.integrationMode === 'email') this.connectorTemplate = 'email';
    else if (this.integrationMode === 'manual') this.connectorTemplate = 'manual';
    else this.connectorTemplate = 'generic_api';
  }

  if (this.discoveryConfig && !this.discoveryConfig.baseUrl && this.url) {
    this.discoveryConfig.baseUrl = this.url;
  }

  // Calculate next sync time based on frequency
  if (this.frequency && (this.isModified('frequency') || !this.nextSync)) {
    const now = new Date();
    let nextSync = new Date(now);
    
    switch (this.frequency) {
      case 'realtime':
        nextSync.setMinutes(now.getMinutes() + 1);
        break;
      case 'hourly':
        nextSync.setHours(now.getHours() + 1);
        break;
      case 'every_4_hours':
        nextSync.setHours(now.getHours() + 4);
        break;
      case 'daily':
        nextSync.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        nextSync.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        nextSync.setMonth(now.getMonth() + 1);
        break;
    }
    
    this.nextSync = nextSync;
  }
  
  next();
});

// Static methods
tenderSourceSchema.statics.findActive = function(companyId) {
  return this.find({ 
    companyId: new mongoose.Types.ObjectId(companyId), 
    status: 'active', 
    isDeleted: false 
  });
};

tenderSourceSchema.statics.findByType = function(companyId, type) {
  return this.find({ 
    companyId: new mongoose.Types.ObjectId(companyId), 
    type, 
    isDeleted: false 
  });
};

tenderSourceSchema.statics.findDueForSync = function(companyId) {
  return this.find({
    companyId: new mongoose.Types.ObjectId(companyId),
    status: 'active',
    isDeleted: false,
    $or: [
      { nextSync: { $lte: new Date() } },
      { lastSync: { $exists: false } },
      { lastSync: null }
    ]
  });
};

// Instance methods
tenderSourceSchema.methods.updateSyncStatus = function(success, errorMessage = null) {
  this.lastSync = new Date();
  
  if (success) {
    this.errorCount = 0;
    this.lastError = null;
  } else {
    this.errorCount += 1;
    this.lastError = errorMessage;
  }
  
  // Calculate next sync time
  const now = new Date();
  let nextSync = new Date(now);
  
  switch (this.frequency) {
    case 'realtime':
      nextSync.setMinutes(now.getMinutes() + 1);
      break;
    case 'hourly':
      nextSync.setHours(now.getHours() + 1);
      break;
    case 'every_4_hours':
      nextSync.setHours(now.getHours() + 4);
      break;
    case 'daily':
      nextSync.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      nextSync.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      nextSync.setMonth(now.getMonth() + 1);
      break;
  }
  
  this.nextSync = nextSync;
  return this.save();
};

tenderSourceSchema.methods.addNote = function(userId, content) {
  this.notes.push({
    user: userId,
    content: content.trim()
  });
  return this.save();
};

module.exports = mongoose.model('TenderSource', tenderSourceSchema);
