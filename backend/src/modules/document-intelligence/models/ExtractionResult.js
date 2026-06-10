const mongoose = require('mongoose');

const extractionResultSchema = new mongoose.Schema(
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
    fieldKey: { type: String, required: true, trim: true },
    fieldValue: mongoose.Schema.Types.Mixed,
    confidence: { type: Number, min: 0, max: 100, default: 0 },
    validated: { type: Boolean, default: false },
    sourceSpan: {
      page: Number,
      start: Number,
      end: Number
    }
  },
  { timestamps: true, collection: 'ExtractionResult' }
);

module.exports = mongoose.model('ExtractionResult', extractionResultSchema);
