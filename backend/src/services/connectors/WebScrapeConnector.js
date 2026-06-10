const axios = require('axios');
const BaseConnector = require('./BaseConnector');

function extractLinksFromHtml(html, selectorHint = 'a[href]') {
  const links = [];
  const hrefRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)</gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    const text = (match[2] || '').trim();
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) continue;
    links.push({ href, text });
  }

  if (selectorHint && selectorHint !== 'a[href]') {
    const className = selectorHint.replace(/.*\.([a-zA-Z0-9_-]+).*/, '$1');
    if (className && className !== selectorHint) {
      return links.filter(
        (link) => link.href.includes(className) || link.text.toLowerCase().includes(className)
      );
    }
  }

  return links.slice(0, 50);
}

class WebScrapeConnector extends BaseConnector {
  constructor() {
    super('web_scrape', 'Web scraping');
  }

  validateConfig(config = {}) {
    if (!config.searchUrl && !config.baseUrl) {
      throw new Error('Web scrape connector requires searchUrl or portal URL');
    }
  }

  async discover({ config = {}, limit = 25 }) {
    this.validateConfig(config);

    const targetUrl = config.searchUrl || config.baseUrl;
    const response = await axios.get(targetUrl, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Tender360-DiscoveryBot/1.0',
        Accept: 'text/html,application/xhtml+xml'
      },
      validateStatus: (status) => status < 500
    });

    if (response.status >= 400) {
      throw new Error(`Failed to fetch portal page (${response.status})`);
    }

    const html = String(response.data || '');
    const links = extractLinksFromHtml(html, config.itemLinkSelector);
    const keywords = (config.keywords || []).map((k) => k.toLowerCase());

    const opportunities = links
      .filter((link) => {
        if (!keywords.length) return true;
        const haystack = `${link.href} ${link.text}`.toLowerCase();
        return keywords.some((kw) => haystack.includes(kw));
      })
      .slice(0, limit)
      .map((link, index) => {
        const absoluteUrl = link.href.startsWith('http')
          ? link.href
          : new URL(link.href, targetUrl).toString();
        return this.normalizeOpportunity(
          {
            externalId: absoluteUrl,
            reference: `SCRAPE-${Date.now()}-${index}`,
            title: link.text || `Opportunity ${index + 1}`,
            description: `Discovered via web scrape from ${targetUrl}`,
            organization: config.sourceName || 'Web portal'
          },
          { name: config.sourceName || 'Web scrape' }
        );
      });

    return {
      opportunities,
      nextCursor: null,
      logs: [
        {
          level: 'info',
          message: `Web scrape parsed ${opportunities.length} links from ${targetUrl}`
        },
        {
          level: 'info',
          message:
            'Interactive login automation is not enabled; configure public listing URLs or use API mode for authenticated portals.'
        }
      ]
    };
  }

  async testConnection({ config = {} }) {
    this.validateConfig(config);
    const loginUrl = config.loginUrl || config.searchUrl || config.baseUrl;
    const response = await axios.get(loginUrl, {
      timeout: 15000,
      headers: { 'User-Agent': 'Tender360-DiscoveryBot/1.0' },
      validateStatus: (status) => status < 500
    });

    if (response.status >= 400) {
      throw new Error(`Portal unreachable (${response.status})`);
    }

    return {
      ok: true,
      message: `Portal reachable (${response.status}). Saved credentials will be used when session-based automation is enabled.`,
      statusCode: response.status
    };
  }
}

module.exports = WebScrapeConnector;
