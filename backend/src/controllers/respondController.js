const IssuedRfp = require('../models/IssuedRfp')
const RfpInvitation = require('../models/RfpInvitation')
const RfpSubmission = require('../models/RfpSubmission')
const { hashInvitationToken } = require('../utils/invitationToken')
const { catchAsync } = require('../utils/errorHandler')

function fmtRfpBrief(doc) {
  if (!doc) return null
  const o = doc.toObject ? doc.toObject() : doc
  return {
    id: o._id,
    reference: o.reference,
    title: o.title,
    description: o.description,
    status: o.status,
    submissionDeadline: o.submissionDeadline,
    termsAndConditions: o.termsAndConditions,
    eligibilityCriteria: o.eligibilityCriteria || [],
    documentRefs: o.documentRefs || [],
    publishedAt: o.publishedAt
  }
}

exports.listMyInvitations = catchAsync(async (req, res) => {
  const email = req.user.email.toLowerCase()

  const invitations = await RfpInvitation.find({ email })
    .populate('issuedRfpId')
    .populate('issuerCompanyId', 'name displayName code')
    .sort({ createdAt: -1 })
    .lean()

  const rows = invitations.map((inv) => ({
    id: inv._id,
    status: inv.status,
    expiresAt: inv.expiresAt,
    issuedRfp: inv.issuedRfpId ? fmtRfpBrief(inv.issuedRfpId) : null,
    issuerCompany:
      inv.issuerCompanyId &&
      (inv.issuerCompanyId.displayName || inv.issuerCompanyId.name)
  }))

  res.json({ success: true, data: { invitations: rows } })
})

exports.redeemInvitation = catchAsync(async (req, res) => {
  const { token } = req.body
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ success: false, message: 'token is required' })
  }

  const tokenHash = hashInvitationToken(token.trim())
  const inv = await RfpInvitation.findOne({ tokenHash })

  if (!inv) {
    return res.status(404).json({ success: false, message: 'Invalid invitation token' })
  }

  if (inv.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Invitation already used or not pending' })
  }

  if (inv.expiresAt < new Date()) {
    inv.status = 'expired'
    await inv.save()
    return res.status(400).json({ success: false, message: 'Invitation expired' })
  }

  if (inv.email !== req.user.email.toLowerCase()) {
    return res.status(403).json({
      success: false,
      message: 'This invitation was sent to a different email address'
    })
  }

  const rfp = await IssuedRfp.findOne({
    _id: inv.issuedRfpId,
    isDeleted: false
  }).lean()

  if (!rfp || rfp.status !== 'published') {
    return res.status(400).json({ success: false, message: 'RFP is not available' })
  }

  if (rfp.submissionDeadline < new Date()) {
    return res.status(400).json({ success: false, message: 'Submission deadline has passed' })
  }

  inv.supplierCompanyId = req.companyId
  inv.acceptedByUserId = req.user._id
  inv.redeemedAt = new Date()
  inv.status = 'accepted'
  await inv.save()

  let submission = await RfpSubmission.findOne({
    issuedRfpId: rfp._id,
    supplierCompanyId: req.companyId
  })

  if (!submission) {
    submission = await RfpSubmission.create({
      issuedRfpId: rfp._id,
      issuerCompanyId: rfp.issuerCompanyId,
      supplierCompanyId: req.companyId,
      invitationId: inv._id,
      status: 'draft',
      updatedBy: req.user._id
    })
  }

  res.json({
    success: true,
    data: {
      invitation: { id: inv._id, status: inv.status },
      issuedRfp: fmtRfpBrief(rfp),
      submission: {
        id: submission._id,
        status: submission.status
      }
    },
    message: 'Invitation redeemed'
  })
})

exports.getIssuedRfpForParticipant = catchAsync(async (req, res) => {
  const rfp = await IssuedRfp.findOne({
    _id: req.params.id,
    status: 'published',
    isDeleted: false
  }).lean()

  if (!rfp) {
    return res.status(404).json({ success: false, message: 'RFP not found' })
  }

  const inv = await RfpInvitation.findOne({
    issuedRfpId: rfp._id,
    email: req.user.email.toLowerCase(),
    supplierCompanyId: req.companyId,
    status: 'accepted'
  })

  if (!inv) {
    return res.status(403).json({
      success: false,
      message: 'You do not have access to this RFP. Redeem your invitation first.'
    })
  }

  res.json({ success: true, data: { issuedRfp: fmtRfpBrief(rfp) } })
})

exports.acceptTerms = catchAsync(async (req, res) => {
  const { version } = req.body
  const rfp = await IssuedRfp.findOne({
    _id: req.params.id,
    status: 'published',
    isDeleted: false
  })

  if (!rfp) {
    return res.status(404).json({ success: false, message: 'RFP not found' })
  }

  const inv = await RfpInvitation.findOne({
    issuedRfpId: rfp._id,
    email: req.user.email.toLowerCase(),
    supplierCompanyId: req.companyId,
    status: 'accepted'
  })

  if (!inv) {
    return res.status(403).json({ success: false, message: 'No accepted invitation for this RFP' })
  }

  const expected =
    rfp.termsAndConditions?.version || '1.0'
  if (version && String(version) !== String(expected)) {
    return res.status(400).json({
      success: false,
      message: `Terms version mismatch. Expected ${expected}`
    })
  }

  inv.acceptedTermsVersion = String(version || expected)
  inv.acceptedAt = new Date()
  await inv.save()

  res.json({
    success: true,
    data: {
      acceptedTermsVersion: inv.acceptedTermsVersion,
      acceptedAt: inv.acceptedAt
    }
  })
})

exports.getOrCreateSubmission = catchAsync(async (req, res) => {
  const rfp = await IssuedRfp.findOne({
    _id: req.params.id,
    status: 'published',
    isDeleted: false
  })

  if (!rfp) {
    return res.status(404).json({ success: false, message: 'RFP not found' })
  }

  const inv = await RfpInvitation.findOne({
    issuedRfpId: rfp._id,
    email: req.user.email.toLowerCase(),
    supplierCompanyId: req.companyId,
    status: 'accepted'
  })

  if (!inv) {
    return res.status(403).json({ success: false, message: 'Redeem invitation first' })
  }

  if (rfp.termsAndConditions?.required && !inv.acceptedTermsVersion) {
    return res.status(400).json({
      success: false,
      message: 'Accept terms and conditions before editing submission'
    })
  }

  let submission = await RfpSubmission.findOne({
    issuedRfpId: rfp._id,
    supplierCompanyId: req.companyId
  })

  if (!submission) {
    submission = await RfpSubmission.create({
      issuedRfpId: rfp._id,
      issuerCompanyId: rfp.issuerCompanyId,
      supplierCompanyId: req.companyId,
      invitationId: inv._id,
      status: 'draft',
      updatedBy: req.user._id
    })
  }

  res.json({
    success: true,
    data: {
      submission: {
        id: submission._id,
        status: submission.status,
        proposalText: submission.proposalText,
        attachments: submission.attachments || [],
        submittedAt: submission.submittedAt
      }
    }
  })
})

exports.updateSubmissionDraft = catchAsync(async (req, res) => {
  const submission = await RfpSubmission.findOne({
    _id: req.params.submissionId,
    supplierCompanyId: req.companyId
  })

  if (!submission) {
    return res.status(404).json({ success: false, message: 'Submission not found' })
  }

  if (submission.status !== 'draft') {
    return res.status(400).json({ success: false, message: 'Cannot edit a submitted proposal' })
  }

  const inv = await RfpInvitation.findById(submission.invitationId)
  const rfp = await IssuedRfp.findById(submission.issuedRfpId)
  if (rfp?.termsAndConditions?.required && inv && !inv.acceptedTermsVersion) {
    return res.status(400).json({ success: false, message: 'Accept terms first' })
  }

  if (req.body.proposalText !== undefined) {
    submission.proposalText = String(req.body.proposalText).slice(0, 50000)
  }
  if (Array.isArray(req.body.attachments)) {
    submission.attachments = req.body.attachments.map((a) => ({
      name: a.name || 'attachment',
      url: a.url || '',
      uploadedAt: new Date()
    }))
  }
  submission.updatedBy = req.user._id
  await submission.save()

  res.json({
    success: true,
    data: {
      submission: {
        id: submission._id,
        status: submission.status,
        proposalText: submission.proposalText,
        attachments: submission.attachments
      }
    }
  })
})

exports.submitProposal = catchAsync(async (req, res) => {
  const submission = await RfpSubmission.findOne({
    _id: req.params.submissionId,
    supplierCompanyId: req.companyId
  })

  if (!submission) {
    return res.status(404).json({ success: false, message: 'Submission not found' })
  }

  const inv = await RfpInvitation.findById(submission.invitationId)
  const rfp = await IssuedRfp.findById(submission.issuedRfpId)

  if (!rfp) {
    return res.status(404).json({ success: false, message: 'RFP not found' })
  }

  if (rfp.submissionDeadline < new Date()) {
    return res.status(400).json({ success: false, message: 'Deadline passed' })
  }

  if (rfp.termsAndConditions?.required && inv && !inv.acceptedTermsVersion) {
    return res.status(400).json({ success: false, message: 'Accept terms before submitting' })
  }

  submission.status = 'submitted'
  submission.submittedAt = new Date()
  submission.updatedBy = req.user._id
  await submission.save()

  res.json({
    success: true,
    data: {
      submission: {
        id: submission._id,
        status: submission.status,
        submittedAt: submission.submittedAt
      }
    },
    message: 'Proposal submitted'
  })
})
