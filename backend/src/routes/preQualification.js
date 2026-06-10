const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const { requireAdminOrRoles } = require('../middlewares/adminAccess');
const {
  // Vendor Management
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  approveVendor,
  rejectVendor,
  getVendorStats,
  // Audit Management
  createAudit,
  getAudits,
  getAuditById,
  updateAudit,
  deleteAudit,
  getAuditStats,
  // Dashboard
  getDashboardStats,
} = require('../controllers/preQualificationController');
const router = express.Router();

// --- Vendor Management Routes ---
router.get('/', requireAuth, getVendors);
router.get('/stats', requireAuth, getVendorStats);
router.get('/dashboard', requireAuth, getDashboardStats);
router.get('/:id', requireAuth, getVendorById);
router.post('/', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), createVendor);
router.put('/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), updateVendor);
router.delete('/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), deleteVendor);
router.post('/:id/approve', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), approveVendor);
router.post('/:id/reject', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), rejectVendor);

// --- Audit Management Routes ---
router.get('/audits', requireAuth, getAudits);
router.get('/audits/stats', requireAuth, getAuditStats);
router.get('/audits/:id', requireAuth, getAuditById);
router.post('/audits', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), createAudit);
router.put('/audits/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), updateAudit);
router.delete('/audits/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), deleteAudit);

module.exports = router;
