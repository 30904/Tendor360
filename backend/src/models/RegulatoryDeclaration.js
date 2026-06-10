const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const regulatoryDeclarationSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Declaration title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: [
      'Regulatory Declaration',
      'Conflict of Interest',
      'Sanctions Compliance',
      'Export Control',
      'Data Processing (GDPR)',
      'Vendor Pre-qualification',
      'Certificate Management',
      'Compliance Audit',
      'Risk Assessment'
    ],
    required: [true, 'Declaration type is required']
  },
  category: {
    type: String,
    enum: [
      'Regulatory',
      'Legal',
      'Financial',
      'Technical',
      'Environmental',
      'Health & Safety',
      'Data Protection',
      'Quality Management',
      'Security'
    ],
    required: [true, 'Category is required']
  },
  status: {
    type: String,
    enum: ['Draft', 'Under Review', 'Approved', 'Rejected', 'Expired', 'Archived'],
    default: 'Draft'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  jurisdiction: {
    type: String,
    required: [true, 'Jurisdiction is required'],
    trim: true
  },
  regulatoryBody: {
    type: String,
    required: [true, 'Regulatory body is required'],
    trim: true
  },
  applicableRegulations: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    version: {
      type: String,
      trim: true
    },
    effectiveDate: {
      type: Date
    },
    expiryDate: {
      type: Date
    }
  }],
  submissionDate: {
    type: Date
  },
  approvalDate: {
    type: Date
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  renewalRequired: {
    type: Boolean,
    default: false
  },
  renewalFrequency: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Annually', 'Bi-annually', 'As Required'],
    default: 'Annually'
  },
  complianceRequirements: [{
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
  riskAssessment: {
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    riskFactors: [{
      factor: String,
      impact: String,
      probability: String,
      mitigation: String
    }],
    lastAssessed: {
      type: Date,
      default: Date.now
    }
  },
  stakeholders: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    email: String,
    phone: String,
    department: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Declaration Form', 'Supporting Document', 'Certificate', 'Audit Report', 'Policy Document', 'Other'],
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
  auditTrail: [{
    action: {
      type: String,
      required: true
    },
    description: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    performedAt: {
      type: Date,
      default: Date.now
    },
    previousValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed
  }],
  notifications: [{
    type: {
      type: String,
      enum: ['Expiry Warning', 'Renewal Due', 'Compliance Alert', 'Audit Required', 'Document Missing'],
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
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'RegulatoryDeclaration'
});

// Indexes for performance and search
regulatoryDeclarationSchema.index({ companyId: 1, status: 1 });
regulatoryDeclarationSchema.index({ companyId: 1, type: 1 });
regulatoryDeclarationSchema.index({ companyId: 1, category: 1 });
regulatoryDeclarationSchema.index({ companyId: 1, priority: 1 });
regulatoryDeclarationSchema.index({ companyId: 1, expiryDate: 1 });
regulatoryDeclarationSchema.index({ companyId: 1, jurisdiction: 1 });
regulatoryDeclarationSchema.index({ companyId: 1, isDeleted: 1 });
regulatoryDeclarationSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for days until expiry
regulatoryDeclarationSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiryDate) return null;
  const now = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for isExpired
regulatoryDeclarationSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return new Date() > new Date(this.expiryDate);
});

// Virtual for isExpiringSoon (within 30 days)
regulatoryDeclarationSchema.virtual('isExpiringSoon').get(function() {
  if (!this.expiryDate) return false;
  const daysUntilExpiry = this.daysUntilExpiry;
  return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
});

// Virtual for compliance percentage
regulatoryDeclarationSchema.virtual('compliancePercentage').get(function() {
  if (!this.complianceRequirements || this.complianceRequirements.length === 0) return 100;
  const completed = this.complianceRequirements.filter(req => req.status === 'Completed').length;
  return Math.round((completed / this.complianceRequirements.length) * 100);
});

regulatoryDeclarationSchema.set('toJSON', { virtuals: true });
regulatoryDeclarationSchema.set('toObject', { virtuals: true });

regulatoryDeclarationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('RegulatoryDeclaration', regulatoryDeclarationSchema);
