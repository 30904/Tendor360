const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userRoles: [{
    type: String,
    trim: true
  }],

  // Action Information
  action: {
    type: String,
    required: true,
    trim: true
  },
  resource: {
    type: String,
    required: true,
    trim: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  resourceType: {
    type: String,
    trim: true
  },

  // Request Information
  ipAddress: {
    type: String,
    required: true,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  requestMethod: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    required: true
  },
  requestUrl: {
    type: String,
    required: true,
    trim: true
  },
  requestBody: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  requestParams: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  requestQuery: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  // Response Information
  responseStatus: {
    type: Number,
    required: true
  },
  responseBody: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  responseTime: {
    type: Number, // milliseconds
    default: 0
  },

  // Status and Details
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PENDING', 'CANCELLED'],
    default: 'SUCCESS'
  },
  errorMessage: {
    type: String,
    trim: true
  },
  errorStack: {
    type: String,
    trim: true
  },

  // Additional Context
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  tags: [{
    type: String,
    trim: true
  }],
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },

  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'AuditLog'
});

// Indexes for efficient querying
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, timestamp: -1 });
auditLogSchema.index({ status: 1, timestamp: -1 });
auditLogSchema.index({ ipAddress: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });
auditLogSchema.index({ 'userRoles': 1, timestamp: -1 });

// Compound indexes for common queries
auditLogSchema.index({ userId: 1, action: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1, timestamp: -1 });
auditLogSchema.index({ status: 1, severity: 1, timestamp: -1 });

// TTL index for automatic cleanup (optional)
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

// Pre-save middleware
auditLogSchema.pre('save', function(next) {
  // Ensure timestamp is set
  if (!this.timestamp) {
    this.timestamp = new Date();
  }
  
  // Set severity based on action and status
  if (this.status === 'FAILED' || this.errorMessage) {
    this.severity = 'HIGH';
  } else if (['DELETE', 'UPDATE'].includes(this.requestMethod)) {
    this.severity = 'MEDIUM';
  }
  
  next();
});

// Static methods
auditLogSchema.statics.logAction = async function(logData) {
  try {
    const log = new this(logData);
    return await log.save();
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to avoid breaking the main flow
    return null;
  }
};

auditLogSchema.statics.getUserActivity = async function(userId, options = {}) {
  const {
    limit = 50,
    skip = 0,
    startDate,
    endDate,
    actions,
    resources,
    status
  } = options;

  const query = { userId };

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  if (actions && actions.length > 0) {
    query.action = { $in: actions };
  }

  if (resources && resources.length > 0) {
    query.resource = { $in: resources };
  }

  if (status) {
    query.status = status;
  }

  return await this.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .select('-requestBody -responseBody -errorStack');
};

auditLogSchema.statics.getSystemActivity = async function(options = {}) {
  const {
    limit = 100,
    skip = 0,
    startDate,
    endDate,
    actions,
    resources,
    status,
    severity,
    userRoles
  } = options;

  const query = {};

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  if (actions && actions.length > 0) {
    query.action = { $in: actions };
  }

  if (resources && resources.length > 0) {
    query.resource = { $in: resources };
  }

  if (status) {
    query.status = status;
  }

  if (severity) {
    query.severity = severity;
  }

  if (userRoles && userRoles.length > 0) {
    query.userRoles = { $in: userRoles };
  }

  return await this.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .select('-requestBody -responseBody -errorStack');
};

auditLogSchema.statics.getActivitySummary = async function(options = {}) {
  const {
    startDate,
    endDate,
    groupBy = 'action'
  } = options;

  const matchStage = {};

  if (startDate || endDate) {
    matchStage.timestamp = {};
    if (startDate) matchStage.timestamp.$gte = new Date(startDate);
    if (endDate) matchStage.timestamp.$lte = new Date(endDate);
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: `$${groupBy}`,
        count: { $sum: 1 },
        successCount: {
          $sum: { $cond: [{ $eq: ['$status', 'SUCCESS'] }, 1, 0] }
        },
        failedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] }
        },
        avgResponseTime: { $avg: '$responseTime' }
      }
    },
    { $sort: { count: -1 } }
  ];

  return await this.aggregate(pipeline);
};

auditLogSchema.statics.cleanupOldLogs = async function(daysToKeep = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await this.deleteMany({
    timestamp: { $lt: cutoffDate }
  });

  return result.deletedCount;
};

// Instance methods
auditLogSchema.methods.isSuccess = function() {
  return this.status === 'SUCCESS';
};

auditLogSchema.methods.isFailed = function() {
  return this.status === 'FAILED';
};

auditLogSchema.methods.getDuration = function() {
  if (this.responseTime) {
    return `${this.responseTime}ms`;
  }
  return 'N/A';
};

// Create audit log entry helper
auditLogSchema.statics.createLog = async function({
  userId,
  userEmail,
  userName,
  userRoles,
  action,
  resource,
  resourceId,
  resourceType,
  ipAddress,
  userAgent,
  requestMethod,
  requestUrl,
  requestBody,
  requestParams,
  requestQuery,
  responseStatus,
  responseBody,
  responseTime,
  status = 'SUCCESS',
  errorMessage,
  errorStack,
  metadata = {},
  tags = []
}) {
  return await this.logAction({
    userId,
    userEmail,
    userName,
    userRoles,
    action,
    resource,
    resourceId,
    resourceType,
    ipAddress,
    userAgent,
    requestMethod,
    requestUrl,
    requestBody,
    requestParams,
    requestQuery,
    responseStatus,
    responseBody,
    responseTime,
    status,
    errorMessage,
    errorStack,
    metadata,
    tags
  });
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
