const mongoose = require('mongoose')

const issuedRfpSchema = new mongoose.Schema(
  {
    issuerCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    reference: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    description: {
      type: String,
      trim: true,
      maxlength: 8000
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed', 'cancelled'],
      default: 'draft',
      index: true
    },
    visibility: {
      type: String,
      enum: ['invite_only'],
      default: 'invite_only'
    },
    publishedAt: { type: Date },
    submissionDeadline: { type: Date, required: true },
    termsAndConditions: {
      version: { type: String, default: '1.0' },
      body: { type: String, default: '' },
      required: { type: Boolean, default: true }
    },
    eligibilityCriteria: [{ type: String, trim: true }],
    documentRefs: [
      {
        label: String,
        url: String,
        documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' }
      }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'IssuedRfp' }
)

issuedRfpSchema.index({ issuerCompanyId: 1, reference: 1 }, { unique: true })
issuedRfpSchema.index({ issuerCompanyId: 1, status: 1, updatedAt: -1 })

module.exports = mongoose.model('IssuedRfp', issuedRfpSchema)
