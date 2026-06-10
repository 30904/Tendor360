const express = require('express')
const { requireAuth } = require('../middlewares/auth')
const { requireSupplier } = require('../middlewares/organizationAccess')
const respondController = require('../controllers/respondController')

const router = express.Router()

router.use(requireAuth, requireSupplier)

router.get('/invitations', respondController.listMyInvitations)
router.post('/invitations/redeem', respondController.redeemInvitation)
router.get('/issued-rfps/:id', respondController.getIssuedRfpForParticipant)
router.post('/issued-rfps/:id/accept-terms', respondController.acceptTerms)
router.get('/issued-rfps/:id/submission', respondController.getOrCreateSubmission)
router.patch('/submissions/:submissionId', respondController.updateSubmissionDraft)
router.post('/submissions/:submissionId/submit', respondController.submitProposal)

module.exports = router
