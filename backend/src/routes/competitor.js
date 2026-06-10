const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const { requireAdminOrRoles } = require('../middlewares/adminAccess');
const {
  getCompetitors,
  getCompetitorById,
  createCompetitor,
  updateCompetitor,
  deleteCompetitor,
  addIntelligenceNote,
  getCompetitorStats,
  getWinLossAnalysis,
  createWinLossAnalysis
} = require('../controllers/competitorController');
const router = express.Router();

// Get all competitors (with pagination and filters)
router.get('/', requireAuth, getCompetitors);

// Get competitor statistics
router.get('/stats/overview', requireAuth, getCompetitorStats);

// Get competitor by ID
router.get('/:id', requireAuth, getCompetitorById);

// Create new competitor
router.post('/', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), createCompetitor);

// Update competitor
router.put('/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), updateCompetitor);

// Delete competitor
router.delete('/:id', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), deleteCompetitor);

// Add intelligence note to competitor
router.post('/:id/intelligence', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), addIntelligenceNote);

// Get win/loss analysis for competitor
router.get('/:id/win-loss-analysis', requireAuth, getWinLossAnalysis);

// Create win/loss analysis for competitor
router.post('/:id/win-loss-analysis', requireAuth, requireAdminOrRoles('TENDER MANAGER', 'SYSTEM ADMINISTRATOR'), createWinLossAnalysis);

module.exports = router;
