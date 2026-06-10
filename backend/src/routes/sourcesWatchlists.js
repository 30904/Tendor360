const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const {
  // Tender Sources
  getTenderSources,
  getTenderSourceById,
  createTenderSource,
  updateTenderSource,
  deleteTenderSource,
  syncTenderSource,
  
  // Watchlists
  getWatchlists,
  getWatchlistById,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  runWatchlist,
  
  // Statistics and utilities
  getSourcesWatchlistsStats,
  addNote
} = require('../controllers/sourcesWatchlistsController');

const router = express.Router();

// ==================== STATISTICS ====================

// Get sources and watchlists statistics
router.get('/stats/overview', requireAuth, getSourcesWatchlistsStats);

// ==================== TENDER SOURCES ====================

// Get all tender sources (with pagination and filters)
router.get('/sources', requireAuth, getTenderSources);

// Get tender source by ID
router.get('/sources/:id', requireAuth, getTenderSourceById);

// Create new tender source
router.post('/sources', requireAuth, requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'ADMIN']), createTenderSource);

// Update tender source
router.put('/sources/:id', requireAuth, requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'ADMIN']), updateTenderSource);

// Delete tender source
router.delete('/sources/:id', requireAuth, requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'ADMIN']), deleteTenderSource);

// Sync tender source
router.post('/sources/:id/sync', requireAuth, requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'ADMIN']), syncTenderSource);

// ==================== WATCHLISTS ====================

// Get all watchlists (with pagination and filters)
router.get('/watchlists', requireAuth, getWatchlists);

// Get watchlist by ID
router.get('/watchlists/:id', requireAuth, getWatchlistById);

// Create new watchlist
router.post('/watchlists', requireAuth, requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'ADMIN']), createWatchlist);

// Update watchlist
router.put('/watchlists/:id', requireAuth, requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'ADMIN']), updateWatchlist);

// Delete watchlist
router.delete('/watchlists/:id', requireAuth, requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'ADMIN']), deleteWatchlist);

// Run watchlist
router.post('/watchlists/:id/run', requireAuth, requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'ADMIN']), runWatchlist);

// ==================== UTILITIES ====================

// Add note to source or watchlist
router.post('/:type/:id/notes', requireAuth, addNote);

module.exports = router;
