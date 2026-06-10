const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  getUserStats,
  getRoles
} = require('../controllers/userController');
const router = express.Router();

// Get all users with filtering and pagination
router.get('/', requireAuth, getUsers);

// Get user statistics
router.get('/stats/overview', requireAuth, getUserStats);

// Get available roles
router.get('/roles', requireAuth, getRoles);

// Get user by ID
router.get('/:id', requireAuth, getUserById);

// Create new user (Admin only)
router.post('/', requireAuth, requireRoles(['SYSTEM ADMINISTRATOR', 'TENDER MANAGER']), createUser);

// Update user
router.put('/:id', requireAuth, updateUser);

// Delete user (soft delete)
router.delete('/:id', requireAuth, requireRoles(['SYSTEM ADMINISTRATOR', 'TENDER MANAGER']), deleteUser);

// Reset user password
router.post('/:id/reset-password', requireAuth, requireRoles(['SYSTEM ADMINISTRATOR', 'ADMIN', 'TENDER MANAGER']), resetPassword);

module.exports = router;
