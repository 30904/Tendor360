const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  // Application Settings
  appName: {
    type: String,
    default: 'Tender360',
    trim: true
  },
  version: {
    type: String,
    default: '1.0.0',
    trim: true
  },
  environment: {
    type: String,
    enum: ['Development', 'Staging', 'Production'],
    default: 'Development'
  },
  debugMode: {
    type: Boolean,
    default: false
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: 'System is under maintenance. Please try again later.',
    trim: true
  },

  // File Upload Settings
  maxFileSize: {
    type: String,
    default: '10MB',
    trim: true
  },
  allowedFileTypes: [{
    type: String,
    default: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png']
  }],
  fileStoragePath: {
    type: String,
    default: './uploads',
    trim: true
  },

  // Session and Security Settings
  sessionTimeout: {
    type: Number,
    default: 30, // minutes
    min: 5,
    max: 480
  },
  maxLoginAttempts: {
    type: Number,
    default: 5,
    min: 3,
    max: 10
  },
  lockoutDuration: {
    type: Number,
    default: 15, // minutes
    min: 5,
    max: 60
  },

  // Backup Settings
  backupFrequency: {
    type: String,
    enum: ['Hourly', 'Daily', 'Weekly', 'Monthly'],
    default: 'Daily'
  },
  backupRetention: {
    type: Number,
    default: 30, // days
    min: 1,
    max: 365
  },
  backupPath: {
    type: String,
    default: './backups',
    trim: true
  },

  // Notification Settings
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },

  // Email Configuration
  smtpHost: {
    type: String,
    trim: true
  },
  smtpPort: {
    type: Number,
    default: 587
  },
  smtpSecure: {
    type: Boolean,
    default: false
  },
  smtpUser: {
    type: String,
    trim: true
  },
  smtpPassword: {
    type: String,
    trim: true
  },
  fromEmail: {
    type: String,
    trim: true
  },
  fromName: {
    type: String,
    trim: true
  },

  // SMS Configuration
  smsProvider: {
    type: String,
    enum: ['twilio', 'aws-sns', 'custom'],
    default: 'twilio'
  },
  smsApiKey: {
    type: String,
    trim: true
  },
  smsApiSecret: {
    type: String,
    trim: true
  },
  smsFromNumber: {
    type: String,
    trim: true
  },

  // Database Settings
  databaseBackup: {
    type: Boolean,
    default: true
  },
  databaseOptimization: {
    type: Boolean,
    default: true
  },
  databaseLogging: {
    type: Boolean,
    default: true
  },

  // Logging Settings
  logLevel: {
    type: String,
    enum: ['error', 'warn', 'info', 'debug'],
    default: 'info'
  },
  logRetention: {
    type: Number,
    default: 90, // days
    min: 7,
    max: 365
  },
  logToFile: {
    type: Boolean,
    default: true
  },
  logToConsole: {
    type: Boolean,
    default: true
  },

  // Performance Settings
  cacheEnabled: {
    type: Boolean,
    default: true
  },
  cacheTTL: {
    type: Number,
    default: 300, // seconds
    min: 60,
    max: 3600
  },
  rateLimitEnabled: {
    type: Boolean,
    default: true
  },
  rateLimitWindow: {
    type: Number,
    default: 15, // minutes
    min: 1,
    max: 60
  },
  rateLimitMax: {
    type: Number,
    default: 100, // requests per window
    min: 10,
    max: 1000
  },

  // Feature Flags
  features: {
    tenderManagement: {
      type: Boolean,
      default: true
    },
    documentManagement: {
      type: Boolean,
      default: true
    },
    evaluationSystem: {
      type: Boolean,
      default: true
    },
    supportSystem: {
      type: Boolean,
      default: true
    },
    reporting: {
      type: Boolean,
      default: true
    },
    analytics: {
      type: Boolean,
      default: true
    },
    auditLogging: {
      type: Boolean,
      default: true
    }
  },

  // Custom Settings (for extensibility)
  customSettings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Metadata
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'SystemConfig'
});

// Indexes
systemConfigSchema.index({ environment: 1 });
systemConfigSchema.index({ 'features.tenderManagement': 1 });

// Virtual for formatted file size
systemConfigSchema.virtual('maxFileSizeBytes').get(function() {
  const size = this.maxFileSize;
  if (typeof size === 'string') {
    const match = size.match(/^(\d+)([KMGT]?B)$/i);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2].toUpperCase();
      const multipliers = { 'B': 1, 'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024, 'TB': 1024 * 1024 * 1024 * 1024 };
      return value * multipliers[unit];
    }
  }
  return 10 * 1024 * 1024; // Default 10MB
});

// Ensure virtual fields are serialized
systemConfigSchema.set('toJSON', { virtuals: true });
systemConfigSchema.set('toObject', { virtuals: true });

// Pre-save middleware
systemConfigSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Static methods
systemConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne().sort({ createdAt: -1 });
  
  if (!config) {
    // Create default configuration
    config = await this.create({
      updatedBy: '000000000000000000000000' // System user ID
    });
  }
  
  return config;
};

systemConfigSchema.statics.updateConfig = async function(updates, userId) {
  let config = await this.findOne().sort({ createdAt: -1 });
  
  if (!config) {
    config = new this({
      ...updates,
      updatedBy: userId
    });
  } else {
    Object.assign(config, updates, { updatedBy: userId });
  }
  
  return await config.save();
};

systemConfigSchema.statics.getFeatureFlag = async function(featureName) {
  const config = await this.getConfig();
  return config.features[featureName] || false;
};

systemConfigSchema.statics.isFeatureEnabled = async function(featureName) {
  return await this.getFeatureFlag(featureName);
};

// Instance methods
systemConfigSchema.methods.isMaintenanceMode = function() {
  return this.maintenanceMode;
};

systemConfigSchema.methods.isDebugMode = function() {
  return this.debugMode;
};

systemConfigSchema.methods.getMaintenanceMessage = function() {
  return this.maintenanceMessage;
};

systemConfigSchema.methods.canUploadFile = function(fileSize, fileType) {
  // Check file size
  if (fileSize > this.maxFileSizeBytes) {
    return false;
  }
  
  // Check file type
  const extension = fileType.toLowerCase().split('.').pop();
  return this.allowedFileTypes.includes(extension);
};

// Create default configuration
systemConfigSchema.statics.initializeDefaultConfig = async function() {
  const existingConfig = await this.findOne();
  if (!existingConfig) {
    await this.create({
      updatedBy: '000000000000000000000000' // System user ID
    });
  }
};

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
