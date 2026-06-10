const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  tenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender',
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    cost: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    margin: {
      type: Number,
      min: 0
    }
  }],
  totals: {
    cost: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0
    },
    margin: {
      type: Number,
      default: 0
    },
    marginPercentage: {
      type: Number,
      default: 0
    }
  },
  winProbability: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  currency: {
    type: String,
    default: 'USD'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'Pricing'
});

// Indexes
pricingSchema.index({ tenderId: 1 });
pricingSchema.index({ createdBy: 1 });
pricingSchema.index({ isDeleted: 1 });

// Calculate totals before saving
pricingSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totals.cost = this.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
    this.totals.price = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.totals.margin = this.totals.price - this.totals.cost;
    this.totals.marginPercentage = this.totals.cost > 0 ? (this.totals.margin / this.totals.cost) * 100 : 0;
  }
  next();
});

// Filter out deleted pricing by default
pricingSchema.pre(/^find/, function(next) {
  if (this.getQuery().isDeleted !== true) {
    this.where({ isDeleted: false });
  }
  next();
});

module.exports = mongoose.model('Pricing', pricingSchema);
