const mongoose = require('mongoose');

const documentExtractionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true
    },
    tenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', index: true },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
      index: true
    },
    pipeline: {
      type: String,
      enum: ['ocr', 'metadata', 'clause', 'pricing', 'commercial', 'terms', 'contact', 'timeline', 'full'],
      default: 'metadata'
    },
    startedAt: Date,
    completedAt: Date,
    errorMessage: String
  },
  { timestamps: true, collection: 'DocumentExtraction' }
);

documentExtractionSchema.index({ companyId: 1, documentId: 1, pipeline: 1 });

module.exports = mongoose.model('DocumentExtraction', documentExtractionSchema);
