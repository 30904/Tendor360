const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const certificateSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  certificateNumber: {
    type: String,
    required: [true, 'Certificate number is required'],
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Certificate name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: [
      'ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 27001', 'ISO 20000',
      'CE Marking', 'UL Listing', 'FDA Approval', 'FCC Certification',
      'RoHS Compliance', 'REACH Compliance', 'IATF 16949', 'AS9100',
      'OHSAS 18001', 'SOC 2', 'PCI DSS', 'HIPAA', 'GDPR', 'Other'
    ],
    required: [true, 'Certificate type is required']
  },
  category: {
    type: String,
    enum: [
      'Quality Management',
      'Environmental',
      'Health & Safety',
      'Information Security',
      'Product Safety',
      'Data Protection',
      'Financial',
      'Industry Specific',
      'Other'
    ],
    required: [true, 'Category is required']
  },
  issuingBody: {
    type: String,
    required: [true, 'Issuing body is required'],
    trim: true
  },
  issuingBodyContact: {
    name: String,
    email: String,
    phone: String,
    address: String,
    website: String
  },
  scope: {
    type: String,
    required: [true, 'Scope is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Suspended', 'Revoked', 'Pending Renewal', 'Under Review'],
    default: 'Active'
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  renewalDate: {
    type: Date
  },
  renewalRequired: {
    type: Boolean,
    default: true
  },
  renewalFrequency: {
    type: String,
    enum: ['Annually', 'Bi-annually', 'Tri-annually', 'Every 4 Years', 'Every 5 Years', 'As Required'],
    default: 'Annually'
  },
  renewalProcess: {
    type: String,
    enum: ['Automatic', 'Manual Application', 'Audit Required', 'Documentation Review', 'Full Assessment'],
    default: 'Manual Application'
  },
  cost: {
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'],
      default: 'USD'
    },
    renewalCost: {
      type: Number,
      min: 0
    }
  },
  requirements: [{
    requirement: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Non-compliant'],
      default: 'Not Started'
    },
    dueDate: {
      type: Date
    },
    completedDate: {
      type: Date
    },
    evidence: [{
      name: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  documents: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Certificate', 'Audit Report', 'Application Form', 'Supporting Document', 'Renewal Notice', 'Other'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  }],
  auditHistory: [{
    auditDate: {
      type: Date,
      required: true
    },
    auditor: {
      type: String,
      required: true
    },
    auditType: {
      type: String,
      enum: ['Initial', 'Surveillance', 'Recertification', 'Special', 'Follow-up'],
      required: true
    },
    result: {
      type: String,
      enum: ['Passed', 'Failed', 'Conditional Pass', 'Non-conformities Found'],
      required: true
    },
    findings: [{
      finding: String,
      severity: {
        type: String,
        enum: ['Minor', 'Major', 'Critical']
      },
      status: {
        type: String,
        enum: ['Open', 'Closed', 'In Progress']
      },
      correctiveAction: String,
      dueDate: Date,
      closedDate: Date
    }],
    reportUrl: String,
    nextAuditDate: Date
  }],
  notifications: [{
    type: {
      type: String,
      enum: ['Expiry Warning', 'Renewal Due', 'Audit Required', 'Document Missing', 'Status Change'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    sentTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
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
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'Certificate'
});

// Indexes for performance and search
certificateSchema.index({ companyId: 1, status: 1 });
certificateSchema.index({ companyId: 1, type: 1 });
certificateSchema.index({ companyId: 1, category: 1 });
certificateSchema.index({ companyId: 1, expiryDate: 1 });
certificateSchema.index({ companyId: 1, issuingBody: 1 });
certificateSchema.index({ companyId: 1, isDeleted: 1 });
certificateSchema.index({ certificateNumber: 1 });
certificateSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for days until expiry
certificateSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiryDate) return null;
  const now = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for isExpired
certificateSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return new Date() > new Date(this.expiryDate);
});

// Virtual for isExpiringSoon (within 90 days)
certificateSchema.virtual('isExpiringSoon').get(function() {
  if (!this.expiryDate) return false;
  const daysUntilExpiry = this.daysUntilExpiry;
  return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
});

// Virtual for compliance percentage
certificateSchema.virtual('compliancePercentage').get(function() {
  if (!this.requirements || this.requirements.length === 0) return 100;
  const completed = this.requirements.filter(req => req.status === 'Completed').length;
  return Math.round((completed / this.requirements.length) * 100);
});

certificateSchema.set('toJSON', { virtuals: true });
certificateSchema.set('toObject', { virtuals: true });

certificateSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Certificate', certificateSchema);
