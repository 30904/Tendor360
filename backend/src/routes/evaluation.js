const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const evaluationController = require('../controllers/evaluationController');
const router = express.Router();

// Apply authentication to all routes
router.use(requireAuth);

// Get evaluation statistics (dashboard)
router.get('/stats', evaluationController.getEvaluationStats);

// Get quick decisions data
router.get('/quick-decisions', evaluationController.getQuickDecisions);

// Get evaluation templates
router.get('/templates', evaluationController.getEvaluationTemplates);

// Create evaluation template
router.post('/templates', 
  requireRoles('TENDER_MANAGER', 'REVIEWER', 'APPROVER', 'ADMIN'), 
  evaluationController.createEvaluationTemplate
);

// Clone evaluation template
router.post('/templates/:id/clone', 
  requireRoles('TENDER_MANAGER', 'REVIEWER', 'APPROVER', 'ADMIN'), 
  evaluationController.cloneEvaluationTemplate
);

// Get all evaluations with filters
router.get('/', evaluationController.getEvaluations);

// Generate AI prediction for Risk and Confidence
router.post('/ai-predict', 
  requireRoles('TENDER_MANAGER', 'REVIEWER', 'APPROVER', 'ADMIN'), 
  evaluationController.generateAIPrediction
);

// Get evaluation by ID
router.get('/:id', evaluationController.getEvaluation);

// Create new evaluation
router.post('/', 
  requireRoles('TENDER_MANAGER', 'REVIEWER', 'APPROVER', 'ADMIN'), 
  evaluationController.createEvaluation
);

// Update evaluation
router.put('/:id', 
  requireRoles('TENDER_MANAGER', 'REVIEWER', 'APPROVER', 'ADMIN'), 
  evaluationController.updateEvaluation
);

// Delete evaluation
router.delete('/:id', 
  requireRoles('TENDER_MANAGER', 'REVIEWER', 'APPROVER', 'ADMIN'), 
  evaluationController.deleteEvaluation
);

// Submit evaluation for review
router.post('/:id/submit', 
  requireRoles('TENDER_MANAGER', 'REVIEWER', 'APPROVER', 'ADMIN'), 
  evaluationController.submitForReview
);

// Review evaluation
router.post('/:id/review', 
  requireRoles('REVIEWER', 'APPROVER', 'ADMIN'), 
  evaluationController.reviewEvaluation
);

// Make bid/no-bid decision
router.post('/:id/decision', 
  requireRoles('APPROVER', 'ADMIN'), 
  evaluationController.makeDecision
);

// Get evaluations for a specific tender
router.get('/tender/:tenderId', evaluationController.getEvaluations);

module.exports = router;
