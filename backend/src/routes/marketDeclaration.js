const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const { requireAdminOrRoles } = require('../middlewares/adminAccess');
const {
  getMarketDeclarations,
  getMarketDeclarationById,
  createMarketDeclaration,
  updateMarketDeclaration,
  deleteMarketDeclaration,
  getMarketDeclarationStats,
  publishMarketDeclaration,
  archiveMarketDeclaration,
  addReviewer
} = require('../controllers/marketDeclarationController');
const router = express.Router();

// Get all market declarations (with pagination and filters)
router.get('/', requireAuth, getMarketDeclarations);

// Get market declaration statistics
router.get('/stats/overview', requireAuth, getMarketDeclarationStats);

// Get market declaration by ID
router.get('/:id', requireAuth, getMarketDeclarationById);

// Create new market declaration
router.post('/', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), createMarketDeclaration);

// Update market declaration
router.put('/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), updateMarketDeclaration);

// Delete market declaration (soft delete)
router.delete('/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), deleteMarketDeclaration);

// Publish market declaration
router.patch('/:id/publish', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), publishMarketDeclaration);

// Archive market declaration
router.patch('/:id/archive', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), archiveMarketDeclaration);

// Add reviewer to market declaration
router.post('/:id/reviewers', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), addReviewer);

module.exports = router;
