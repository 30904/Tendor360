const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const vendorSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  vendorId: {
    type: String,
    required: [true, 'Vendor ID is required'],
    trim: true,
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  legalName: {
    type: String,
    trim: true,
    maxlength: [200, 'Legal name cannot exceed 200 characters']
  },
  businessType: {
    type: String,
    enum: [
      'Corporation',
      'Partnership',
      'Sole Proprietorship',
      'LLC',
      'Non-Profit',
      'Government Entity',
      'Other'
    ],
    required: [true, 'Business type is required']
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  category: {
    type: String,
    enum: [
      'Goods Supplier',
      'Service Provider',
      'Consultant',
      'Contractor',
      'Technology Provider',
      'Professional Services',
      'Manufacturing',
      'Distribution',
      'Other'
    ],
    required: [true, 'Category is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Suspended', 'Blacklisted', 'Under Review'],
    default: 'Pending'
  },
  preQualificationStatus: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Expired', 'Under Review'],
    default: 'Not Started'
  },
  preQualificationDate: {
    type: Date
  },
  preQualificationExpiry: {
    type: Date
  },
  contactInformation: {
    primaryContact: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      title: String,
      email: {
        type: String,
        required: true,
        trim: true
      },
      phone: {
        type: String,
        required: true,
        trim: true
      },
      mobile: String
    },
    billingContact: {
      name: String,
      title: String,
      email: String,
      phone: String
    },
    technicalContact: {
      name: String,
      title: String,
      email: String,
      phone: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: {
        type: String,
        required: true,
        trim: true
      }
    }
  },
  businessInformation: {
    registrationNumber: String,
    taxId: String,
    dunsNumber: String,
    website: String,
    establishedYear: Number,
    numberOfEmployees: {
      min: Number,
      max: Number
    },
    annualRevenue: {
      amount: Number,
      currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'],
        default: 'USD'
      }
    },
    ownership: {
      type: String,
      enum: ['Public', 'Private', 'Government', 'Non-Profit', 'Other']
    }
  },
  capabilities: [{
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    experience: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    yearsOfExperience: Number,
    references: [{
      clientName: String,
      projectDescription: String,
      projectValue: Number,
      projectDuration: String,
      contactPerson: String,
      contactEmail: String,
      contactPhone: String
    }]
  }],
  certifications: [{
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate'
    },
    name: String,
    issuingBody: String,
    issueDate: Date,
    expiryDate: Date,
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Pending']
    }
  }],
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
      enum: ['Not Started', 'In Progress', 'Completed', 'Non-compliant', 'Not Applicable'],
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
    }],
    isRequired: {
      type: Boolean,
      default: true
    }
  }],
  financialInformation: {
    creditRating: String,
    bankReferences: [{
      bankName: String,
      contactPerson: String,
      contactEmail: String,
      contactPhone: String
    }],
    insurance: {
      generalLiability: {
        amount: Number,
        currency: String,
        expiryDate: Date,
        provider: String
      },
      professionalLiability: {
        amount: Number,
        currency: String,
        expiryDate: Date,
        provider: String
      },
      workersCompensation: {
        amount: Number,
        currency: String,
        expiryDate: Date,
        provider: String
      }
    }
  },
  performanceMetrics: {
    onTimeDelivery: {
      type: Number,
      min: 0,
      max: 100
    },
    qualityRating: {
      type: Number,
      min: 1,
      max: 5
    },
    costCompetitiveness: {
      type: Number,
      min: 1,
      max: 5
    },
    communicationRating: {
      type: Number,
      min: 1,
      max: 5
    },
    overallRating: {
      type: Number,
      min: 1,
      max: 5
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
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
  documents: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        'Registration Form',
        'Financial Statement',
        'Insurance Certificate',
        'Tax Certificate',
        'Business License',
        'Quality Certificate',
        'Reference Letter',
        'Other'
      ],
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
      enum: ['Status Change', 'Document Required', 'Certification Expiry', 'Performance Review', 'Compliance Alert'],
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
  collection: 'Vendor'
});

// Indexes for performance and search
vendorSchema.index({ companyId: 1, status: 1 });
vendorSchema.index({ companyId: 1, category: 1 });
vendorSchema.index({ companyId: 1, industry: 1 });
vendorSchema.index({ companyId: 1, preQualificationStatus: 1 });
vendorSchema.index({ companyId: 1, isDeleted: 1 });
vendorSchema.index({ vendorId: 1 });
vendorSchema.index({ companyName: 'text', legalName: 'text', tags: 'text' });

// Virtual for days until pre-qualification expiry
vendorSchema.virtual('daysUntilPreQualExpiry').get(function() {
  if (!this.preQualificationExpiry) return null;
  const now = new Date();
  const expiry = new Date(this.preQualificationExpiry);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for isPreQualExpired
vendorSchema.virtual('isPreQualExpired').get(function() {
  if (!this.preQualificationExpiry) return false;
  return new Date() > new Date(this.preQualificationExpiry);
});

// Virtual for isPreQualExpiringSoon (within 30 days)
vendorSchema.virtual('isPreQualExpiringSoon').get(function() {
  if (!this.preQualificationExpiry) return false;
  const daysUntilExpiry = this.daysUntilPreQualExpiry;
  return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
});

// Virtual for compliance percentage
vendorSchema.virtual('compliancePercentage').get(function() {
  if (!this.complianceRequirements || this.complianceRequirements.length === 0) return 100;
  const completed = this.complianceRequirements.filter(req => req.status === 'Completed').length;
  return Math.round((completed / this.complianceRequirements.length) * 100);
});

vendorSchema.set('toJSON', { virtuals: true });
vendorSchema.set('toObject', { virtuals: true });

vendorSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Vendor', vendorSchema);
