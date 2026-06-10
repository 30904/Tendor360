const URL_REGEX = /https?:\/\/[^\s<>"')\]]+/gi;

function extractLinks(text = '') {
  const matches = String(text).match(URL_REGEX) || [];
  return [...new Set(matches.map((u) => u.replace(/[.,;]+$/, '')))];
}

function buildLinkSections(links = [], keywordHits = [], bodyMatched = false) {
  const hitSet = new Set(keywordHits.map((k) => k.toLowerCase()));
  return links.map((url, index) => {
    const lower = url.toLowerCase();
    const sectionHits = [...hitSet].filter((k) => lower.includes(k));
    const retained = sectionHits.length > 0 || (bodyMatched && index === 0);
    return {
      url,
      label: `Link ${index + 1}`,
      retained,
      rejectReason: retained ? null : 'No keyword match in link context (ATS-004)',
      keywordHits: sectionHits
    };
  });
}

module.exports = { extractLinks, buildLinkSections };
