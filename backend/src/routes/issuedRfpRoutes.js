const express = require('express')
const { requireAuth } = require('../middlewares/auth')
const { requireBuyer } = require('../middlewares/organizationAccess')
const issuedRfpController = require('../controllers/issuedRfpController')

const router = express.Router()

router.use(requireAuth, requireBuyer)

router.get('/', issuedRfpController.listIssuedRfps)
router.post('/', issuedRfpController.createIssuedRfp)
router.get('/:id', issuedRfpController.getIssuedRfp)
router.patch('/:id', issuedRfpController.updateIssuedRfp)
router.post('/:id/publish', issuedRfpController.publishIssuedRfp)
router.post('/:id/invitations', issuedRfpController.createInvitation)
router.get('/:id/submissions', issuedRfpController.listSubmissions)

module.exports = router
