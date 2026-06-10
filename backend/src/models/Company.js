const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // Basic Company Information
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 10
  },
  
  // Company Details
  description: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    default: 'OTHER'
  },
  companySize: {
    type: String,
    enum: ['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE'],
    default: 'MEDIUM'
  },
  /** buyer = issuing org (default); supplier = participant / respondent org */
  organizationKind: {
    type: String,
    enum: ['buyer', 'supplier'],
    default: 'buyer',
    index: true
  },
  
  // Contact Information
  contact: {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: 'India'
      },
      postalCode: String
    }
  },
  
  // Company Branding
  branding: {
    logo: String,
    primaryColor: {
      type: String,
      default: '#4678be'
    },
    secondaryColor: {
      type: String,
      default: '#2b3a4a'
    },
    favicon: String,
    customDomain: String
  },
  
  // Subscription & Billing
  subscription: {
    plan: {
      type: String,
      enum: ['FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE'],
      default: 'FREE'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'CANCELLED', 'TRIAL'],
      default: 'ACTIVE'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    maxUsers: {
      type: Number,
      default: 5
    },
    maxTenders: {
      type: Number,
      default: 100
    },
    maxStorage: {
      type: Number, // in MB
      default: 1000
    }
  },
  
  // Company Settings
  settings: {
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    dateFormat: {
      type: String,
      default: 'DD/MM/YYYY'
    },
    currency: {
      type: String,
      default: 'INR'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    features: {
      aiExtraction: { type: Boolean, default: true },
      advancedAnalytics: { type: Boolean, default: false },
      customReports: { type: Boolean, default: false },
      apiAccess: { type: Boolean, default: false },
      whiteLabel: { type: Boolean, default: false }
    },
    discovery: {
      keywordFilePath: String,
      keywordFileName: String
    }
  },
  
  // Company Status
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'],
    default: 'ACTIVE'
  },
  
  // Admin Information
  admin: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String
  },
  
  // Metadata
  metadata: {
    foundedYear: Number,
    registrationNumber: String,
    taxId: String,
    legalEntityType: {
      type: String,
      enum: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'LLP', 'PARTNERSHIP', 'SOLE_PROPRIETORSHIP', 'OTHER'],
      default: 'PRIVATE_LIMITED'
    },
    compliance: {
      gstRegistered: { type: Boolean, default: false },
      gstNumber: String,
      panNumber: String,
      udyamNumber: String
    }
  },
  
  // Audit Fields
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'Company'
});

// Indexes for performance
companySchema.index({ code: 1 }, { unique: true });
companySchema.index({ name: 1 }, { unique: true });
companySchema.index({ 'contact.email': 1 });
companySchema.index({ status: 1 });
companySchema.index({ isDeleted: 1 });
companySchema.index({ 'subscription.plan': 1 });
companySchema.index({ 'subscription.status': 1 });

// Virtual for full address
companySchema.virtual('fullAddress').get(function() {
  const addr = this.contact.address;
  if (!addr) return '';
  
  const parts = [addr.street, addr.city, addr.state, addr.country, addr.postalCode];
  return parts.filter(part => part && part.trim()).join(', ');
});

// Virtual for subscription status
companySchema.virtual('isSubscriptionActive').get(function() {
  const now = new Date();
  return this.subscription.status === 'ACTIVE' && 
         (!this.subscription.endDate || this.subscription.endDate > now);
});

// Pre-save middleware
companySchema.pre('save', function(next) {
  // Generate code from name if not provided
  if (!this.code && this.name) {
    this.code = this.name
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 10)
      .toUpperCase();
  }
  
  // Set display name if not provided
  if (!this.displayName) {
    this.displayName = this.name;
  }
  
  next();
});

// Soft delete middleware
companySchema.pre('find', function() {
  if (this.getQuery().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
});

companySchema.pre('findOne', function() {
  if (this.getQuery().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
});

// Instance methods
companySchema.methods.softDelete = function(deletedBy) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

companySchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  return this.save();
};

companySchema.methods.updateSubscription = function(plan, endDate) {
  this.subscription.plan = plan;
  this.subscription.endDate = endDate;
  this.subscription.status = 'ACTIVE';
  return this.save();
};

// Static methods
companySchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase(), isDeleted: false });
};

companySchema.statics.findActiveCompanies = function() {
  return this.find({ 
    status: 'ACTIVE', 
    isDeleted: false,
    'subscription.status': 'ACTIVE'
  });
};

module.exports = mongoose.model('Company', companySchema);
