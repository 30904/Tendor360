const mongoose = require('mongoose');

const decisionHistorySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GoNoGoReview',
      required: true,
      index: true
    },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: ['submitted', 'commented', 'approved', 'rejected', 'deferred'],
      required: true
    },
    comment: { type: String, trim: true },
    decision: {
      type: String,
      enum: ['go', 'conditional_go', 'no_go', 'defer']
    }
  },
  { timestamps: true, collection: 'DecisionHistory' }
);

module.exports = mongoose.model('DecisionHistory', decisionHistorySchema);
