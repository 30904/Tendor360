const mongoose = require('mongoose');

const automationFailureSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AutomationJob',
      index: true
    },
    requirementId: { type: String, trim: true, index: true },
    source: {
      type: String,
      enum: ['automation_job', 'outlook_graph', 'email_scan', 'discovery', 'demo'],
      default: 'automation_job'
    },
    errorMessage: { type: String, required: true },
    stack: String,
    retryable: { type: Boolean, default: true },
    screenshotPath: String,
    screenshotUrl: String,
    notificationSentAt: Date,
    notificationRecipients: [String],
    context: mongoose.Schema.Types.Mixed,
    resolvedAt: Date
  },
  { timestamps: true, collection: 'AutomationFailure' }
);

module.exports = mongoose.model('AutomationFailure', automationFailureSchema);
