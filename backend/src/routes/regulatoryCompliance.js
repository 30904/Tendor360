const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const { requireAdminOrRoles } = require('../middlewares/adminAccess');
const {
  getRegulatoryDeclarations,
  getCertificates,
  getVendors,
  getRegulatoryComplianceStats,
  createRegulatoryDeclaration,
  createCertificate,
  createVendor,
  updateRegulatoryDeclaration,
  updateCertificate,
  updateVendor,
  deleteRegulatoryDeclaration,
  deleteCertificate,
  deleteVendor
} = require('../controllers/regulatoryComplianceController');
const router = express.Router();

// Get regulatory compliance statistics
router.get('/stats/overview', requireAuth, getRegulatoryComplianceStats);

// Regulatory Declarations routes
router.get('/declarations', requireAuth, getRegulatoryDeclarations);
router.post('/declarations', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), createRegulatoryDeclaration);
router.put('/declarations/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), updateRegulatoryDeclaration);
router.delete('/declarations/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), deleteRegulatoryDeclaration);

// Certificates routes
router.get('/certificates', requireAuth, getCertificates);
router.post('/certificates', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), createCertificate);
router.put('/certificates/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), updateCertificate);
router.delete('/certificates/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), deleteCertificate);

// Vendors routes
router.get('/vendors', requireAuth, getVendors);
router.post('/vendors', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), createVendor);
router.put('/vendors/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), updateVendor);
router.delete('/vendors/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), deleteVendor);

module.exports = router;
