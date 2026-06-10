const mongoose = require('mongoose');

const clauseExtractionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    extractionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentExtraction',
      required: true,
      index: true
    },
    clauseType: { type: String, trim: true, index: true },
    text: { type: String, required: true },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    confidence: { type: Number, min: 0, max: 100, default: 0 }
  },
  { timestamps: true, collection: 'ClauseExtraction' }
);

module.exports = mongoose.model('ClauseExtraction', clauseExtractionSchema);
