const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  copyRole,
  getRoleStats,
  getPermissions
} = require('../controllers/roleController');
const router = express.Router();

// Get all roles with filtering and pagination
router.get('/', requireAuth, getRoles);

// Get role statistics
router.get('/stats/overview', requireAuth, getRoleStats);

// Get available permissions
router.get('/permissions', requireAuth, getPermissions);

// Get role by ID
router.get('/:id', requireAuth, getRoleById);

// Create new role (Admin only)
router.post('/', requireAuth, requireRoles(['SYSTEM ADMINISTRATOR', 'TENDER MANAGER']), createRole);

// Update role (Admin only)
router.put('/:id', requireAuth, requireRoles(['SYSTEM ADMINISTRATOR', 'TENDER MANAGER']), updateRole);

// Delete role (Admin only)
router.delete('/:id', requireAuth, requireRoles(['SYSTEM ADMINISTRATOR', 'TENDER MANAGER']), deleteRole);

// Copy role (Admin only)
router.post('/:id/copy', requireAuth, requireRoles(['SYSTEM ADMINISTRATOR', 'TENDER MANAGER']), copyRole);

module.exports = router;
