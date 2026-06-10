const mongoose = require('mongoose')

const rfpSubmissionSchema = new mongoose.Schema(
  {
    issuedRfpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IssuedRfp',
      required: true,
      index: true
    },
    issuerCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    supplierCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    invitationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RfpInvitation',
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'withdrawn'],
      default: 'draft',
      index: true
    },
    proposalText: { type: String, trim: true, maxlength: 50000 },
    attachments: [
      {
        name: { type: String, trim: true },
        url: { type: String, trim: true },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    submittedAt: Date,
    withdrawnAt: Date,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true, collection: 'RfpSubmission' }
)

rfpSubmissionSchema.index(
  { issuedRfpId: 1, supplierCompanyId: 1 },
  { unique: true }
)

module.exports = mongoose.model('RfpSubmission', rfpSubmissionSchema)
