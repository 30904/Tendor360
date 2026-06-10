const mongoose = require('mongoose');

const emailTenderMailboxSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    region: {
      type: String,
      enum: ['US', 'AT', 'GLOBAL'],
      default: 'US',
      index: true
    },
    displayName: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    graphUserId: { type: String, trim: true },
    folderInbox: { type: String, default: 'Inbox' },
    folderRejected: { type: String, default: 'Rejected Tenders' },
    folderProcessed: { type: String, default: 'Processed Tenders' },
    forwardTo: [{ type: String, trim: true, lowercase: true }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'error'],
      default: 'active'
    },
    lastScanAt: Date,
    notifyOnFailure: [{ type: String, trim: true, lowercase: true }],
    authRetry: {
      attempts: { type: Number, default: 0 },
      maxAttempts: { type: Number, default: 3 },
      lastError: String,
      lastAttemptAt: Date,
      status: {
        type: String,
        enum: ['ok', 'retrying', 'failed', 'unknown'],
        default: 'unknown'
      }
    },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'EmailTenderMailbox' }
);

emailTenderMailboxSchema.index({ companyId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('EmailTenderMailbox', emailTenderMailboxSchema);
