const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const pricingController = require('../controllers/pricingController');
const router = express.Router();

router.use(requireAuth);

// Get pricing scenarios (with optional filters)
router.get('/', pricingController.getPricing);

// Get pricing for a tender
router.get('/tender/:tenderId', pricingController.getTenderPricing);

// Generate AI Pricing Strategy
router.post('/ai-predict', 
  requireRoles('PRICING_ANALYST', 'TENDER_MANAGER', 'ADMIN'),
  pricingController.generateAIPricing
);

// Create pricing scenario
router.post('/', 
  requireRoles('PRICING_ANALYST', 'TENDER_MANAGER', 'ADMIN'), 
  pricingController.createPricing
);

// Update pricing scenario
router.put('/:id', 
  requireRoles('PRICING_ANALYST', 'TENDER_MANAGER', 'ADMIN'), 
  pricingController.updatePricing
);

// Delete pricing scenario
router.delete('/:id', 
  requireRoles('PRICING_ANALYST', 'TENDER_MANAGER', 'ADMIN'), 
  pricingController.deletePricing
);

module.exports = router;
