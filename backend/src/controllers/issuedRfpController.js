const IssuedRfp = require('../models/IssuedRfp')
const RfpInvitation = require('../models/RfpInvitation')
const RfpSubmission = require('../models/RfpSubmission')
const { hashInvitationToken, generateInvitationToken } = require('../utils/invitationToken')
const { catchAsync } = require('../utils/errorHandler')

function fmtIssuedRfp(doc) {
  if (!doc) return null
  const o = doc.toObject ? doc.toObject() : doc
  return {
    id: o._id,
    issuerCompanyId: o.issuerCompanyId,
    reference: o.reference,
    title: o.title,
    description: o.description,
    status: o.status,
    visibility: o.visibility,
    publishedAt: o.publishedAt,
    submissionDeadline: o.submissionDeadline,
    termsAndConditions: o.termsAndConditions,
    eligibilityCriteria: o.eligibilityCriteria || [],
    documentRefs: o.documentRefs || [],
    createdAt: o.createdAt,
    updatedAt: o.updatedAt
  }
}

exports.listIssuedRfps = catchAsync(async (req, res) => {
  const items = await IssuedRfp.find({
    issuerCompanyId: req.companyId,
    isDeleted: false
  })
    .sort({ updatedAt: -1 })
    .lean()

  res.json({
    success: true,
    data: { issuedRfps: items.map((r) => fmtIssuedRfp(r)) }
  })
})

exports.getIssuedRfp = catchAsync(async (req, res) => {
  const rfp = await IssuedRfp.findOne({
    _id: req.params.id,
    issuerCompanyId: req.companyId,
    isDeleted: false
  }).lean()

  if (!rfp) {
    return res.status(404).json({ success: false, message: 'Issued RFP not found' })
  }

  res.json({ success: true, data: { issuedRfp: fmtIssuedRfp(rfp) } })
})

exports.createIssuedRfp = catchAsync(async (req, res) => {
  const {
    reference,
    title,
    description,
    submissionDeadline,
    termsAndConditions,
    eligibilityCriteria
  } = req.body

  if (!title || !submissionDeadline) {
    return res.status(400).json({
      success: false,
      message: 'title and submissionDeadline are required'
    })
  }

  const ref =
    (reference && String(reference).trim()) ||
    `IRFP-${Date.now().toString(36).toUpperCase()}`

  const exists = await IssuedRfp.findOne({
    issuerCompanyId: req.companyId,
    reference: ref.toUpperCase(),
    isDeleted: false
  })
  if (exists) {
    return res.status(409).json({ success: false, message: 'Reference already used' })
  }

  const doc = await IssuedRfp.create({
    issuerCompanyId: req.companyId,
    reference: ref.toUpperCase(),
    title: title.trim(),
    description: (description || '').trim(),
    submissionDeadline: new Date(submissionDeadline),
    termsAndConditions: termsAndConditions || {
      version: '1.0',
      body: '',
      required: true
    },
    eligibilityCriteria: Array.isArray(eligibilityCriteria) ? eligibilityCriteria : [],
    createdBy: req.user._id,
    updatedBy: req.user._id
  })

  res.status(201).json({
    success: true,
    data: { issuedRfp: fmtIssuedRfp(doc) }
  })
})

exports.updateIssuedRfp = catchAsync(async (req, res) => {
  const rfp = await IssuedRfp.findOne({
    _id: req.params.id,
    issuerCompanyId: req.companyId,
    isDeleted: false
  })

  if (!rfp) {
    return res.status(404).json({ success: false, message: 'Issued RFP not found' })
  }

  if (rfp.status !== 'draft') {
    return res.status(400).json({
      success: false,
      message: 'Only draft Issued RFPs can be edited'
    })
  }

  const allowed = [
    'title',
    'description',
    'submissionDeadline',
    'termsAndConditions',
    'eligibilityCriteria',
    'documentRefs'
  ]
  for (const key of allowed) {
    if (req.body[key] !== undefined) rfp[key] = req.body[key]
  }
  rfp.updatedBy = req.user._id
  await rfp.save()

  res.json({ success: true, data: { issuedRfp: fmtIssuedRfp(rfp) } })
})

exports.publishIssuedRfp = catchAsync(async (req, res) => {
  const rfp = await IssuedRfp.findOne({
    _id: req.params.id,
    issuerCompanyId: req.companyId,
    isDeleted: false
  })

  if (!rfp) {
    return res.status(404).json({ success: false, message: 'Issued RFP not found' })
  }

  if (rfp.status !== 'draft') {
    return res.status(400).json({ success: false, message: 'Already published or closed' })
  }

  rfp.status = 'published'
  rfp.publishedAt = new Date()
  rfp.updatedBy = req.user._id
  await rfp.save()

  res.json({ success: true, data: { issuedRfp: fmtIssuedRfp(rfp) } })
})

exports.createInvitation = catchAsync(async (req, res) => {
  const { email } = req.body
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email required' })
  }

  const rfp = await IssuedRfp.findOne({
    _id: req.params.id,
    issuerCompanyId: req.companyId,
    isDeleted: false
  })

  if (!rfp) {
    return res.status(404).json({ success: false, message: 'Issued RFP not found' })
  }

  if (rfp.status !== 'published') {
    return res.status(400).json({
      success: false,
      message: 'Publish the RFP before sending invitations'
    })
  }

  const normalized = email.toLowerCase().trim()
  const rawToken = generateInvitationToken()
  const tokenHash = hashInvitationToken(rawToken)

  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

  await RfpInvitation.create({
    issuedRfpId: rfp._id,
    issuerCompanyId: req.companyId,
    email: normalized,
    tokenHash,
    expiresAt,
    invitedBy: req.user._id
  })

  const invitePath = `/respond/redeem?token=${encodeURIComponent(rawToken)}`

  res.status(201).json({
    success: true,
    data: {
      invitation: {
        email: normalized,
        expiresAt,
        redeemPath: invitePath,
        /** Raw token — send via email in production; shown once for development */
        rawToken
      }
    },
    message:
      'Invitation created. Use redeemPath or email rawToken to the participant (dev: token returned once).'
  })
})

exports.listSubmissions = catchAsync(async (req, res) => {
  const rfp = await IssuedRfp.findOne({
    _id: req.params.id,
    issuerCompanyId: req.companyId,
    isDeleted: false
  }).lean()

  if (!rfp) {
    return res.status(404).json({ success: false, message: 'Issued RFP not found' })
  }

  const submissions = await RfpSubmission.find({
    issuedRfpId: rfp._id,
    issuerCompanyId: req.companyId
  })
    .populate('supplierCompanyId', 'name displayName code')
    .sort({ updatedAt: -1 })
    .lean()

  const formatted = submissions.map((s) => ({
    id: s._id,
    issuedRfpId: s.issuedRfpId,
    supplierCompanyId: s.supplierCompanyId,
    supplierCompanyName:
      s.supplierCompanyId && s.supplierCompanyId.displayName
        ? s.supplierCompanyId.displayName
        : s.supplierCompanyId?.name,
    status: s.status,
    proposalText: s.proposalText,
    attachments: s.attachments || [],
    submittedAt: s.submittedAt,
    updatedAt: s.updatedAt
  }))

  res.json({ success: true, data: { submissions: formatted } })
})
