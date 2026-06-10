const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  
  answer: {
    type: String,
    required: true,
    trim: true,
    maxlength: [2000, 'Answer cannot exceed 2000 characters']
  },
  
  category: {
    type: String,
    required: true,
    enum: ['GENERAL', 'TECHNICAL', 'BILLING', 'FEATURES', 'TRAINING', 'INTEGRATION', 'TROUBLESHOOTING'],
    default: 'GENERAL'
  },
  
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters']
  },
  
  tags: [String],
  
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  
  isPublished: {
    type: Boolean,
    default: true
  },
  
  viewCount: {
    type: Number,
    default: 0
  },
  
  helpfulCount: {
    type: Number,
    default: 0
  },
  
  notHelpfulCount: {
    type: Number,
    default: 0
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'FAQ'
});

// Indexes
faqSchema.index({ category: 1, subcategory: 1 });
faqSchema.index({ tags: 1 });
faqSchema.index({ isPublished: 1, isDeleted: 1 });
faqSchema.index({ priority: -1, viewCount: -1 });

// Instance methods
faqSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

faqSchema.methods.markHelpful = function() {
  this.helpfulCount += 1;
  return this.save();
};

faqSchema.methods.markNotHelpful = function() {
  this.notHelpfulCount += 1;
  return this.save();
};

// Static methods
faqSchema.statics.getByCategory = async function(category, subcategory = null) {
  const query = { 
    category, 
    isPublished: true, 
    isDeleted: false 
  };
  
  if (subcategory) {
    query.subcategory = subcategory;
  }
  
  return this.find(query)
    .sort({ priority: -1, viewCount: -1 })
    .populate('createdBy', 'name');
};

faqSchema.statics.search = async function(searchTerm) {
  const regex = new RegExp(searchTerm, 'i');
  
  return this.find({
    $or: [
      { question: regex },
      { answer: regex },
      { tags: regex }
    ],
    isPublished: true,
    isDeleted: false
  })
  .sort({ priority: -1, viewCount: -1 })
  .populate('createdBy', 'name');
};

faqSchema.statics.getPopular = async function(limit = 10) {
  return this.find({
    isPublished: true,
    isDeleted: false
  })
  .sort({ viewCount: -1, helpfulCount: -1 })
  .limit(limit)
  .populate('createdBy', 'name');
};

module.exports = mongoose.model('FAQ', faqSchema);
