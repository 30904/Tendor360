/**
 * Local test — WebScrapeConnector detail-page following (no API server required).
 *
 * Usage:
 *   node scripts/test-web-scrape-detail.js
 *
 * Env overrides:
 *   SEARCH_URL=https://books.toscrape.com/
 *   ITEM_LINK_SELECTOR=article.product_pod h3 a
 *   KEYWORDS=pain,travel
 *   LIMIT=3
 *   FOLLOW_DETAIL_LINKS=true
 *   DETAIL_DELAY_MS=500
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const WebScrapeConnector = require('../src/services/connectors/WebScrapeConnector');

function envBool(name, defaultValue) {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  return String(raw).toLowerCase() === 'true' || raw === '1';
}

async function run() {
  const config = {
    searchUrl: process.env.SEARCH_URL || 'https://books.toscrape.com/',
    itemLinkSelector: process.env.ITEM_LINK_SELECTOR || 'article.product_pod h3 a',
    keywords: (process.env.KEYWORDS || 'pain,travel,science')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean),
    followDetailLinks: envBool('FOLLOW_DETAIL_LINKS', true),
    detailPageTimeoutMs: Number(process.env.DETAIL_PAGE_TIMEOUT_MS || 30000),
    detailDelayMs: Number(process.env.DETAIL_DELAY_MS || 300),
    skipDetailKeywordRecheck: envBool('SKIP_DETAIL_KEYWORD_RECHECK', false),
    sourceName: 'Local detail scrape test'
  };

  const limit = Number(process.env.LIMIT || 3);
  const connector = new WebScrapeConnector();

  console.log('Web scrape detail-page test');
  console.log('Search URL:', config.searchUrl);
  console.log('Link selector:', config.itemLinkSelector);
  console.log('Keywords:', config.keywords.join(', ') || '(none)');
  console.log('Follow detail links:', config.followDetailLinks);
  console.log('Limit:', limit);
  console.log('---');

  const result = await connector.discover({ config, limit });

  console.log('Opportunities:', result.opportunities.length);
  console.log('--- Job logs ---');
  for (const entry of result.logs || []) {
    console.log(`[${entry.level}] ${entry.message}`);
  }

  if (result.opportunities.length) {
    console.log('--- First opportunity ---');
    const first = result.opportunities[0];
    console.log('Title:', first.title);
    console.log('External ID:', first.externalId);
    console.log('Description preview:', (first.description || '').slice(0, 300).replace(/\s+/g, ' '));
    const placeholder = `Discovered via web scrape from ${config.searchUrl}`;
    if ((first.description || '').startsWith('Discovered via web scrape from')) {
      console.warn('WARN: Description still looks like listing-only placeholder.');
    } else {
      console.log('PASS: Detail page content appears in description.');
    }
  } else {
    console.log('WARN: No opportunities returned (try broader KEYWORDS or higher LIMIT).');
  }
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
