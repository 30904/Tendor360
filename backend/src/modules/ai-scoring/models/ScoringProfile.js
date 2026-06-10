const mongoose = require('mongoose');

const scoringProfileSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
    thresholds: {
      pursue: { type: Number, default: 75 },
      review: { type: Number, default: 55 },
      decline: { type: Number, default: 35 }
    },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'ScoringProfile' }
);

scoringProfileSchema.index({ companyId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('ScoringProfile', scoringProfileSchema);
