const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const rfpResponseController = require('../controllers/rfpResponseController');
const router = express.Router();

// Apply authentication to all routes
router.use(requireAuth);

// ─── CRUD ─────────────────────────────────────────────────────────

// List all RFP response projects
router.get('/', rfpResponseController.listRfpResponses);

// Get single RFP response with all sections
router.get('/:id', rfpResponseController.getRfpResponse);

// Create new RFP response project
router.post('/',
  requireRoles('TENDER_MANAGER', 'ADMIN'),
  rfpResponseController.createRfpResponse
);

// Update response metadata
router.put('/:id',
  requireRoles('TENDER_MANAGER', 'ADMIN'),
  rfpResponseController.updateRfpResponse
);

// Delete response project
router.delete('/:id',
  requireRoles('ADMIN'),
  rfpResponseController.deleteRfpResponse
);

// ─── AI Pipeline ──────────────────────────────────────────────────

// Phase 1: Extract requirements from tender
router.post('/:id/extract',
  requireRoles('TENDER_MANAGER', 'ADMIN'),
  rfpResponseController.extractRequirements
);

// Phase 2: Generate a single section
router.post('/:id/generate/:sectionType',
  requireRoles('TENDER_MANAGER', 'ADMIN'),
  rfpResponseController.generateSection
);

// Phase 2: Generate all sections
router.post('/:id/generate-all',
  requireRoles('TENDER_MANAGER', 'ADMIN'),
  rfpResponseController.generateAllSections
);

// ─── Section Management ───────────────────────────────────────────

// Edit section content manually
router.put('/:id/sections/:sectionId',
  requireRoles('TENDER_MANAGER', 'REVIEWER', 'ADMIN'),
  rfpResponseController.updateSection
);

// Approve a section
router.post('/:id/sections/:sectionId/approve',
  requireRoles('REVIEWER', 'APPROVER', 'ADMIN'),
  rfpResponseController.approveSection
);

// ─── Validation & Submission ──────────────────────────────────────

// Phase 3: Run compliance audit
router.post('/:id/validate',
  rfpResponseController.validateResponse
);

// Final submission
router.post('/:id/submit',
  requireRoles('APPROVER', 'ADMIN'),
  rfpResponseController.submitResponse
);

module.exports = router;
