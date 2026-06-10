const express = require('express');
const router = express.Router();
const { requireAuth, requireRoles } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

// Apply authentication middleware to all admin routes
router.use(requireAuth);
router.use(requireRoles('SYSTEM ADMINISTRATOR'));

// System Statistics
router.get('/stats', adminController.getSystemStats);

// User Management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/status', adminController.updateUserStatus);

// Role Management
router.get('/roles', adminController.getRoles);
router.get('/roles/:id', adminController.getRoleById);
router.get('/permissions', adminController.getAvailablePermissions);
router.post('/roles', adminController.createRole);
router.put('/roles/:id', adminController.updateRole);
router.delete('/roles/:id', adminController.deleteRole);

// Security Settings
router.get('/security', adminController.getSecuritySettings);
router.put('/security', adminController.updateSecuritySettings);

// System Configuration
router.get('/config', adminController.getSystemConfig);
router.put('/config', adminController.updateSystemConfig);

// Audit Logs
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/audit-logs/export', adminController.exportAuditLogs);

module.exports = router;
