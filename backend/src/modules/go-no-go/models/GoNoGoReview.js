const mongoose = require('mongoose');

const goNoGoReviewSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    tenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tender',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['draft', 'in_review', 'approved', 'rejected'],
      default: 'draft',
      index: true
    },
    recommendation: {
      type: String,
      enum: ['go', 'conditional_go', 'no_go', 'defer'],
      default: 'defer'
    },
    aiRecommendation: {
      type: String,
      enum: ['go', 'conditional_go', 'no_go', 'defer']
    },
    summary: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'GoNoGoReview' }
);

goNoGoReviewSchema.index({ companyId: 1, tenderId: 1 }, { unique: true });

module.exports = mongoose.model('GoNoGoReview', goNoGoReviewSchema);
