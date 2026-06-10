const mongoose = require('mongoose');

const linkSectionSchema = new mongoose.Schema(
  {
    url: String,
    label: String,
    retained: Boolean,
    rejectReason: String,
    keywordHits: [String]
  },
  { _id: false }
);

const emailTenderMessageSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    mailboxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmailTenderMailbox',
      required: true,
      index: true
    },
    graphMessageId: { type: String, trim: true, index: true },
    subject: { type: String, trim: true },
    from: { type: String, trim: true },
    receivedAt: { type: Date, default: Date.now, index: true },
    bodyText: { type: String },
    bodyPreview: { type: String },
    hasLinks: { type: Boolean, default: false },
    links: [{ type: String }],
    linkSections: [linkSectionSchema],
    attachments: [
      {
        name: String,
        contentType: String,
        size: Number,
        isImage: Boolean,
        textContent: String,
        keywordHits: [String],
        scanned: Boolean
      }
    ],
    scan: {
      bodyKeywordHits: [String],
      attachmentKeywordHits: [String],
      matchedKeywords: [String],
      scanMode: {
        type: String,
        enum: ['links_and_keywords', 'keywords_only', 'no_match', 'image_excluded_oos'],
        default: 'keywords_only'
      }
    },
    decision: {
      type: String,
      enum: ['pending', 'matched', 'rejected', 'partial', 'image_oos'],
      default: 'pending',
      index: true
    },
    actions: [
      {
        type: {
          type: String,
          enum: ['moved_to_rejected', 'forwarded_to_sales', 'imported_as_tender', 'graph_retry', 'skipped_image_oos']
        },
        at: Date,
        detail: String,
        target: String
      }
    ],
    importedTenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tender'
    },
    processedAt: Date,
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'EmailTenderMessage' }
);

emailTenderMessageSchema.index({ companyId: 1, graphMessageId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('EmailTenderMessage', emailTenderMessageSchema);
