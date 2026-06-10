const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    default: '00:00'
  },
  endDate: {
    type: Date
  },
  endTime: {
    type: String
  },
  type: {
    type: String,
    enum: ['DEADLINE', 'MILESTONE', 'MEETING', 'REMINDER', 'OTHER'],
    default: 'DEADLINE'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED'],
    default: 'UPCOMING'
  },
  location: {
    type: String,
    trim: true
  },
  attendees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    response: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'TENTATIVE'],
      default: 'PENDING'
    },
    responseDate: Date
  }],
  reminders: [{
    type: {
      type: String,
      enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'],
      default: 'IN_APP'
    },
    time: {
      type: String,
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }],
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
      default: 'WEEKLY'
    },
    interval: {
      type: Number,
      default: 1
    },
    endAfter: {
      type: Number // Number of occurrences
    },
    endDate: Date,
    daysOfWeek: [{
      type: Number, // 0-6 (Sunday-Saturday)
      min: 0,
      max: 6
    }],
    dayOfMonth: Number, // 1-31
    monthOfYear: Number // 1-12
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    path: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  comments: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  }],
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true
  },
  tenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender'
  },
  projectId: {
    type: String,
    trim: true
  },
  externalId: {
    type: String,
    trim: true
  },
  externalSource: {
    type: String,
    trim: true
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#3498db'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }, 
  collection: 'Calendar'
});

// Indexes for better performance
calendarEventSchema.index({ date: 1 });
calendarEventSchema.index({ status: 1 });
calendarEventSchema.index({ priority: 1 });
calendarEventSchema.index({ type: 1 });
calendarEventSchema.index({ createdBy: 1 });
calendarEventSchema.index({ tenderId: 1 });
calendarEventSchema.index({ 'attendees.userId': 1 });
calendarEventSchema.index({ tags: 1 });
calendarEventSchema.index({ category: 1 });

// Virtual for checking if event is overdue
calendarEventSchema.virtual('isOverdue').get(function() {
  if (this.status === 'COMPLETED' || this.status === 'CANCELLED') {
    return false;
  }
  const now = new Date();
  const eventDate = this.endDate || this.date;
  return eventDate < now;
});

// Virtual for getting event duration
calendarEventSchema.virtual('duration').get(function() {
  if (!this.endDate) return null;
  return this.endDate - this.date;
});

// Virtual for getting days until event
calendarEventSchema.virtual('daysUntil').get(function() {
  const now = new Date();
  const eventDate = this.date;
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware to update status based on date
calendarEventSchema.pre('save', function(next) {
  const now = new Date();
  
  // Auto-update status based on date
  if (this.status !== 'COMPLETED' && this.status !== 'CANCELLED') {
    if (this.date < now) {
      this.status = 'OVERDUE';
    } else if (this.status === 'OVERDUE' && this.date > now) {
      this.status = 'UPCOMING';
    }
  }
  
  // Update updatedAt
  this.updatedAt = new Date();
  
  next();
});

// Instance method to mark as complete
calendarEventSchema.methods.markComplete = function() {
  this.status = 'COMPLETED';
  return this.save();
};

// Instance method to add attendee
calendarEventSchema.methods.addAttendee = function(userId, name, email) {
  this.attendees.push({
    userId,
    name,
    email,
    response: 'PENDING'
  });
  return this.save();
};

// Instance method to update attendee response
calendarEventSchema.methods.updateAttendeeResponse = function(userId, response) {
  const attendee = this.attendees.find(a => a.userId.toString() === userId.toString());
  if (attendee) {
    attendee.response = response;
    attendee.responseDate = new Date();
  }
  return this.save();
};

// Instance method to add reminder
calendarEventSchema.methods.addReminder = function(type, time) {
  this.reminders.push({
    type,
    time,
    sent: false
  });
  return this.save();
};

// Static method to get upcoming events
calendarEventSchema.statics.getUpcomingEvents = function(days = 7) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);
  
  return this.find({
    date: { $gte: startDate, $lte: endDate },
    status: { $nin: ['COMPLETED', 'CANCELLED'] }
  }).sort({ date: 1 });
};

// Static method to get overdue events
calendarEventSchema.statics.getOverdueEvents = function() {
  return this.find({
    date: { $lt: new Date() },
    status: { $nin: ['COMPLETED', 'CANCELLED'] }
  }).sort({ date: 1 });
};

// Static method to get events by date range
calendarEventSchema.statics.getEventsByDateRange = function(startDate, endDate) {
  return this.find({
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
};

// Static method to get events by user
calendarEventSchema.statics.getEventsByUser = function(userId) {
  return this.find({
    $or: [
      { createdBy: userId },
      { 'attendees.userId': userId }
    ]
  }).sort({ date: 1 });
};

// Static method to get events by tender
calendarEventSchema.statics.getEventsByTender = function(tenderId) {
  return this.find({ tenderId }).sort({ date: 1 });
};

// Static method to get calendar statistics
calendarEventSchema.statics.getCalendarStats = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { createdBy: mongoose.Types.ObjectId(userId) },
          { 'attendees.userId': mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
