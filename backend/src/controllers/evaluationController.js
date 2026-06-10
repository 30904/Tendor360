const Evaluation = require('../models/Evaluation');
const EvaluationTemplate = require('../models/EvaluationTemplate');
const Tender = require('../models/Tender');
const { catchAsync } = require('../utils/errorHandler');
const { EVALUATION_DECISION } = require('../config/constants');

// Get all evaluations with pagination and filters
exports.getEvaluations = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status, decision, evaluationType, tenderId } = req.query;
  
  const filter = {
    companyId: req.companyId // Add company filtering
  };
  if (status) filter.status = status;
  if (decision) filter.decision = decision;
  if (evaluationType) filter.evaluationType = evaluationType;
  if (tenderId) filter.tenderId = tenderId;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    populate: [
      { path: 'tenderId', select: 'title organization estimatedValue deadline' },
      { path: 'evaluator', select: 'name email' },
      { path: 'approver', select: 'name email' }
    ],
    sort: { createdAt: -1 }
  };

  const evaluations = await Evaluation.paginate(filter, options);
  
  res.json({
    success: true,
    data: evaluations,
    message: 'Evaluations retrieved successfully'
  });
});

// Get evaluation by ID
exports.getEvaluation = catchAsync(async (req, res) => {
  const evaluation = await Evaluation.findOne({ 
    _id: req.params.id, 
    companyId: req.companyId 
  })
    .populate('tenderId', 'title organization estimatedValue deadline status')
    .populate('evaluator', 'name email role')
    .populate('reviewers.user', 'name email role')
    .populate('approver', 'name email role');

  if (!evaluation) {
    return res.status(404).json({
      success: false,
      message: 'Evaluation not found'
    });
  }

  // Get insights
  const insights = evaluation.getInsights();

  res.json({
    success: true,
    data: { evaluation, insights },
    message: 'Evaluation retrieved successfully'
  });
});

// Create new evaluation
exports.createEvaluation = catchAsync(async (req, res) => {
  const { tenderId, templateId, evaluationName, evaluationType, criteria } = req.body;

  // Validate tender exists and belongs to company
  const tender = await Tender.findOne({ _id: tenderId, companyId: req.companyId });
  if (!tender) {
    return res.status(404).json({
      success: false,
      message: 'Tender not found'
    });
  }

  let evaluationData = {
    tenderId,
    evaluationName: evaluationName || `Evaluation for ${tender.title}`,
    evaluationType: evaluationType || 'COMPREHENSIVE',
    evaluator: req.user.id,
    companyId: req.companyId, // Add companyId
    status: 'DRAFT'
  };

  // If template is provided, use it
  if (templateId) {
    const template = await EvaluationTemplate.findOne({ _id: templateId, companyId: req.companyId });
    if (template) {
      evaluationData.criteria = template.criteria.map(criterion => ({
        ...criterion.toObject(),
        score: 0,
        notes: '',
        evidence: '',
        evaluator: req.user.id,
        evaluatedAt: new Date()
      }));
      
      // Update template usage
      template.usageCount += 1;
      template.lastUsed = new Date();
      await template.save();
    }
  } else if (criteria) {
    evaluationData.criteria = criteria;
  }

  const evaluation = await Evaluation.create(evaluationData);

  res.status(201).json({
    success: true,
    data: { evaluation },
    message: 'Evaluation created successfully'
  });
});

// Update evaluation
exports.updateEvaluation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Remove fields that shouldn't be updated
  delete updateData.tenderId;
  delete updateData.evaluator;
  delete updateData.approvedAt;

  const evaluation = await Evaluation.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('tenderId evaluator');

  if (!evaluation) {
    return res.status(404).json({
      success: false,
      message: 'Evaluation not found'
    });
  }

  res.json({
    success: true,
    data: { evaluation },
    message: 'Evaluation updated successfully'
  });
});

// Delete evaluation
exports.deleteEvaluation = catchAsync(async (req, res) => {
  const evaluation = await Evaluation.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!evaluation) {
    return res.status(404).json({
      success: false,
      message: 'Evaluation not found'
    });
  }

  res.json({
    success: true,
    message: 'Evaluation deleted successfully'
  });
});

// Submit evaluation for review
exports.submitForReview = catchAsync(async (req, res) => {
  const evaluation = await Evaluation.findById(req.params.id);
  
  if (!evaluation) {
    return res.status(404).json({
      success: false,
      message: 'Evaluation not found'
    });
  }

  // Validate all required criteria are scored
  const unscoredCriteria = evaluation.criteria.filter(c => c.score === 0 && c.isRequired);
  if (unscoredCriteria.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Please score all required criteria: ${unscoredCriteria.map(c => c.name).join(', ')}`
    });
  }

  evaluation.status = 'UNDER_REVIEW';
  evaluation.reviewers = req.body.reviewers || [];
  await evaluation.save();

  res.json({
    success: true,
    data: { evaluation },
    message: 'Evaluation submitted for review successfully'
  });
});

// Review evaluation
exports.reviewEvaluation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { comments, decision } = req.body;

  const evaluation = await Evaluation.findById(id);
  if (!evaluation) {
    return res.status(404).json({
      success: false,
      message: 'Evaluation not found'
    });
  }

  // Add reviewer
  const reviewer = {
    user: req.user.id,
    role: req.user.roles[0],
    reviewedAt: new Date(),
    comments
  };

  evaluation.reviewers.push(reviewer);
  
  // If decision provided, update status
  if (decision) {
    evaluation.status = decision === 'APPROVED' ? 'APPROVED' : 'REJECTED';
    if (decision === 'APPROVED') {
      evaluation.approver = req.user.id;
      evaluation.approvedAt = new Date();
    }
  }

  await evaluation.save();

  res.json({
    success: true,
    data: { evaluation },
    message: 'Evaluation reviewed successfully'
  });
});

// Make bid/no-bid decision
exports.makeDecision = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { decision, decisionReason, confidenceLevel, riskLevel } = req.body;

  const evaluation = await Evaluation.findById(id);
  if (!evaluation) {
    return res.status(404).json({
      success: false,
      message: 'Evaluation not found'
    });
  }

  // Validate decision based on score
  if (decision === EVALUATION_DECISION.BID && evaluation.weightedScore < 70) {
    return res.status(400).json({
      success: false,
      message: 'Score too low for BID decision. Consider NO BID or improve evaluation.'
    });
  }

  evaluation.decision = decision;
  evaluation.decisionReason = decisionReason;
  evaluation.confidenceLevel = confidenceLevel;
  evaluation.riskLevel = riskLevel;
  evaluation.status = 'APPROVED';
  evaluation.approver = req.user.id;
  evaluation.approvedAt = new Date();

  await evaluation.save();

  res.json({
    success: true,
    data: { evaluation },
    message: `Decision made: ${decision}`
  });
});

// Get evaluation statistics
exports.getEvaluationStats = catchAsync(async (req, res) => {
  const stats = await Evaluation.aggregate([
    {
      $group: {
        _id: null,
        totalEvaluations: { $sum: 1 },
        averageScore: { $avg: '$weightedScore' },
        bidCount: {
          $sum: { $cond: [{ $eq: ['$decision', EVALUATION_DECISION.BID] }, 1, 0] }
        },
        noBidCount: {
          $sum: { $cond: [{ $eq: ['$decision', EVALUATION_DECISION.NO_BID] }, 1, 0] }
        },
        pendingCount: {
          $sum: { $cond: [{ $eq: ['$decision', EVALUATION_DECISION.PENDING] }, 1, 0] }
        }
      }
    }
  ]);

  // Get category-wise scores
  const categoryStats = await Evaluation.aggregate([
    {
      $project: {
        technicalScore: '$scoringMatrix.technicalScore',
        financialScore: '$scoringMatrix.financialScore',
        experienceScore: '$scoringMatrix.experienceScore',
        capacityScore: '$scoringMatrix.capacityScore',
        complianceScore: '$scoringMatrix.complianceScore',
        riskScore: '$scoringMatrix.riskScore'
      }
    },
    {
      $group: {
        _id: null,
        avgTechnical: { $avg: '$technicalScore' },
        avgFinancial: { $avg: '$financialScore' },
        avgExperience: { $avg: '$experienceScore' },
        avgCapacity: { $avg: '$capacityScore' },
        avgCompliance: { $avg: '$complianceScore' },
        avgRisk: { $avg: '$riskScore' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {},
      categoryScores: categoryStats[0] || {}
    },
    message: 'Evaluation statistics retrieved successfully'
  });
});

// Get evaluation templates
exports.getEvaluationTemplates = catchAsync(async (req, res) => {
  const { category, evaluationType, isDefault } = req.query;
  
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (evaluationType) filter.evaluationType = evaluationType;
  if (isDefault !== undefined) filter.isDefault = isDefault === 'true';

  const templates = await EvaluationTemplate.find(filter)
    .populate('createdBy', 'name email')
    .sort({ isDefault: -1, usageCount: -1, name: 1 });

  res.json({
    success: true,
    data: { templates },
    message: 'Evaluation templates retrieved successfully'
  });
});

// Create evaluation template
exports.createEvaluationTemplate = catchAsync(async (req, res) => {
  const template = await EvaluationTemplate.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    data: { template },
    message: 'Evaluation template created successfully'
  });
});

// Clone evaluation template
exports.cloneEvaluationTemplate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  const originalTemplate = await EvaluationTemplate.findById(id);
  if (!originalTemplate) {
    return res.status(404).json({
      success: false,
      message: 'Template not found'
    });
  }

  const clonedTemplate = await originalTemplate.clone(newName, req.user.id);
  await clonedTemplate.save();

  res.status(201).json({
    success: true,
    data: { template: clonedTemplate },
    message: 'Template cloned successfully'
  });
});

// Get quick decisions for dashboard
exports.getQuickDecisions = catchAsync(async (req, res) => {
  const recentEvaluations = await Evaluation.find({
    status: { $in: ['APPROVED', 'UNDER_REVIEW'] }
  })
  .populate('tenderId', 'title organization estimatedValue deadline')
  .populate('evaluator', 'name')
  .sort({ updatedAt: -1 })
  .limit(10);

  const pendingDecisions = await Evaluation.find({
    status: 'DRAFT',
    evaluator: req.user.id
  })
  .populate('tenderId', 'title organization deadline')
  .sort({ createdAt: -1 })
  .limit(5);

  const urgentEvaluations = await Evaluation.find({
    'tenderId.deadline': { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    status: { $nin: ['APPROVED', 'REJECTED'] }
  })
  .populate('tenderId', 'title organization deadline')
  .sort({ 'tenderId.deadline': 1 })
  .limit(5);

  res.json({
    success: true,
    data: {
      recentEvaluations,
      pendingDecisions,
      urgentEvaluations
    },
    message: 'Quick decisions data retrieved successfully'
  });
});
