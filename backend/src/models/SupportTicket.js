const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  // Basic ticket information
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'TKT-' + Date.now().toString().slice(-8);
    }
  },
  
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Ticket categorization
  category: {
    type: String,
    required: true,
    enum: ['TECHNICAL', 'BILLING', 'FEATURE_REQUEST', 'BUG_REPORT', 'GENERAL', 'TRAINING', 'INTEGRATION'],
    default: 'GENERAL'
  },
  
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters']
  },
  
  priority: {
    type: String,
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL'],
    default: 'MEDIUM'
  },
  
  status: {
    type: String,
    required: true,
    enum: ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED', 'CANCELLED'],
    default: 'OPEN'
  },
  
  // User and assignment
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Timestamps and tracking
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  resolvedAt: Date,
  closedAt: Date,
  
  // SLA tracking
  slaTarget: {
    type: Date
  },
  
  slaBreached: {
    type: Boolean,
    default: false
  },
  
  // Communication
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    attachments: [{
      filename: String,
      path: String,
      mimeType: String,
      size: Number
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tags and metadata
  tags: [String],
  
  // Related items
  relatedTenders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender'
  }],
  
  relatedDocuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  
  // Customer satisfaction
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  feedback: {
    type: String,
    trim: true,
    maxlength: [500, 'Feedback cannot exceed 500 characters']
  },
  
  // System fields
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'SupportTicket'
});

// Indexes for performance
supportTicketSchema.index({ ticketNumber: 1 });
supportTicketSchema.index({ status: 1, priority: 1 });
supportTicketSchema.index({ createdBy: 1 });
supportTicketSchema.index({ assignedTo: 1 });
supportTicketSchema.index({ category: 1 });
supportTicketSchema.index({ createdAt: -1 });
supportTicketSchema.index({ isDeleted: 1 });

// Pre-save middleware to update timestamps
supportTicketSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  this.lastActivity = new Date();
  next();
});

// Virtual for ticket age
supportTicketSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for SLA status
supportTicketSchema.virtual('slaStatus').get(function() {
  if (!this.slaTarget) return 'NO_SLA';
  const now = new Date();
  if (now > this.slaTarget) return 'BREACHED';
  if (now > new Date(this.slaTarget.getTime() - 24 * 60 * 60 * 1000)) return 'WARNING';
  return 'ON_TRACK';
});

// Instance methods
supportTicketSchema.methods.addMessage = function(senderId, message, isInternal = false, attachments = []) {
  this.messages.push({
    sender: senderId,
    message,
    isInternal,
    attachments,
    createdAt: new Date()
  });
  this.lastActivity = new Date();
  return this.save();
};

supportTicketSchema.methods.updateStatus = function(newStatus, userId) {
  this.status = newStatus;
  this.updatedAt = new Date();
  this.lastActivity = new Date();
  
  if (newStatus === 'RESOLVED') {
    this.resolvedAt = new Date();
  } else if (newStatus === 'CLOSED') {
    this.closedAt = new Date();
  }
  
  // Add internal note about status change
  this.messages.push({
    sender: userId,
    message: `Status changed to ${newStatus}`,
    isInternal: true,
    createdAt: new Date()
  });
  
  return this.save();
};

// Static methods
supportTicketSchema.statics.getTicketStats = async function() {
  const stats = await this.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        open: { $sum: { $cond: [{ $eq: ['$status', 'OPEN'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] } },
        closed: { $sum: { $cond: [{ $eq: ['$status', 'CLOSED'] }, 1, 0] } },
        urgent: { $sum: { $cond: [{ $in: ['$priority', ['URGENT', 'CRITICAL']] }, 1, 0] } }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    urgent: 0
  };
};

supportTicketSchema.statics.getTicketsByUser = async function(userId, filters = {}) {
  const query = { 
    $or: [{ createdBy: userId }, { assignedTo: userId }],
    isDeleted: false,
    ...filters
  };
  
  return this.find(query)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ lastActivity: -1 });
};

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
