const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const competitorSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Competitor name is required'],
    trim: true,
    maxlength: [200, 'Competitor name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/, 'Please use a valid URL']
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  size: {
    type: String,
    enum: ['Startup', 'Small', 'Medium', 'Large', 'Enterprise', 'Unknown'],
    default: 'Unknown'
  },
  location: {
    country: {
      type: String,
      trim: true
    },
    region: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    }
  },
  contactInfo: {
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  financialInfo: {
    revenue: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']
    },
    employees: {
      type: Number,
      min: 0
    },
    foundedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear()
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
      trim: true
    },
    strength: {
      type: String,
      enum: ['Weak', 'Medium', 'Strong', 'Unknown'],
      default: 'Unknown'
    }
  }],
  marketPosition: {
    type: String,
    enum: ['Leader', 'Challenger', 'Follower', 'Niche', 'Unknown'],
    default: 'Unknown'
  },
  threatLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  winRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalTenders: {
    type: Number,
    default: 0,
    min: 0
  },
  wonTenders: {
    type: Number,
    default: 0,
    min: 0
  },
  lostTenders: {
    type: Number,
    default: 0,
    min: 0
  },
  averageBidValue: {
    type: Number,
    min: 0,
    default: 0
  },
  averageWinValue: {
    type: Number,
    min: 0,
    default: 0
  },
  strengths: [{
    type: String,
    trim: true
  }],
  weaknesses: [{
    type: String,
    trim: true
  }],
  opportunities: [{
    type: String,
    trim: true
  }],
  threats: [{
    type: String,
    trim: true
  }],
  recentActivity: [{
    type: {
      type: String,
      enum: ['Tender Win', 'Tender Loss', 'New Capability', 'Partnership', 'Acquisition', 'Other'],
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    value: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    source: {
      type: String,
      trim: true
    }
  }],
  intelligence: {
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    sources: [{
      type: String,
      trim: true
    }],
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    notes: [{
      content: {
        type: String,
        required: true,
        trim: true
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'Competitor'
});

// Indexes for better search performance
competitorSchema.index({ companyId: 1, name: 1 }, { unique: true, partialFilterExpression: { isActive: true } });
competitorSchema.index({ companyId: 1, industry: 1 });
competitorSchema.index({ companyId: 1, threatLevel: -1 });
competitorSchema.index({ companyId: 1, marketPosition: 1 });
competitorSchema.index({ companyId: 1, winRate: -1 });
competitorSchema.index({ companyId: 1, 'location.country': 1 });
competitorSchema.index({ companyId: 1, isActive: 1 });
competitorSchema.index({ name: 'text', description: 'text', industry: 'text' });

// Add pagination plugin
competitorSchema.plugin(mongoosePaginate);

// Virtual for win rate calculation
competitorSchema.virtual('calculatedWinRate').get(function() {
  if (this.totalTenders === 0) return 0;
  return Math.round((this.wonTenders / this.totalTenders) * 100);
});

// Virtual for threat assessment
competitorSchema.virtual('threatAssessment').get(function() {
  const winRate = this.calculatedWinRate;
  const totalTenders = this.totalTenders;
  
  if (winRate >= 80 && totalTenders >= 10) return 'Critical';
  if (winRate >= 60 && totalTenders >= 5) return 'High';
  if (winRate >= 40 || totalTenders >= 3) return 'Medium';
  return 'Low';
});

// Ensure virtuals are included in JSON output
competitorSchema.set('toJSON', { virtuals: true });
competitorSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update calculated fields
competitorSchema.pre('save', function(next) {
  // Update win rate if not manually set
  if (this.totalTenders > 0) {
    this.winRate = this.calculatedWinRate;
  }
  
  // Update threat level based on performance
  this.threatLevel = this.threatAssessment;
  
  next();
});

module.exports = mongoose.model('Competitor', competitorSchema);
