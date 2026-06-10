const Watchlist = require('../../../models/Watchlist');
const TenderSource = require('../../../models/TenderSource');
const GlobalKeyword = require('../../../models/GlobalKeyword');

function normalizeKeyword(value) {
  return String(value || '').trim().toLowerCase();
}

async function loadKeywordsForCompany(companyId, extraKeywords = []) {
  const [watchlists, emailSources, globalKws] = await Promise.all([
    Watchlist.find({ companyId, status: 'active', isDeleted: false }).select('keywords').lean(),
    TenderSource.find({
      companyId,
      connectorTemplate: 'email',
      status: 'active',
      isDeleted: false
    })
      .select('keywords')
      .lean(),
    // Load from MongoDB GlobalKeyword collection instead of from disk
    GlobalKeyword.find({ companyId }).select('keyword -_id').lean()
  ]);

  const set = new Set();
  watchlists.forEach((w) => (w.keywords || []).forEach((k) => set.add(normalizeKeyword(k))));
  emailSources.forEach((s) => (s.keywords || []).forEach((k) => set.add(normalizeKeyword(k))));
  extraKeywords.forEach((k) => set.add(normalizeKeyword(k)));
  globalKws.forEach((g) => set.add(normalizeKeyword(g.keyword)));

  return [...set].filter(Boolean);
}

function scanText(text = '', keywords = []) {
  const lower = String(text).toLowerCase();
  const hits = keywords.filter((k) => k && lower.includes(k));
  return { hits, matched: hits.length > 0, score: hits.length };
}

function scanAttachments(attachments = [], keywords = []) {
  const allHits = [];
  const scanned = attachments.map((att) => {
    if (att.isImage) {
      return { ...att, scanned: false, keywordHits: [], imageExcluded: true };
    }
    const text = att.textContent || '';
    const { hits } = scanText(text, keywords);
    hits.forEach((h) => {
      if (!allHits.includes(h)) allHits.push(h);
    });
    return { ...att, scanned: true, keywordHits: hits };
  });
  return { attachments: scanned, hits: allHits, matched: allHits.length > 0 };
}

module.exports = {
  loadKeywordsForCompany,
  scanText,
  scanAttachments
};
