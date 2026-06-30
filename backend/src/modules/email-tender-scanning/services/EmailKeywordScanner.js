const Watchlist = require('../../../models/Watchlist');
const TenderSource = require('../../../models/TenderSource');
const GlobalKeyword = require('../../../models/GlobalKeyword');
const { loadExcelKeywordsForCompany } = require('../../tender-discovery/services/ExcelKeywordLoaderService');
const { extractTextFromAttachment, truncateText } = require('./AttachmentTextExtractor');

function normalizeKeyword(value) {
  return String(value || '').trim().toLowerCase();
}

async function loadKeywordsForCompany(companyId, extraKeywords = []) {
  const [watchlists, emailSources, globalKws, excelKeywordResult] = await Promise.all([
    Watchlist.find({ companyId, status: 'active', isDeleted: false }).select('keywords').lean(),
    TenderSource.find({
      companyId,
      connectorTemplate: 'email',
      status: 'active',
      isDeleted: false
    })
      .select('keywords')
      .lean(),
    GlobalKeyword.find({ companyId }).select('keyword -_id').lean(),
    loadExcelKeywordsForCompany(companyId)
  ]);

  const set = new Set();
  watchlists.forEach((w) => (w.keywords || []).forEach((k) => set.add(normalizeKeyword(k))));
  emailSources.forEach((s) => (s.keywords || []).forEach((k) => set.add(normalizeKeyword(k))));
  extraKeywords.forEach((k) => set.add(normalizeKeyword(k)));
  globalKws.forEach((g) => set.add(normalizeKeyword(g.keyword)));
  excelKeywordResult.keywords.forEach((k) => set.add(normalizeKeyword(k)));

  if (excelKeywordResult.loadedFrom.length) {
    console.log(
      `ATS-002: Loaded ${excelKeywordResult.keywords.length} Excel keyword(s) for company ${companyId} from ${excelKeywordResult.loadedFrom.length} file(s)`
    );
  }

  return {
    keywords: [...set].filter(Boolean),
    excelKeywordCount: excelKeywordResult.keywords.length,
    excelSources: excelKeywordResult.loadedFrom
  };
}

function scanText(text = '', keywords = []) {
  const lower = String(text).toLowerCase();
  const hits = keywords.filter((k) => k && lower.includes(k));
  return { hits, matched: hits.length > 0, score: hits.length };
}

function scanTextWithOffsets(text = '', keywords = []) {
  const lower = String(text).toLowerCase();
  const hits = [];
  const matchedKeywords = [];

  for (const keyword of keywords) {
    if (!keyword) continue;
    const offset = lower.indexOf(keyword);
    if (offset === -1) continue;
    if (!hits.includes(keyword)) hits.push(keyword);
    matchedKeywords.push({ keyword, offset });
  }

  return {
    hits,
    matchedKeywords,
    matched: hits.length > 0,
    score: hits.length
  };
}

function decodeAttachmentBuffer(att) {
  if (att.contentBuffer && Buffer.isBuffer(att.contentBuffer)) {
    return att.contentBuffer;
  }
  if (att.contentBase64) {
    return Buffer.from(att.contentBase64, 'base64');
  }
  return null;
}

async function resolveAttachmentText(att) {
  if (att.isImage) return '';

  const existing = String(att.textContent || '').trim();
  if (existing) return existing;

  const buffer = decodeAttachmentBuffer(att);
  if (!buffer) return '';

  const filename = att.name || att.filename || 'attachment';
  const contentType = att.contentType || 'application/octet-stream';

  try {
    const extracted = await extractTextFromAttachment({ buffer, contentType, filename });
    return truncateText(extracted);
  } catch (error) {
    console.warn(`ATS-003: Failed to extract text from ${filename}: ${error.message}`);
    return '';
  }
}

async function scanAttachments(attachments = [], keywords = []) {
  const allHits = [];
  const attachmentMatches = [];
  const scanned = [];

  for (const att of attachments) {
    const filename = att.name || att.filename || 'attachment';

    if (att.isImage) {
      scanned.push({ ...att, scanned: false, keywordHits: [], imageExcluded: true });
      continue;
    }

    const text = await resolveAttachmentText(att);
    const { hits, matchedKeywords } = scanTextWithOffsets(text, keywords);
    hits.forEach((h) => {
      if (!allHits.includes(h)) allHits.push(h);
    });

    if (matchedKeywords.length) {
      attachmentMatches.push({ filename, matchedKeywords });
    }

    scanned.push({
      ...att,
      name: filename,
      textContent: text,
      scanned: true,
      keywordHits: hits,
      extractionFailed: !text && Boolean(decodeAttachmentBuffer(att))
    });
  }

  return {
    attachments: scanned,
    hits: allHits,
    attachmentMatches,
    matched: allHits.length > 0
  };
}

module.exports = {
  loadKeywordsForCompany,
  scanText,
  scanTextWithOffsets,
  scanAttachments
};
