const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const {
  getTenders,
  getTenderById,
  createTender,
  updateTender,
  deleteTender,
  getTenderStats,
  addTenderNote,
  updatePipelineStage
} = require('../controllers/tenderController');
const router = express.Router();

// Get all tenders (with pagination and filters)
router.get('/', requireAuth, getTenders);

// Get tender statistics
router.get('/stats/overview', requireAuth, getTenderStats);

// Get tender by ID
router.get('/:id', requireAuth, getTenderById);

// Create new tender
router.post('/', requireAuth, requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR']), createTender);

// Update tender
router.put('/:id', requireAuth, requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR']), updateTender);

// Delete tender
router.delete('/:id', requireAuth, requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR']), deleteTender);

// Add note to tender
router.post('/:id/notes', requireAuth, addTenderNote);

// Update pipeline stage
router.patch('/:id/pipeline-stage', requireAuth, updatePipelineStage);

module.exports = router;