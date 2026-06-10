const mongoose = require('mongoose')

const rfpInvitationSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false
    },
    expiresAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
      index: true
    },
    supplierCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null
    },
    acceptedTermsVersion: String,
    acceptedAt: Date,
    acceptedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    redeemedAt: Date,
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true, collection: 'RfpInvitation' }
)

rfpInvitationSchema.index({ issuedRfpId: 1, email: 1 })

module.exports = mongoose.model('RfpInvitation', rfpInvitationSchema)
