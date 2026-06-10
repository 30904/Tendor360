const mongoose = require('mongoose');

const scoringRuleSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScoringProfile',
      required: true,
      index: true
    },
    name: { type: String, required: true, trim: true },
    dimension: {
      type: String,
      enum: ['relevancy', 'product_fit', 'customer_fit', 'strategic', 'risk', 'confidence'],
      required: true
    },
    weight: { type: Number, min: 0, max: 100, default: 10 },
    expression: { type: String, trim: true },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'ScoringRule' }
);

scoringRuleSchema.index({ companyId: 1, profileId: 1, dimension: 1 });

module.exports = mongoose.model('ScoringRule', scoringRuleSchema);
