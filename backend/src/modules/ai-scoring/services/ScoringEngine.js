const Tender = require('../../../models/Tender');
const ScoringProfile = require('../models/ScoringProfile');
const ScoringRule = require('../models/ScoringRule');
const OpportunityScore = require('../models/OpportunityScore');
const aiOrchestrator = require('../../ai-core/AiOrchestrator');

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function deriveHeuristicDimensions(tender) {
  const relevancy = clampScore(tender.aiMatchScore || tender.winProbability || 50);
  const productFit = clampScore((tender.requirements?.technical?.length || 0) * 8 + 40);
  const customerFit = clampScore(tender.winProbability || 50);
  const strategic = clampScore(
    tender.priority === 'critical' ? 90 : tender.priority === 'high' ? 75 : 55
  );
  const risk = clampScore(
    tender.urgency === 'critical' ? 80 : tender.urgency === 'high' ? 65 : 40
  );
  const confidence = clampScore(55 + (tender.aiMatchScore || 0) * 0.3);

  return { relevancy, product_fit: productFit, customer_fit: customerFit, strategic, risk, confidence };
}

function compositeFromDimensions(dimensions, rules = []) {
  if (!rules.length) {
    const values = Object.values(dimensions);
    return clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
  }

  let weighted = 0;
  let totalWeight = 0;
  for (const rule of rules) {
    if (!rule.enabled) continue;
    const value = dimensions[rule.dimension] ?? 0;
    weighted += value * (rule.weight || 0);
    totalWeight += rule.weight || 0;
  }

  return totalWeight > 0 ? clampScore(weighted / totalWeight) : 0;
}

function recommendationFromScore(score, profile) {
  if (score >= profile.thresholds.pursue) return 'pursue';
  if (score <= profile.thresholds.decline) return 'decline';
  return 'review';
}

class ScoringEngine {
  async ensureDefaultProfile(companyId) {
    let profile = await ScoringProfile.findOne({ companyId, isDefault: true, isDeleted: false });
    if (!profile) {
      profile = await ScoringProfile.create({
        companyId,
        name: 'Default AI scoring profile',
        description: 'Baseline relevancy and fit scoring',
        isDefault: true
      });
    }
    return profile;
  }

  async scoreOpportunity(companyId, tenderId, { profileId } = {}) {
    const tender = await Tender.findOne({ _id: tenderId, companyId, isDeleted: false });
    if (!tender) {
      throw new Error('Opportunity not found');
    }

    const profile = profileId
      ? await ScoringProfile.findOne({ _id: profileId, companyId, isDeleted: false })
      : await this.ensureDefaultProfile(companyId);

    if (!profile) {
      throw new Error('Scoring profile not found');
    }

    const rules = await ScoringRule.find({
      companyId,
      profileId: profile._id,
      isDeleted: false,
      enabled: true
    }).lean();

    const dimensions = deriveHeuristicDimensions(tender);
    const aiSummary = await aiOrchestrator.summarize({
      title: tender.title,
      organization: tender.organization,
      description: tender.description,
      estimatedValue: tender.estimatedValue
    });

    if (aiSummary?.classification?.relevancy != null) {
      dimensions.relevancy = clampScore(aiSummary.classification.relevancy);
    }

    const compositeScore = compositeFromDimensions(dimensions, rules);
    const recommendation = recommendationFromScore(compositeScore, profile);

    const scoreDoc = await OpportunityScore.findOneAndUpdate(
      { companyId, tenderId },
      {
        companyId,
        tenderId,
        profileId: profile._id,
        dimensions,
        compositeScore,
        recommendation,
        rationale: aiSummary?.summary || 'Heuristic scoring applied from opportunity metadata.',
        modelProvider: aiSummary?.provider || 'heuristic'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    tender.aiMatchScore = compositeScore;
    await tender.save();

    return scoreDoc;
  }

  async listScores(companyId, { limit = 20 } = {}) {
    return OpportunityScore.find({ companyId, isDeleted: false })
      .sort({ compositeScore: -1, updatedAt: -1 })
      .limit(limit)
      .populate('tenderId', 'title reference organization deadline estimatedValue')
      .lean();
  }
}

module.exports = new ScoringEngine();
