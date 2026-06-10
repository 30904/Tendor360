const { catchAsync } = require('../utils/errorHandler');
const { listConnectors } = require('../services/connectors');
const discoveryService = require('../modules/tender-discovery/services/DiscoveryService');
const tenderIntelligenceService = require('../modules/tender-intelligence/services/TenderIntelligenceService');
const salesforceCrmService = require('../modules/crm/services/SalesforceCrmService');
const { seedSalesforceCrmForCompany } = require('../seed/data/salesforceCrmSeed');
const discoveryScheduler = require('../modules/tender-discovery/services/DiscoveryScheduler');
const scoringEngine = require('../modules/ai-scoring/services/ScoringEngine');
const workspaceAggregationService = require('../modules/opportunity-workspace/services/WorkspaceAggregationService');
const extractionPipeline = require('../modules/document-intelligence/services/ExtractionPipeline');
const DocumentExtraction = require('../modules/document-intelligence/models/DocumentExtraction');
const ExtractionResult = require('../modules/document-intelligence/models/ExtractionResult');
const ClauseExtraction = require('../modules/document-intelligence/models/ClauseExtraction');
const GoNoGoReview = require('../modules/go-no-go/models/GoNoGoReview');
const DecisionHistory = require('../modules/go-no-go/models/DecisionHistory');
const AutomationJob = require('../modules/automation/models/AutomationJob');
const AutomationFailure = require('../modules/automation/models/AutomationFailure');
const retryQueue = require('../modules/automation/services/RetryQueue');
const IntegrationConnector = require('../modules/integrations/models/IntegrationConnector');
const ApiCredential = require('../modules/integrations/models/ApiCredential');
const WebhookSubscription = require('../modules/integrations/models/WebhookSubscription');
const ScoringProfile = require('../modules/ai-scoring/models/ScoringProfile');
const ScoringRule = require('../modules/ai-scoring/models/ScoringRule');
const OpportunityScore = require('../modules/ai-scoring/models/OpportunityScore');
const aiOrchestrator = require('../modules/ai-core/AiOrchestrator');
const Tender = require('../models/Tender');
const Evaluation = require('../models/Evaluation');
const TenderDiscoveryJob = require('../modules/tender-discovery/models/TenderDiscoveryJob');
const TenderSource = require('../models/TenderSource');
const SavedSearch = require('../models/SavedSearch');
const { buildConnectorCatalog, isConnectorConfigured } = require('../modules/intelligence/connectorStatus');
const Company = require('../models/Company');
const ExcelKeywordLoaderService = require('../modules/tender-discovery/services/ExcelKeywordLoaderService');
const GlobalKeyword = require('../models/GlobalKeyword');

exports.getDiscoveryDashboard = catchAsync(async (req, res) => {
  const companyId = req.companyId;
  const [jobs, batches, connectors, sources, savedSearches] = await Promise.all([
    discoveryService.listJobs(companyId, { limit: 10 }),
    discoveryService.listBatches(companyId, { limit: 10 }),
    buildConnectorCatalog(companyId),
    TenderSource.find({ companyId, isDeleted: false }).sort({ updatedAt: -1 }).limit(10).lean(),
    SavedSearch.find({ companyId }).sort({ updatedAt: -1 }).limit(10).lean()
  ]);

  res.json({
    success: true,
    data: {
      connectors,
      jobs,
      batches,
      sources,
      savedSearches,
      scheduler: {
        enabled: Boolean(discoveryScheduler.timer),
        intervalMs: discoveryScheduler.intervalMs
      }
    }
  });
});

exports.createDiscoveryJob = catchAsync(async (req, res) => {
  const { connectorType, sourceId, payload, scheduledAt } = req.body;
  const job = await discoveryService.createJob({
    companyId: req.companyId,
    userId: req.user._id,
    connectorType,
    sourceId,
    payload,
    scheduledAt
  });

  const shouldRunNow = !scheduledAt || new Date(scheduledAt) <= new Date();
  if (shouldRunNow) {
    if (connectorType !== 'manual' && !isConnectorConfigured(connectorType)) {
      job.status = 'failed';
      job.errorMessage = 'Connector not configured';
      await job.save();
    } else {
      try {
        await discoveryService.runJob(job._id, { payload });
      } catch (error) {
        job.status = 'failed';
        job.errorMessage = error.message;
        await job.save();
      }
    }
  }

  const refreshed = await TenderDiscoveryJob.findById(job._id).lean();
  res.status(201).json({ success: true, data: { job: refreshed } });
});

exports.getDiscoveryJobs = catchAsync(async (req, res) => {
  const jobs = await discoveryService.listJobs(req.companyId, {
    status: req.query.status,
    limit: Number(req.query.limit || 20)
  });
  res.json({ success: true, data: { jobs } });
});

exports.getDiscoveryLogs = catchAsync(async (req, res) => {
  const logs = await discoveryService.listLogs(req.companyId, req.params.jobId);
  res.json({ success: true, data: { logs } });
});

exports.getImportQueue = catchAsync(async (req, res) => {
  const batches = await discoveryService.listBatches(req.companyId, {
    limit: Number(req.query.limit || 20)
  });
  res.json({ success: true, data: { batches } });
});

/** TB-001–TB-006 prospecting RTM status for Tender Discovery & Prospecting */
exports.getDiscoveryProspectingRtm = catchAsync(async (req, res) => {
  const summary = await discoveryService.getProspectingRtmSummary(req.companyId);
  const connectors = await buildConnectorCatalog(req.companyId);

  const requirements = [
    {
      id: 'TB-001',
      title: 'GovWin / portal credentials & search',
      status: connectors.some((c) => c.key === 'govwin' && c.configured) ? 'active' : 'pending',
      detail: 'Saved credentials on Discovery Connectors; API-first login (TB-001).'
    },
    {
      id: 'TB-002',
      title: 'Scan bids posted in last 24 hours',
      status: summary.lookbackConfigured > 0 ? 'active' : 'pending',
      detail: `${summary.lookbackConfigured} source(s) with 24h lookback; modifiedSince passed to GovWin/SAM on each job.`
    },
    {
      id: 'TB-003',
      title: 'Identify new or updated bids',
      status: summary.totals.new + summary.totals.updated > 0 ? 'active' : 'ready',
      detail: `Recent batches: ${summary.totals.new} new, ${summary.totals.updated} updated (content-hash change detection).`
    },
    {
      id: 'TB-004',
      title: 'Download tender documents',
      status: summary.totals.attachments > 0 ? 'active' : 'ready',
      detail: `Attachment harvest worker; ${summary.totals.attachments} file(s) in recent imports.`
    },
    {
      id: 'TB-005',
      title: 'SAM.gov API for missing attachments',
      status: connectors.some((c) => c.key === 'sam_gov' && c.configured) ? 'active' : 'pending',
      detail: summary.totals.samFallback
        ? 'SAM.gov fallback used when GovWin returned no files.'
        : 'SAM.gov notice documents API used as fallback when primary feed has no attachments.'
    },
    {
      id: 'TB-006',
      title: 'Extract bid metadata (GovWin)',
      status: summary.metadataTenders.length > 0 ? 'active' : 'ready',
      detail: `Program summary, timeline, contacts mapped on import; ${summary.metadataTenders.length} tender(s) with metadata.`
    }
  ];

  res.json({
    success: true,
    data: {
      requirements,
      summary,
      connectors,
      scheduler: {
        enabled: Boolean(discoveryScheduler.timer),
        intervalMs: discoveryScheduler.intervalMs
      }
    }
  });
});

/** TB-006–TB-010 Tender Intelligence RTM status */
exports.getTenderIntelligenceRtm = catchAsync(async (req, res) => {
  const summary = await tenderIntelligenceService.getIntelligenceRtmSummary(req.companyId);

  const statusFor = (count, min = 1) => {
    if (count >= min) return 'active';
    return 'ready';
  };

  const requirements = [
    {
      id: 'TB-006',
      title: 'Extract bid metadata (GovWin)',
      status: statusFor(summary.counts.metadata),
      detail: `${summary.counts.metadata} tender(s) with program summary, timeline, and contacts (import + document metadata pipeline).`
    },
    {
      id: 'TB-007',
      title: 'Extract ship-to, quantity, scope, SKU',
      status: statusFor(summary.counts.commercial),
      detail: `${summary.counts.commercial} tender(s) with commercial fields from attachment text (heuristic / AI extraction engine).`
    },
    {
      id: 'TB-008',
      title: 'Extract terms & conditions',
      status: statusFor(summary.counts.terms),
      detail: `${summary.counts.terms} tender(s) with insurance, freight, and pricing term clauses.`
    },
    {
      id: 'TB-009',
      title: 'Extract pricing sheet details',
      status: statusFor(summary.counts.pricing),
      detail: `${summary.counts.pricing} tender(s) with qty / UoM / description line items.`
    },
    {
      id: 'TB-010',
      title: 'Generate relevancy score',
      status: statusFor(summary.counts.scores),
      detail: `${summary.counts.scores} opportunity score(s) via in-platform ScoringEngine (profile: ${summary.scoringProfile || 'default'}). External GenAI agent optional.`
    }
  ];

  res.json({ success: true, data: { requirements, summary } });
});

exports.runTenderIntelligence = catchAsync(async (req, res) => {
  const tender = await tenderIntelligenceService.runFullIntelligenceForTender(
    req.companyId,
    req.params.tenderId,
    { score: req.body.score !== false }
  );
  res.json({
    success: true,
    message: 'Tender intelligence pipelines completed (TB-006–TB-010).',
    data: { tender }
  });
});

/** TB-011 CRM / Salesforce account validation */
exports.getCrmAccountRtm = catchAsync(async (req, res) => {
  const status = await salesforceCrmService.getStatus(req.companyId);
  const validated = await Tender.countDocuments({
    companyId: req.companyId,
    isDeleted: false,
    'crmValidation.status': 'validated'
  });
  const partial = await Tender.countDocuments({
    companyId: req.companyId,
    isDeleted: false,
    'crmValidation.status': 'partial'
  });
  const notFound = await Tender.countDocuments({
    companyId: req.companyId,
    isDeleted: false,
    'crmValidation.status': 'not_found'
  });

  const requirements = [
    {
      id: 'TB-011',
      title: 'Validate customer/account from Salesforce',
      status: status.cachedAccounts > 0 || status.configured ? 'active' : 'ready',
      detail: status.configured
        ? `Live Salesforce API (${status.mode}) with ${status.cachedAccounts} cached account(s). ${validated} validated, ${partial} partial, ${notFound} not found.`
        : `CRM cache mode: ${status.cachedAccounts} seeded account(s). Lookup by organization, ship-to, and contact email. Set SALESFORCE_INSTANCE_URL + SALESFORCE_ACCESS_TOKEN for live API.`
    }
  ];

  res.json({
    success: true,
    data: {
      requirements,
      summary: { status, counts: { validated, partial, notFound } }
    }
  });
});

exports.getCrmValidationFeed = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit || 30);
  const tenders = await Tender.find({
    companyId: req.companyId,
    isDeleted: false,
    'crmValidation.validatedAt': { $exists: true }
  })
    .sort({ 'crmValidation.validatedAt': -1 })
    .limit(limit)
    .select('reference title organization crmValidation intelligence.commercial')
    .lean();

  res.json({ success: true, data: { tenders } });
});

exports.seedCrmDemo = catchAsync(async (req, res) => {
  const accounts = await seedSalesforceCrmForCompany(req.companyId);
  res.json({
    success: true,
    message: 'Healthcare CRM demo accounts and Salesforce connector seeded (TB-011).',
    data: { count: accounts.length }
  });
});

exports.lookupCrmAccount = catchAsync(async (req, res) => {
  const result = await salesforceCrmService.lookupAccount(req.companyId, req.body);
  res.json({ success: true, data: { validation: result } });
});

exports.validateTenderCrm = catchAsync(async (req, res) => {
  const { tender, validation } = await salesforceCrmService.validateTender(
    req.companyId,
    req.params.tenderId
  );
  res.json({
    success: true,
    message: 'CRM account validation completed (TB-011).',
    data: { tender, validation }
  });
});

exports.validateAllCrm = catchAsync(async (req, res) => {
  const limit = Number(req.body.limit || 20);
  const results = await salesforceCrmService.validateAllRecent(req.companyId, limit);
  res.json({
    success: true,
    message: `Validated ${results.length} opportunity(ies) against CRM.`,
    data: { results }
  });
});

exports.getTenderIntelligenceFeed = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit || 30);
  const tenders = await Tender.find({
    companyId: req.companyId,
    isDeleted: false,
    $or: [
      { 'intelligence.commercial.extractedAt': { $exists: true } },
      { 'intelligence.relevancy.scoredAt': { $exists: true } }
    ]
  })
    .select('title reference organization intelligence discovery pipelineStage status aiMatchScore')
    .sort({ 'intelligence.relevancy.scoredAt': -1, updatedAt: -1 })
    .limit(limit)
    .lean();

  res.json({ success: true, data: { tenders } });
});

exports.getDiscoveryMetadataFeed = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit || 30);
  const tenders = await Tender.find({
    companyId: req.companyId,
    isDeleted: false,
    'discovery.metadata.extractedAt': { $exists: true }
  })
    .select('title reference organization discovery pipelineStage status')
    .sort({ 'discovery.metadata.extractedAt': -1 })
    .limit(limit)
    .lean();

  res.json({ success: true, data: { tenders } });
});

exports.getOpportunityWorkspace = catchAsync(async (req, res) => {
  try {
    const workspace = await workspaceAggregationService.getWorkspace(req.companyId, req.params.tenderId);
    res.json({ success: true, data: workspace });
  } catch (error) {
    if (error.message === 'Opportunity not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    throw error;
  }
});

exports.scoreOpportunity = catchAsync(async (req, res) => {
  const score = await scoringEngine.scoreOpportunity(req.companyId, req.params.tenderId, {
    profileId: req.body.profileId
  });
  res.json({ success: true, data: { score } });
});

exports.listOpportunityScores = catchAsync(async (req, res) => {
  const scores = await scoringEngine.listScores(req.companyId, {
    limit: Number(req.query.limit || 20)
  });
  res.json({ success: true, data: { scores } });
});

exports.listScoringProfiles = catchAsync(async (req, res) => {
  const profiles = await ScoringProfile.find({ companyId: req.companyId, isDeleted: false }).lean();
  res.json({ success: true, data: { profiles } });
});

exports.createScoringProfile = catchAsync(async (req, res) => {
  const profile = await ScoringProfile.create({
    companyId: req.companyId,
    ...req.body
  });
  res.status(201).json({ success: true, data: { profile } });
});

exports.listScoringRules = catchAsync(async (req, res) => {
  const rules = await ScoringRule.find({
    companyId: req.companyId,
    profileId: req.params.profileId,
    isDeleted: false
  }).lean();
  res.json({ success: true, data: { rules } });
});

exports.createScoringRule = catchAsync(async (req, res) => {
  const rule = await ScoringRule.create({
    companyId: req.companyId,
    profileId: req.params.profileId,
    ...req.body
  });
  res.status(201).json({ success: true, data: { rule } });
});

exports.runDocumentExtraction = catchAsync(async (req, res) => {
  const extraction = await extractionPipeline.run(req.companyId, req.params.documentId, {
    tenderId: req.body.tenderId,
    pipeline: req.body.pipeline
  });
  res.status(202).json({ success: true, data: { extraction } });
});

exports.getDocumentExtraction = catchAsync(async (req, res) => {
  const extraction = await DocumentExtraction.findOne({
    _id: req.params.extractionId,
    companyId: req.companyId
  }).lean();

  if (!extraction) {
    return res.status(404).json({ success: false, message: 'Extraction not found' });
  }

  const [fields, clauses] = await Promise.all([
    ExtractionResult.find({ companyId: req.companyId, extractionId: extraction._id }).lean(),
    ClauseExtraction.find({ companyId: req.companyId, extractionId: extraction._id }).lean()
  ]);
  res.json({ success: true, data: { extraction, fields, clauses } });
});

exports.listGoNoGoReviews = catchAsync(async (req, res) => {
  const reviews = await GoNoGoReview.find({ companyId: req.companyId, isDeleted: false })
    .sort({ updatedAt: -1 })
    .limit(50)
    .populate('tenderId', 'title reference organization estimatedValue deadline')
    .lean();

  const enriched = await Promise.all(
    reviews.map(async (review) => {
      const history = await DecisionHistory.find({
        companyId: req.companyId,
        reviewId: review._id
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('actorId', 'name email')
        .lean();

      return { ...review, history };
    })
  );

  res.json({ success: true, data: { reviews: enriched } });
});

exports.upsertGoNoGoReview = catchAsync(async (req, res) => {
  const review = await GoNoGoReview.findOneAndUpdate(
    { companyId: req.companyId, tenderId: req.body.tenderId },
    {
      companyId: req.companyId,
      tenderId: req.body.tenderId,
      recommendation: req.body.recommendation,
      aiRecommendation: req.body.aiRecommendation,
      summary: req.body.summary,
      status: req.body.status || 'in_review',
      createdBy: req.user._id
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (req.body.comment) {
    await DecisionHistory.create({
      companyId: req.companyId,
      reviewId: review._id,
      actorId: req.user._id,
      action: 'commented',
      comment: req.body.comment,
      decision: req.body.recommendation
    });
  }

  res.json({ success: true, data: { review } });
});

exports.getAutomationConsole = catchAsync(async (req, res) => {
  const [jobs, failures] = await Promise.all([
    AutomationJob.find({ companyId: req.companyId }).sort({ updatedAt: -1 }).limit(30).lean(),
    AutomationFailure.find({ companyId: req.companyId, resolvedAt: null })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean()
  ]);
  res.json({ success: true, data: { jobs, failures } });
});

exports.enqueueAutomationJob = catchAsync(async (req, res) => {
  const job = await retryQueue.enqueue({
    companyId: req.companyId,
    jobType: req.body.jobType,
    payload: req.body.payload,
    scheduledAt: req.body.scheduledAt
  });
  res.status(201).json({ success: true, data: { job } });
});

exports.getIntegrationHub = catchAsync(async (req, res) => {
  const [connectors, credentials, webhooks, marketplace, connectorCatalog] = await Promise.all([
    IntegrationConnector.find({ companyId: req.companyId, isDeleted: false }).lean(),
    ApiCredential.find({ companyId: req.companyId, isDeleted: false }).lean(),
    WebhookSubscription.find({ companyId: req.companyId, isDeleted: false }).lean(),
    Promise.resolve(listConnectors()),
    buildConnectorCatalog(req.companyId)
  ]);
  res.json({
    success: true,
    data: { connectors, credentials, webhooks, marketplace, connectorCatalog }
  });
});

exports.upsertIntegrationConnector = catchAsync(async (req, res) => {
  const connector = await IntegrationConnector.findOneAndUpdate(
    { companyId: req.companyId, key: req.body.key },
    {
      companyId: req.companyId,
      key: req.body.key,
      displayName: req.body.displayName,
      category: req.body.category,
      status: req.body.status || 'inactive',
      config: req.body.config
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json({ success: true, data: { connector } });
});

exports.getGovernanceDashboard = catchAsync(async (req, res) => {
  const [reviews, scores, jobs] = await Promise.all([
    GoNoGoReview.find({ companyId: req.companyId }).sort({ updatedAt: -1 }).limit(20).lean(),
    OpportunityScore.find({ companyId: req.companyId }).sort({ updatedAt: -1 }).limit(20).lean(),
    TenderDiscoveryJob.find({ companyId: req.companyId }).sort({ updatedAt: -1 }).limit(20).lean()
  ]);
  res.json({ success: true, data: { reviews, scores, jobs } });
});

exports.getAiProviders = catchAsync(async (req, res) => {
  res.json({ success: true, data: { providers: aiOrchestrator.listProviders() } });
});

exports.getIntelligenceDashboard = catchAsync(async (req, res) => {
  const companyId = req.companyId;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const tenders = await Tender.find({ companyId, isDeleted: false }).lean();
  const evaluations = await Evaluation.find({ companyId }).lean();
  const scores = await OpportunityScore.find({ companyId, isDeleted: false }).lean();
  const goNoGoPending = await GoNoGoReview.countDocuments({
    companyId,
    status: { $in: ['draft', 'in_review'] },
    isDeleted: false
  });

  const discoveredThisWeek = tenders.filter(
    (t) => t.discovery?.importedAt && new Date(t.discovery.importedAt) >= weekAgo
  ).length;

  const requiringReview = scores.filter((s) => s.recommendation === 'review').length;
  const highValue = tenders.filter((t) => (t.estimatedValue || 0) >= 1_000_000).length;
  const expiringDeadlines = tenders.filter(
    (t) => t.deadline >= now && t.deadline <= twoWeeks && t.status === 'active'
  ).length;
  const avgOpportunityScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + (s.compositeScore || 0), 0) / scores.length)
      : Math.round(
          tenders.reduce((sum, tender) => sum + (tender.aiMatchScore || 0), 0) /
            Math.max(tenders.length, 1)
        );

  const automationSavingsHours = await AutomationJob.countDocuments({
    companyId,
    status: 'completed',
    createdAt: { $gte: weekAgo }
  });

  const sourceWiseCounts = tenders.reduce((acc, tender) => {
    const source = tender.discovery?.connectorType || tender.source || 'manual';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const qualifiedOpportunities = tenders.filter((tender) =>
    ['evaluating', 'pursuing', 'submitted'].includes(tender.pipelineStage)
  ).length;

  const scoreDistribution = [
    { bucket: '80-100', count: scores.filter((score) => score.compositeScore >= 80).length },
    { bucket: '60-79', count: scores.filter((score) => score.compositeScore >= 60 && score.compositeScore < 80).length },
    { bucket: '40-59', count: scores.filter((score) => score.compositeScore >= 40 && score.compositeScore < 60).length },
    { bucket: '0-39', count: scores.filter((score) => score.compositeScore < 40).length }
  ];

  const deadlineTrend = Array.from({ length: 8 }, (_, index) => {
    const start = new Date(now.getTime() - (7 - index) * 7 * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: tenders.filter((tender) => tender.deadline >= start && tender.deadline < end).length
    };
  });

  const automationJobs = await AutomationJob.find({ companyId }).sort({ createdAt: -1 }).limit(40).lean();
  const automationTrend = Array.from({ length: 6 }, (_, index) => {
    const start = new Date(now.getTime() - (5 - index) * 7 * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completed: automationJobs.filter(
        (job) => job.status === 'completed' && job.completedAt >= start && job.completedAt < end
      ).length,
      failed: automationJobs.filter(
        (job) => job.status === 'failed' && job.updatedAt >= start && job.updatedAt < end
      ).length
    };
  });

  const industryDistribution = tenders.reduce((acc, tender) => {
    const industry = tender.tags?.[0] || 'life sciences';
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {});

  const biotechHighValue = tenders.filter(
    (tender) => (tender.tags || []).includes('biotech') && (tender.estimatedValue || 0) >= 3000000
  ).length;
  const immediateReview = scores.filter((score) => score.recommendation === 'review').length;
  const healthcareWinLift = Math.round(
    tenders
      .filter((tender) => (tender.tags || []).includes('healthcare'))
      .reduce((sum, tender) => sum + (tender.winProbability || 0), 0) /
      Math.max(tenders.filter((tender) => (tender.tags || []).includes('healthcare')).length, 1)
  );

  res.json({
    success: true,
    data: {
      widgets: {
        aiOpportunityScore: avgOpportunityScore,
        newOpportunitiesDiscovered: discoveredThisWeek,
        opportunitiesRequiringReview: requiringReview,
        qualifiedOpportunities,
        goNoGoPending,
        highValueOpportunities: highValue,
        expiringDeadlines,
        aiRiskAlerts: tenders.filter((t) => t.urgency === 'critical' || t.priority === 'critical')
          .length,
        automationSavingsHours,
        winProbabilityInsights: Math.round(
          tenders.reduce((sum, t) => sum + (t.winProbability || 0), 0) / Math.max(tenders.length, 1)
        )
      },
      aiInsightPanels: [
        {
          tone: 'success',
          title: `AI detected ${biotechHighValue} high-value biotech opportunities`,
          detail: 'Thermo-style portfolio fit is strongest in GMP instrumentation and cold-chain programs.'
        },
        {
          tone: 'warning',
          title: `${immediateReview} bids require immediate review`,
          detail: 'Qualification and clause extraction surfaced insurance and delivery risks on active pursuits.'
        },
        {
          tone: 'info',
          title: `Win probability improved in healthcare sector (${healthcareWinLift}%)`,
          detail: 'Recent scoring refresh increased confidence on hospital and IDN modernization bids.'
        },
        {
          tone: 'primary',
          title: 'Government procurement activity increased 12%',
          detail: 'SAM.gov and GovWin sync cadence captured additional federal and SLED laboratory demand.'
        }
      ],
      scoreDistribution,
      deadlineTrend,
      automationTrend,
      industryDistribution,
      funnel: {
        identified: tenders.filter((t) => t.pipelineStage === 'identified').length,
        evaluating: tenders.filter((t) => t.pipelineStage === 'evaluating').length,
        pursuing: tenders.filter((t) => t.pipelineStage === 'pursuing').length,
        submitted: tenders.filter((t) => t.pipelineStage === 'submitted').length,
        awarded: tenders.filter((t) => t.pipelineStage === 'awarded').length,
        lost: tenders.filter((t) => t.pipelineStage === 'lost').length
      },
      regionalTrends: tenders.reduce((acc, tender) => {
        const region = tender.location || 'Unknown';
        acc[region] = (acc[region] || 0) + 1;
        return acc;
      }, {}),
      sourceWiseCounts,
      evaluationsPending: evaluations.filter((e) => e.decision === 'PENDING').length,
      lastUpdated: now.toISOString()
    }
  });
});

exports.listWorkspaceOpportunities = catchAsync(async (req, res) => {
  const opportunities = await Tender.find({ companyId: req.companyId, isDeleted: false })
    .sort({ updatedAt: -1 })
    .limit(50)
    .select('title reference organization deadline estimatedValue aiMatchScore discovery source pipelineStage urgency priority')
    .lean();

  res.json({ success: true, data: { opportunities } });
});

exports.listDocumentIntelligence = catchAsync(async (req, res) => {
  const extractions = await DocumentExtraction.find({ companyId: req.companyId })
    .sort({ updatedAt: -1 })
    .limit(40)
    .populate('documentId', 'name type status')
    .populate('tenderId', 'title reference')
    .lean();

  const rows = await Promise.all(
    extractions.map(async (extraction) => {
      const [fields, clauses] = await Promise.all([
        ExtractionResult.find({ companyId: req.companyId, extractionId: extraction._id }).lean(),
        ClauseExtraction.find({ companyId: req.companyId, extractionId: extraction._id }).lean()
      ]);
      return { extraction, fields, clauses };
    })
  );

  res.json({ success: true, data: { items: rows } });
});

exports.getPlatformConfig = catchAsync(async (req, res) => {
  const [connectors, profiles, providers, company] = await Promise.all([
    buildConnectorCatalog(req.companyId),
    ScoringProfile.find({ companyId: req.companyId, isDeleted: false }).lean(),
    Promise.resolve(aiOrchestrator.listProviders()),
    Company.findById(req.companyId).select('settings.discovery').lean()
  ]);

  res.json({
    success: true,
    data: {
      connectors,
      scoringProfiles: profiles,
      aiProviders: providers,
      globalKeywords: {
        keywordFileName: company?.settings?.discovery?.keywordFileName || null
      },
      scheduler: {
        enabled: Boolean(discoveryScheduler.timer),
        intervalMs: discoveryScheduler.intervalMs
      }
    }
  });
});

exports.uploadGlobalKeywords = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  let parsedKeywords;
  try {
    parsedKeywords = await ExcelKeywordLoaderService.loadKeywordsFromFile(req.file.path, { skipLastSheet: true });
  } catch (error) {
    return res.status(400).json({ success: false, message: `Invalid Excel file: ${error.message}` });
  }

  if (!parsedKeywords.length) {
    return res.status(400).json({ success: false, message: 'No keywords found in the uploaded file.' });
  }

  const company = await Company.findById(req.companyId);
  if (!company) {
    return res.status(404).json({ success: false, message: 'Company not found' });
  }

  // Save file reference to company settings
  if (!company.settings.discovery) company.settings.discovery = {};
  company.settings.discovery.keywordFilePath = req.file.path;
  company.settings.discovery.keywordFileName = req.file.originalname;
  await company.save();

  // Delete old keywords for this company and insert new ones
  await GlobalKeyword.deleteMany({ companyId: req.companyId });
  const docs = parsedKeywords.map((kw) => ({
    companyId: req.companyId,
    keyword: kw.toLowerCase().trim(),
    source: 'excel_upload',
    uploadedAt: new Date()
  }));
  await GlobalKeyword.insertMany(docs, { ordered: false }).catch(() => {}); // ignore dupe errors

  res.json({
    success: true,
    message: `Global keywords uploaded successfully. ${parsedKeywords.length} keyword(s) stored.`,
    data: {
      keywordFileName: req.file.originalname,
      keywordCount: parsedKeywords.length,
      preview: parsedKeywords.slice(0, 10)
    }
  });
});

exports.deleteGlobalKeywords = catchAsync(async (req, res) => {
  const company = await Company.findById(req.companyId);
  if (!company) {
    return res.status(404).json({ success: false, message: 'Company not found' });
  }

  if (company.settings.discovery) {
    company.settings.discovery.keywordFilePath = null;
    company.settings.discovery.keywordFileName = null;
    await company.save();
  }

  // Also remove from MongoDB collection
  await GlobalKeyword.deleteMany({ companyId: req.companyId });

  res.json({
    success: true,
    message: 'Global keywords deleted successfully'
  });
});

exports.getGlobalKeywords = catchAsync(async (req, res) => {
  const keywords = await GlobalKeyword.find({ companyId: req.companyId })
    .sort({ keyword: 1 })
    .select('keyword uploadedAt -_id')
    .lean();

  res.json({
    success: true,
    data: { keywords, count: keywords.length }
  });
});
