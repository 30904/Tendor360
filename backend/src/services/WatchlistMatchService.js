const Tender = require('../models/Tender');
const { webhookDeliveryService } = require('../modules/integrations/services/WebhookDeliveryService');

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeKeyword(value) {
  return String(value || '').trim().toLowerCase();
}

function buildSearchableText(tender) {
  return [
    tender.title,
    tender.description,
    tender.organization,
    tender.location,
    ...(tender.tags || [])
  ]
    .join(' ')
    .toLowerCase();
}

function buildTenderQuery(watchlist) {
  const now = new Date();
  const deadlineMin = new Date(now);
  deadlineMin.setDate(deadlineMin.getDate() - (watchlist.daysBehind ?? 7));
  const deadlineMax = new Date(now);
  deadlineMax.setDate(deadlineMax.getDate() + (watchlist.daysAhead ?? 30));

  const filter = {
    companyId: watchlist.companyId,
    isDeleted: false,
    status: 'active',
    deadline: { $gte: deadlineMin, $lte: deadlineMax }
  };

  if (watchlist.minValue > 0) {
    filter.estimatedValue = { $gte: watchlist.minValue };
  }
  if (watchlist.maxValue != null && watchlist.maxValue > 0) {
    filter.estimatedValue = {
      ...(filter.estimatedValue || {}),
      $lte: watchlist.maxValue
    };
  }
  if (watchlist.currency) {
    filter.currency = watchlist.currency;
  }
  if (watchlist.tenderTypes?.length) {
    filter.tenderType = { $in: watchlist.tenderTypes };
  }
  if (watchlist.therapeuticAreas?.length) {
    filter.therapeuticArea = { $in: watchlist.therapeuticAreas };
  }

  const andConditions = [];

  if (watchlist.organizations?.length) {
    andConditions.push({
      $or: watchlist.organizations.map((org) => ({
        organization: { $regex: escapeRegex(org), $options: 'i' }
      }))
    });
  }

  if (watchlist.regions?.length) {
    andConditions.push({
      $or: watchlist.regions.map((region) => ({
        location: { $regex: escapeRegex(region), $options: 'i' }
      }))
    });
  }

  if (watchlist.excludeOrganizations?.length) {
    for (const org of watchlist.excludeOrganizations) {
      andConditions.push({
        organization: { $not: { $regex: escapeRegex(org), $options: 'i' } }
      });
    }
  }

  if (andConditions.length) {
    filter.$and = andConditions;
  }

  return filter;
}

function scoreTenderMatch(tender, watchlist) {
  const keywords = (watchlist.keywords || []).map(normalizeKeyword).filter(Boolean);
  if (!keywords.length) {
    return null;
  }

  const text = buildSearchableText(tender);
  const matchedKeywords = keywords.filter((keyword) => text.includes(keyword));
  if (!matchedKeywords.length) {
    return null;
  }

  if (watchlist.categories?.length) {
    const categoryText = text;
    const hasCategory = watchlist.categories.some((category) =>
      categoryText.includes(String(category).toLowerCase())
    );
    if (!hasCategory) {
      return null;
    }
  }

  if (watchlist.sectors?.length) {
    const hasSector = watchlist.sectors.some((sector) =>
      text.includes(String(sector).toLowerCase())
    );
    if (!hasSector) {
      return null;
    }
  }

  const matchedCategories = (watchlist.categories || []).filter((category) =>
    text.includes(String(category).toLowerCase())
  );

  return {
    tenderId: tender._id,
    matchScore: Math.min(100, Math.round((matchedKeywords.length / keywords.length) * 100)),
    matchedKeywords,
    matchedCategories
  };
}

async function executeWatchlistRun(watchlist) {
  const filter = buildTenderQuery(watchlist);
  const candidates = await Tender.find(filter)
    .select('title description organization location tags estimatedValue deadline therapeuticArea tenderType')
    .lean();

  const existingAlertIds = new Set(
    (watchlist.alerts || []).map((alert) => String(alert.tenderId))
  );

  const scoredMatches = candidates
    .map((tender) => scoreTenderMatch(tender, watchlist))
    .filter(Boolean);

  const newMatches = scoredMatches.filter(
    (match) => !existingAlertIds.has(String(match.tenderId))
  );

  for (const match of newMatches) {
    watchlist.alerts.push({
      tenderId: match.tenderId,
      matchScore: match.matchScore,
      matchedKeywords: match.matchedKeywords,
      matchedCategories: match.matchedCategories,
      alertType: 'new_match',
      sentAt: new Date()
    });
  }

  if (newMatches.length > 0) {
    watchlist.totalAlerts += newMatches.length;
    watchlist.lastAlert = new Date();
  }

  await watchlist.updateRunStatus(true, newMatches.length);

  for (const match of newMatches) {
    webhookDeliveryService.emitAsync(watchlist.companyId, 'watchlist.match', {
      watchlistId: String(watchlist._id),
      watchlistName: watchlist.name,
      tenderId: String(match.tenderId),
      matchScore: match.matchScore,
      matchedKeywords: match.matchedKeywords,
      matchedCategories: match.matchedCategories
    });
  }

  return {
    success: true,
    matchesFound: newMatches.length,
    totalScanned: candidates.length,
    matchedTenders: newMatches.map((match) => ({
      tenderId: match.tenderId,
      matchScore: match.matchScore,
      matchedKeywords: match.matchedKeywords,
      matchedCategories: match.matchedCategories
    }))
  };
}

module.exports = {
  executeWatchlistRun,
  buildTenderQuery,
  scoreTenderMatch
};
