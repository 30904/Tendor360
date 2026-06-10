const mongoose = require('mongoose');

const tenderDiscoveryLogSchema = new mongoose.Schema(
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
    level: {
      type: String,
      enum: ['debug', 'info', 'warn', 'error'],
      default: 'info',
      index: true
    },
    message: { type: String, required: true, trim: true },
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true, collection: 'TenderDiscoveryLog' }
);

tenderDiscoveryLogSchema.index({ companyId: 1, jobId: 1, createdAt: -1 });

module.exports = mongoose.model('TenderDiscoveryLog', tenderDiscoveryLogSchema);
