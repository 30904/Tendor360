const mongoose = require('mongoose');

const tenderImportBatchSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TenderDiscoveryJob',
      required: true,
      index: true
    },
    connectorType: {
      type: String,
      enum: ['govwin', 'sam_gov', 'email', 'manual'],
      required: true
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
      index: true
    },
    recordsProcessed: { type: Number, default: 0 },
    recordsImported: { type: Number, default: 0 },
    recordsNew: { type: Number, default: 0 },
    recordsUpdated: { type: Number, default: 0 },
    duplicatesSkipped: { type: Number, default: 0 },
    attachmentsDownloaded: { type: Number, default: 0 },
    attachmentsFailed: { type: Number, default: 0 },
    samFallbackUsed: { type: Boolean, default: false },
    lookbackHours: { type: Number, default: 24 },
    failures: { type: Number, default: 0 },
    externalReferenceKeys: [{ type: String, trim: true }],
    completedAt: Date,
    errorMessage: String
  },
  { timestamps: true, collection: 'TenderImportBatch' }
);

tenderImportBatchSchema.index({ companyId: 1, createdAt: -1 });

module.exports = mongoose.model('TenderImportBatch', tenderImportBatchSchema);
