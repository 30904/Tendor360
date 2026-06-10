const mongoose = require('mongoose');

const tenderDiscoveryJobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TenderSource',
      index: true
    },
    connectorType: {
      type: String,
      enum: ['govwin', 'sam_gov', 'email', 'manual'],
      required: true,
      index: true
    },
    trigger: {
      type: String,
      enum: ['scheduled', 'manual', 'webhook', 'retry'],
      default: 'manual'
    },
    status: {
      type: String,
      enum: ['queued', 'running', 'completed', 'failed', 'cancelled'],
      default: 'queued',
      index: true
    },
    scheduledAt: { type: Date, default: Date.now, index: true },
    startedAt: Date,
    completedAt: Date,
    incrementalCursor: { type: String, trim: true },
    payload: mongoose.Schema.Types.Mixed,
    stats: {
      discovered: { type: Number, default: 0 },
      imported: { type: Number, default: 0 },
      new: { type: Number, default: 0 },
      updated: { type: Number, default: 0 },
      duplicates: { type: Number, default: 0 },
      attachmentsDownloaded: { type: Number, default: 0 },
      attachmentsFailed: { type: Number, default: 0 },
      samFallbackUsed: { type: Number, default: 0 },
      failed: { type: Number, default: 0 }
    },
    lookbackHours: { type: Number, default: 24 },
    errorMessage: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'TenderDiscoveryJob' }
);

tenderDiscoveryJobSchema.index({ companyId: 1, status: 1, scheduledAt: -1 });

module.exports = mongoose.model('TenderDiscoveryJob', tenderDiscoveryJobSchema);
