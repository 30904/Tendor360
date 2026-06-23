const mongoose = require('mongoose');

const opportunityScoreSchema = new mongoose.Schema(
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
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScoringProfile',
      required: true
    },
    dimensions: {
      relevancy: { type: Number, min: 0, max: 100, default: 0 },
      product_fit: { type: Number, min: 0, max: 100, default: 0 },
      customer_fit: { type: Number, min: 0, max: 100, default: 0 },
      strategic: { type: Number, min: 0, max: 100, default: 0 },
      risk: { type: Number, min: 0, max: 100, default: 0 },
      confidence: { type: Number, min: 0, max: 100, default: 0 }
    },
    compositeScore: { type: Number, min: 0, max: 100, default: 0 },
    recommendation: {
      type: String,
      enum: ['pursue', 'review', 'decline'],
      default: 'review'
    },
    rationale: { type: String, trim: true },
    modelProvider: { type: String, trim: true },
    /**
     * Tracks how the score was actually produced:
     *   'ai'          — real AI provider ran successfully
     *   'heuristic'   — no AI key configured; heuristic was the intended provider
     *   'ai_fallback' — AI key was present but the API call failed; heuristic stepped in
     */
    scoringMethod: {
      type: String,
      enum: ['ai', 'heuristic', 'ai_fallback'],
      default: 'heuristic'
    },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'OpportunityScore' }
);

opportunityScoreSchema.index({ companyId: 1, tenderId: 1 }, { unique: true });

module.exports = mongoose.model('OpportunityScore', opportunityScoreSchema);
