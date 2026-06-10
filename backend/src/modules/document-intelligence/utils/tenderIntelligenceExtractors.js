/**
 * Heuristic extractors for TB-007–TB-009 (attachment text).
 * Production deployments should augment with AI/table parsers.
 */

function extractShipTo(text) {
  const patterns = [
    /ship\s*[- ]?to[:\s]+([^\n]{10,120})/i,
    /place\s+of\s+(?:delivery|performance)[:\s]+([^\n]{10,120})/i,
    /deliver(?:y)?\s+address[:\s]+([^\n]{10,120})/i
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return m[1].trim();
  }
  const zipCity = text.match(/\b([A-Za-z .]+,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?)\b/);
  return zipCity ? zipCity[1].trim() : '';
}

function extractScope(text) {
  const m = text.match(/(?:scope\s+of\s+(?:work|supply)|statement\s+of\s+work)[:\s]+([^\n]{20,500})/i);
  if (m) return m[1].trim().slice(0, 500);
  const para = text.split(/\n{2,}/).find((p) => /shall|provide|supply|install/i.test(p) && p.length > 40);
  return para ? para.trim().slice(0, 400) : '';
}

function extractQuantities(text) {
  const matches = text.match(/\b(\d{1,6})\s*(?:ea|each|units?|qty|quantity)\b/gi) || [];
  return [...new Set(matches.map((m) => m.trim()))].slice(0, 10);
}

function extractSkus(text) {
  const catalog = text.match(/\b(?:SKU|CAT|ITEM|MPN)[#:\s-]*([A-Z0-9][-A-Z0-9]{3,18})\b/gi) || [];
  const part = text.match(/\bPart\s*#?\s*([A-Z0-9][-A-Z0-9]{3,18})\b/gi) || [];
  return [...new Set([...catalog, ...part].map((m) => m.replace(/^(SKU|CAT|ITEM|MPN)/i, '').trim()))].slice(0, 15);
}

function extractCommercialFields(text) {
  return {
    shipTo: extractShipTo(text),
    quantity: extractQuantities(text),
    scope: extractScope(text),
    skus: extractSkus(text)
  };
}

function extractTermsFields(text) {
  const insurance = [];
  const freight = [];
  const pricingTerms = [];
  const chunks = text.split(/\n+/);

  chunks.forEach((line) => {
    const t = line.trim();
    if (/insurance|liability|coverage|occurrence/i.test(t) && t.length > 20) insurance.push(t.slice(0, 300));
    if (/freight|fob|incoterm|shipping|delivery\s+terms/i.test(t) && t.length > 15) freight.push(t.slice(0, 300));
    if (/payment|net\s+\d+|pricing|escalat|firm\s+price/i.test(t) && t.length > 15) pricingTerms.push(t.slice(0, 300));
  });

  return {
    insurance: insurance.slice(0, 5),
    freight: freight.slice(0, 5),
    pricingTerms: pricingTerms.slice(0, 5)
  };
}

function extractPricingLineItems(text) {
  const lines = [];
  const rowRe =
    /(\d+)\s+(?:ea|each|units?)?\s*[,|\t]\s*([A-Za-z0-9 .\-/]{3,40})\s*[,|\t]\s*([A-Za-z0-9 .\-/]{8,80})/gi;
  let m;
  while ((m = rowRe.exec(text)) !== null && lines.length < 25) {
    lines.push({
      quantity: Number(m[1]),
      uom: 'EA',
      description: m[3].trim()
    });
  }

  if (!lines.length) {
    const simple = text.match(/(\d+)\s*x\s*([^\n]{10,80})/gi) || [];
    simple.slice(0, 10).forEach((row) => {
      const parts = row.split(/\s*x\s*/i);
      if (parts.length >= 2) {
        lines.push({
          quantity: Number(parts[0]) || 1,
          uom: 'EA',
          description: parts[1].trim()
        });
      }
    });
  }

  return lines;
}

module.exports = {
  extractCommercialFields,
  extractTermsFields,
  extractPricingLineItems,
  extractShipTo,
  extractScope,
  extractQuantities,
  extractSkus
};
