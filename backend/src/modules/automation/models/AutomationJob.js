const mongoose = require('mongoose');

const automationJobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    jobType: {
      type: String,
      enum: [
        'discovery_sync',
        'document_extraction',
        'scoring_refresh',
        'retry_queue',
        'email_outlook_scan',
        'outlook_auth'
      ],
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['queued', 'running', 'completed', 'failed', 'retrying'],
      default: 'queued',
      index: true
    },
    payload: mongoose.Schema.Types.Mixed,
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    scheduledAt: { type: Date, default: Date.now, index: true },
    startedAt: Date,
    completedAt: Date,
    errorMessage: String
  },
  { timestamps: true, collection: 'AutomationJob' }
);

automationJobSchema.index({ companyId: 1, status: 1, scheduledAt: 1 });

module.exports = mongoose.model('AutomationJob', automationJobSchema);
