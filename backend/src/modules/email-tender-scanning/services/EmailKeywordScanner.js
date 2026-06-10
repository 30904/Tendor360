const Watchlist = require('../../../models/Watchlist');
const TenderSource = require('../../../models/TenderSource');

function normalizeKeyword(value) {
  return String(value || '').trim().toLowerCase();
}

async function loadKeywordsForCompany(companyId, extraKeywords = []) {
  const [watchlists, emailSources] = await Promise.all([
    Watchlist.find({ companyId, status: 'active', isDeleted: false }).select('keywords').lean(),
    TenderSource.find({
      companyId,
      connectorTemplate: 'email',
      status: 'active',
      isDeleted: false
    })
      .select('keywords')
      .lean()
  ]);

  const set = new Set();
  watchlists.forEach((w) => (w.keywords || []).forEach((k) => set.add(normalizeKeyword(k))));
  emailSources.forEach((s) => (s.keywords || []).forEach((k) => set.add(normalizeKeyword(k))));
  extraKeywords.forEach((k) => set.add(normalizeKeyword(k)));

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
