const Pricing = require('../models/Pricing');
const Tender = require('../models/Tender');
const { catchAsync } = require('../utils/errorHandler');

// Get all pricing scenarios (with optional filters)
exports.getPricing = catchAsync(async (req, res) => {
  const filter = { companyId: req.companyId, isDeleted: false };
  if (req.query.tenderId) {
    filter.tenderId = req.query.tenderId;
  }
  
  const pricing = await Pricing.find(filter)
    .populate('tenderId', 'title organization referenceNumber estimatedValue')
    .sort('-createdAt');

  res.json({
    success: true,
    data: { pricing },
    message: 'Pricing scenarios retrieved successfully'
  });
});

// Get pricing for a specific tender
exports.getTenderPricing = catchAsync(async (req, res) => {
  const pricing = await Pricing.find({ 
    tenderId: req.params.tenderId,
    companyId: req.companyId,
    isDeleted: false
  }).sort('-createdAt');

  res.json({
    success: true,
    data: { pricing },
    message: 'Tender pricing retrieved successfully'
  });
});

// Create new pricing scenario
exports.createPricing = catchAsync(async (req, res) => {
  const pricingData = {
    ...req.body,
    companyId: req.companyId,
    createdBy: req.user.id
  };

  const pricing = await Pricing.create(pricingData);

  res.status(201).json({
    success: true,
    data: { pricing },
    message: 'Pricing scenario created successfully'
  });
});

// Update pricing scenario
exports.updatePricing = catchAsync(async (req, res) => {
  const pricing = await Pricing.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!pricing) {
    return res.status(404).json({ success: false, message: 'Pricing not found' });
  }

  res.json({
    success: true,
    data: { pricing },
    message: 'Pricing updated successfully'
  });
});

// Delete pricing scenario
exports.deletePricing = catchAsync(async (req, res) => {
  const pricing = await Pricing.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId },
    { isDeleted: true },
    { new: true }
  );

  if (!pricing) {
    return res.status(404).json({ success: false, message: 'Pricing not found' });
  }

  res.json({
    success: true,
    data: null,
    message: 'Pricing deleted successfully'
  });
});

// AI Predict Pricing Margin
exports.generateAIPricing = catchAsync(async (req, res) => {
  const { tenderId } = req.body;
  
  const tender = await Tender.findOne({ _id: tenderId, companyId: req.companyId });
  if (!tender) {
    return res.status(404).json({ success: false, message: 'Tender not found for AI analysis' });
  }

  // Simulate AI delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock Engine logic: larger tenders require more competitive (lower) margins to win.
  let suggestedMargin = 15; // default 15%
  let probability = 60;
  let optimizationText = "Standard optimization for balanced risk-reward.";

  if (tender.estimatedValue > 10000000) {
    suggestedMargin = 8;
    probability = 80;
    optimizationText = "AI: Ultra-competitive margin suggested (8%) due to high contract value. Win probability optimized.";
  } else if (tender.estimatedValue > 5000000) {
    suggestedMargin = 12;
    probability = 75;
    optimizationText = "AI: Moderate competitive squeeze applied. 12% margin yields strong win probability.";
  } else {
    suggestedMargin = 18;
    probability = 65;
    optimizationText = "AI: Premium pricing available for this market segment without heavily sacrificing win rate.";
  }

  res.json({
    success: true,
    data: {
      prediction: {
        suggestedMarginPercentage: suggestedMargin,
        winProbability: probability,
        aiOptimization: optimizationText,
        aiConfidence: Math.floor(Math.random() * 15 + 80) // 80-95% confidence
      }
    },
    message: 'AI pricing strategy generated'
  });
});
