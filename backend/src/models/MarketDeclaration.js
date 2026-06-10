const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const marketDeclarationSchema = new mongoose.Schema({
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
    enum: ['Market Analysis', 'Market Outlook', 'Intelligence Report', 'Industry Report', 'Trend Analysis'],
    required: [true, 'Declaration type is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: ['Infrastructure', 'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Energy', 'Transportation', 'Education', 'Government', 'Other']
  },
  status: {
    type: String,
    enum: ['Draft', 'Review', 'Published', 'Archived'],
    default: 'Draft'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  publishDate: {
    type: Date
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  marketSize: {
    type: Number,
    min: [0, 'Market size cannot be negative'],
    required: [true, 'Market size is required']
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'],
    default: 'USD'
  },
  growthRate: {
    type: Number,
    min: [-100, 'Growth rate cannot be less than -100%'],
    max: [1000, 'Growth rate cannot exceed 1000%'],
    required: [true, 'Growth rate is required']
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  aiInsights: {
    type: String,
    trim: true,
    maxlength: [1000, 'AI insights cannot exceed 1000 characters']
  },
  aiConfidence: {
    type: Number,
    min: [0, 'AI confidence cannot be less than 0%'],
    max: [100, 'AI confidence cannot exceed 100%'],
    default: 0
  },
  keyTrends: [{
    type: String,
    trim: true,
    maxlength: [200, 'Trend description cannot exceed 200 characters']
  }],
  opportunities: [{
    type: String,
    trim: true,
    maxlength: [200, 'Opportunity description cannot exceed 200 characters']
  }],
  threats: [{
    type: String,
    trim: true,
    maxlength: [200, 'Threat description cannot exceed 200 characters']
  }],
  targetRegions: [{
    type: String,
    trim: true
  }],
  targetSectors: [{
    type: String,
    trim: true
  }],
  keywords: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  coAuthors: [{
    type: String,
    trim: true
  }],
  reviewers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    comments: {
      type: String,
      trim: true
    },
    reviewedAt: {
      type: Date
    }
  }],
  attachments: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number
    },
    type: {
      type: String
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  analytics: {
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0
    },
    shares: {
      type: Number,
      default: 0,
      min: 0
    },
    lastViewed: {
      type: Date
    }
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    version: Number,
    title: String,
    description: String,
    content: String,
    updatedAt: Date,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  isFeatured: {
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
  collection: 'MarketDeclaration'
});

// Indexes for performance and search
marketDeclarationSchema.index({ companyId: 1, status: 1 });
marketDeclarationSchema.index({ companyId: 1, category: 1 });
marketDeclarationSchema.index({ companyId: 1, type: 1 });
marketDeclarationSchema.index({ companyId: 1, priority: 1 });
marketDeclarationSchema.index({ companyId: 1, publishDate: -1 });
marketDeclarationSchema.index({ companyId: 1, expiryDate: 1 });
marketDeclarationSchema.index({ companyId: 1, isDeleted: 1 });
marketDeclarationSchema.index({ title: 'text', description: 'text', keywords: 'text' });

// Virtual for days until expiry
marketDeclarationSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiryDate) return null;
  const now = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for isExpired
marketDeclarationSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return new Date() > new Date(this.expiryDate);
});

// Virtual for isExpiringSoon (within 30 days)
marketDeclarationSchema.virtual('isExpiringSoon').get(function() {
  if (!this.expiryDate) return false;
  const daysUntilExpiry = this.daysUntilExpiry;
  return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
});

marketDeclarationSchema.set('toJSON', { virtuals: true });
marketDeclarationSchema.set('toObject', { virtuals: true });

marketDeclarationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('MarketDeclaration', marketDeclarationSchema);
