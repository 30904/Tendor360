const mongoose = require('mongoose');

const automationLogSchema = new mongoose.Schema(
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
      required: true,
      index: true
    },
    level: {
      type: String,
      enum: ['debug', 'info', 'warn', 'error'],
      default: 'info'
    },
    message: { type: String, required: true, trim: true },
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true, collection: 'AutomationLog' }
);

module.exports = mongoose.model('AutomationLog', automationLogSchema);
