const Tender = require('../../../models/Tender');
const Evaluation = require('../../../models/Evaluation');
const Document = require('../../../models/Document');
const OpportunityScore = require('../../ai-scoring/models/OpportunityScore');
const GoNoGoReview = require('../../go-no-go/models/GoNoGoReview');
const DecisionHistory = require('../../go-no-go/models/DecisionHistory');
const ExtractionResult = require('../../document-intelligence/models/ExtractionResult');
const ClauseExtraction = require('../../document-intelligence/models/ClauseExtraction');
const DocumentExtraction = require('../../document-intelligence/models/DocumentExtraction');
const aiOrchestrator = require('../../ai-core/AiOrchestrator');

function buildCrmIntelligence(tender) {
  const validation = tender.crmValidation;
  if (validation?.snapshot) {
    const snap = validation.snapshot;
    return {
      matchedAccount: validation.matchedAccountName || snap.name,
      division: snap.division,
      relationshipStatus: snap.relationshipStatus,
      historicalRevenue: snap.historicalRevenue || 0,
      previousContracts: snap.previousContracts || 0,
      opportunityHistory: snap.opportunityHistory,
      validationStatus: validation.status,
      matchScore: validation.matchScore,
      matchMethod: validation.matchMethod,
      salesforceAccountId: validation.salesforceAccountId,
      validatedAt: validation.validatedAt
    };
  }

  const organization = String(tender.organization || '').toLowerCase();
  const profiles = [
    {
      match: /veterans|va |defense|army|navy|dod/,
      account: 'US Federal Health Accounts',
      division: 'Government & Defense Medical',
      relationshipStatus: 'Strategic',
      historicalRevenue: 18400000,
      previousContracts: 6
    },
    {
      match: /university|institute|school of medicine/,
      account: 'Academic Research Consortium',
      division: 'University & Core Facilities',
      relationshipStatus: 'Developing',
      historicalRevenue: 4200000,
      previousContracts: 2
    },
    {
      match: /hospital|clinic|healthcare|health system/,
      account: 'Integrated Delivery Network',
      division: 'Healthcare Diagnostics',
      relationshipStatus: 'Active',
      historicalRevenue: 9600000,
      previousContracts: 4
    },
    {
      match: /cdc|nih|fda|public health|hhs/,
      account: 'Public Health Agencies',
      division: 'Public Sector Life Sciences',
      relationshipStatus: 'Strategic',
      historicalRevenue: 22100000,
      previousContracts: 8
    }
  ];

  const profile = profiles.find((item) => item.match.test(organization)) || {
    account: tender.organization,
    division: 'Life Sciences Pursuit',
    relationshipStatus: 'Prospect',
    historicalRevenue: 0,
    previousContracts: 0
  };

  return {
    matchedAccount: profile.account,
    division: profile.division,
    relationshipStatus: profile.relationshipStatus,
    historicalRevenue: profile.historicalRevenue,
    previousContracts: profile.previousContracts,
    opportunityHistory: `${profile.previousContracts} prior awards in adjacent laboratory programs.`,
    validationStatus: 'heuristic',
    matchMethod: 'heuristic'
  };
}

class WorkspaceAggregationService {
  async getWorkspace(companyId, tenderId) {
    const tender = await Tender.findOne({ _id: tenderId, companyId, isDeleted: false })
      .populate('owner', 'name email')
      .populate('assignedTo', 'name email')
      .lean();

    if (!tender) {
      throw new Error('Opportunity not found');
    }

    const [score, evaluation, goNoGo, documents] = await Promise.all([
      OpportunityScore.findOne({ companyId, tenderId, isDeleted: false }).lean(),
      Evaluation.findOne({ companyId, tenderId }).lean(),
      GoNoGoReview.findOne({ companyId, tenderId, isDeleted: false }).lean(),
      Document.find({ companyId, 'tenderRecord.tenderId': tenderId }).limit(20).lean()
    ]);

    const decisionHistory = goNoGo
      ? await DecisionHistory.find({ companyId, reviewId: goNoGo._id })
          .sort({ createdAt: -1 })
          .limit(20)
          .populate('actorId', 'name email')
          .lean()
      : [];

    const extractions = await DocumentExtraction.find({ companyId, tenderId }).limit(5).lean();
    const extractionIds = extractions.map((item) => item._id);
    const [extractedFields, extractedClauses] = await Promise.all([
      ExtractionResult.find({ companyId, extractionId: { $in: extractionIds } }).lean(),
      ClauseExtraction.find({ companyId, extractionId: { $in: extractionIds } }).lean()
    ]);

    const aiSummary = await aiOrchestrator.summarize({
      title: tender.title,
      organization: tender.organization,
      location: tender.location,
      description: tender.description,
      estimatedValue: tender.estimatedValue
    });

    const timeline = [
      { label: 'Discovery', at: tender.discovery?.importedAt || tender.publishedDate || tender.createdAt, status: 'complete' },
      { label: 'Document extraction', at: extractions[0]?.completedAt, status: extractions.length ? 'complete' : 'pending' },
      { label: 'Qualification', at: evaluation?.updatedAt, status: evaluation ? 'complete' : 'active' },
      { label: 'AI scoring', at: score?.updatedAt, status: score ? 'complete' : 'pending' },
      { label: 'Go / No-Go', at: goNoGo?.updatedAt, status: goNoGo?.status || 'pending' },
      { label: 'Assignment activity', at: tender.updatedAt, status: tender.assignedTo ? 'complete' : 'pending' },
      { label: 'Submission deadline', at: tender.deadline, status: 'upcoming' }
    ];

    const confidenceScore = score?.dimensions?.confidence || tender.aiMatchScore || 0;
    const riskScore = score?.dimensions?.risk || 0;

    return {
      opportunity: tender,
      aiSummary,
      score,
      qualification: evaluation,
      goNoGo,
      documents,
      decisionHistory,
      crmIntelligence: buildCrmIntelligence(tender),
      intelligenceMeters: {
        aiConfidence: confidenceScore,
        riskScore,
        qualificationScore: score?.compositeScore || tender.aiMatchScore || 0,
        strategicFit: score?.dimensions?.strategic || score?.dimensions?.product_fit || 0,
        urgency: tender.urgency || 'medium'
      },
      contacts: {
        owner: tender.owner,
        assignedTo: tender.assignedTo
      },
      risks: [
        {
          label: 'Deadline proximity',
          level: tender.urgency || 'medium',
          detail: `Deadline on ${new Date(tender.deadline).toISOString()}`
        },
        {
          label: 'Commercial exposure',
          level: tender.priority === 'critical' ? 'high' : 'medium',
          detail: `Estimated value ${tender.estimatedValue} ${tender.currency || 'USD'}`
        },
        ...extractedClauses
          .filter((clause) => clause.riskLevel === 'high' || clause.riskLevel === 'critical')
          .slice(0, 2)
          .map((clause) => ({
            label: clause.clauseType,
            level: clause.riskLevel,
            detail: clause.text
          }))
      ],
      recommendations: [
        {
          type: score?.recommendation || 'review',
          message:
            score?.rationale ||
            aiSummary.summary ||
            'Run AI scoring to refine pursuit recommendation.'
        },
        {
          type: goNoGo?.aiRecommendation || 'defer',
          message: goNoGo?.summary || 'No committee decision recorded yet.'
        }
      ],
      scoringBreakdown: score?.dimensions || null,
      extractedFields,
      extractedClauses,
      nextAction:
        score?.recommendation === 'pursue'
          ? 'Advance to proposal planning and assign commercial owner.'
          : score?.recommendation === 'decline'
            ? 'Archive opportunity and capture no-go rationale.'
            : 'Complete qualification review and validate extracted requirements.',
      timeline
    };
  }
}

module.exports = new WorkspaceAggregationService();
