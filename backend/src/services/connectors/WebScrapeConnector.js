const { chromium } = require('playwright');
const BaseConnector = require('./BaseConnector');
const { loadKeywordsFromFile } = require('../../modules/tender-discovery/services/ExcelKeywordLoaderService');

const MAX_DETAIL_BODY_CHARS = 8000;
const DEFAULT_DETAIL_TIMEOUT_MS = 30000;
const DEFAULT_DETAIL_DELAY_MS = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeKeywords(keywords = []) {
  return [...new Set((keywords || []).map((k) => String(k).toLowerCase().trim()).filter(Boolean))];
}

function matchesKeywords(text = '', keywords = []) {
  if (!keywords.length) return true;
  const haystack = String(text).toLowerCase();
  return keywords.some((kw) => haystack.includes(kw));
}

function pickTitle(anchorText = '', detailTitle = '') {
  const anchor = String(anchorText || '').trim();
  const detail = String(detailTitle || '').trim();
  if (!detail) return anchor || 'Opportunity';
  if (!anchor || anchor.length < 10) return detail;
  if (detail.length > anchor.length) return detail;
  return anchor;
}

function dedupeLinks(links = []) {
  const seen = new Set();
  return links.filter((link) => {
    const href = String(link.href || '').trim();
    if (!href || seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}

class WebScrapeConnector extends BaseConnector {
  constructor() {
    super('web_scrape', 'Web scraping');
  }

  validateConfig(config = {}) {
    if (!config.searchUrl && !config.baseUrl && !config.loginUrl) {
      throw new Error('Web scrape connector requires searchUrl, loginUrl or portal URL');
    }
  }

  async _createBrowserContext() {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Tender360-DiscoveryBot/1.0',
      acceptDownloads: true,
      viewport: { width: 1280, height: 720 }
    });
    return { browser, context };
  }

  async _performLogin(page, config) {
    const loginUsername = config.loginUsername || config.username;
    const loginPassword = config.loginPassword || config.password;

    if (!loginUsername || !loginPassword || !config.loginUrl) {
      return false;
    }

    try {
      await page.goto(config.loginUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

      const userSelector =
        config.usernameSelector ||
        'input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]';
      const passSelector =
        config.passwordSelector || 'input[type="password"], input[name*="pass"]';
      const submitSelector =
        config.submitSelector ||
        'button[type="submit"], input[type="submit"], button:has-text("Log In"), button:has-text("Sign In"), button:has-text("Login")';

      await page.waitForSelector(userSelector, { state: 'visible', timeout: 10000 });
      await page.fill(userSelector, loginUsername);
      await page.fill(passSelector, loginPassword);

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}),
        page.click(submitSelector)
      ]);

      return true;
    } catch (e) {
      console.warn(`WebScrapeConnector login failed or timed out: ${e.message}`);
      return false;
    }
  }

  async _collectListingLinks(page, linkSelector) {
    return page.evaluate((sel) => {
      const anchors = Array.from(document.querySelectorAll(sel));
      return anchors
        .map((a) => ({ href: a.href, text: a.innerText.trim() }))
        .filter((a) => a.href && !a.href.startsWith('#') && !a.href.startsWith('javascript:'));
    }, linkSelector);
  }

  async _scrapeDetailContent(page, { titleSelector, bodySelector }) {
    return page.evaluate(
      ({ titleSel, bodySel }) => {
        let title = '';
        if (titleSel) {
          const el = document.querySelector(titleSel);
          if (el) title = (el.innerText || el.textContent || '').trim();
        }
        if (!title) {
          const h1 = document.querySelector('h1');
          title = h1 ? (h1.innerText || h1.textContent || '').trim() : '';
        }
        if (!title) title = (document.title || '').trim();

        let body = '';
        if (bodySel) {
          const el = document.querySelector(bodySel);
          if (el) body = (el.innerText || el.textContent || '').trim();
        }
        if (!body) {
          const fallbackSelectors = ['main', '[role="main"]', '.content', '#content', 'article'];
          for (const sel of fallbackSelectors) {
            const el = document.querySelector(sel);
            const text = el ? (el.innerText || el.textContent || '').trim() : '';
            if (text.length > 100) {
              body = text;
              break;
            }
          }
        }
        if (!body && document.body) {
          body = (document.body.innerText || document.body.textContent || '').trim();
        }

        return { title, body };
      },
      { titleSel: titleSelector || '', bodySel: bodySelector || '' }
    );
  }

  async _followAndScrapeDetail(page, link, config, logs) {
    const detailPageTimeoutMs = Number(config.detailPageTimeoutMs) || DEFAULT_DETAIL_TIMEOUT_MS;
    const detailDelayMs = Number(config.detailDelayMs) || DEFAULT_DETAIL_DELAY_MS;

    logs.push({ level: 'info', message: `Followed link: ${link.href}` });

    if (detailDelayMs > 0) {
      await sleep(detailDelayMs);
    }

    try {
      await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: detailPageTimeoutMs });
      const scraped = await this._scrapeDetailContent(page, {
        titleSelector: config.detailTitleSelector,
        bodySelector: config.detailBodySelector
      });

      const body = String(scraped.body || '').slice(0, MAX_DETAIL_BODY_CHARS);
      const title = String(scraped.title || '').trim();

      logs.push({
        level: 'info',
        message: `Scraped ${body.length} chars from detail page: ${link.href}`
      });

      return { title, body, error: null };
    } catch (error) {
      logs.push({
        level: 'warn',
        message: `Detail page scrape failed for ${link.href}: ${error.message}`
      });
      return { title: '', body: '', error };
    }
  }

  _buildListingOnlyOpportunity(link, index, targetUrl, config) {
    return this.normalizeOpportunity(
      {
        externalId: link.href,
        reference: `SCRAPE-${Date.now()}-${index}`,
        title: link.text || `Opportunity ${index + 1}`,
        description: `Discovered via web scrape from ${targetUrl}`,
        organization: config.sourceName || 'Web portal',
        sourceUrl: link.href
      },
      { name: config.sourceName || 'Web scrape' }
    );
  }

  async getAuthCookies(config) {
    this.validateConfig(config);
    const { browser, context } = await this._createBrowserContext();
    try {
      const page = await context.newPage();
      await this._performLogin(page, config);
      const cookies = await context.cookies();
      return cookies;
    } finally {
      await browser.close();
    }
  }

  async discover({ config = {}, limit = 25 }) {
    this.validateConfig(config);

    const targetUrl = config.searchUrl || config.baseUrl || config.loginUrl;
    const followDetailLinks = config.followDetailLinks !== false;
    const skipDetailKeywordRecheck = config.skipDetailKeywordRecheck === true;
    const startedAt = Date.now();
    const logs = [];

    const { browser, context } = await this._createBrowserContext();

    try {
      const page = await context.newPage();
      const loggedIn = await this._performLogin(page, config);

      if (config.searchUrl) {
        await page.goto(config.searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      }

      const linkSelector = config.itemLinkSelector || 'a[href]';
      await page.waitForSelector(linkSelector, { state: 'attached', timeout: 15000 }).catch(() => {});

      const rawLinks = await this._collectListingLinks(page, linkSelector);
      const links = dedupeLinks(rawLinks);

      let keywords = normalizeKeywords(config.keywords || []);
      let excelKeywordsLoaded = 0;

      if (config.keywordFilePath) {
        try {
          const excelKeywords = loadKeywordsFromFile(config.keywordFilePath);
          keywords = normalizeKeywords([...keywords, ...excelKeywords]);
          excelKeywordsLoaded = excelKeywords.length;
        } catch (err) {
          console.warn(`Failed to load Excel keywords from ${config.keywordFilePath}:`, err.message);
          logs.push({
            level: 'warn',
            message: `Failed to load Excel keywords: ${err.message}`
          });
        }
      }

      const listingCandidates = keywords.length
        ? links.filter((link) => matchesKeywords(`${link.href} ${link.text}`, keywords))
        : links;

      logs.push({
        level: 'info',
        message: `Listing page: ${links.length} link(s), ${listingCandidates.length} candidate(s) after keyword pre-filter`
      });

      const opportunities = [];
      const candidates = listingCandidates.slice(0, limit);

      if (!followDetailLinks) {
        candidates.forEach((link, index) => {
          opportunities.push(this._buildListingOnlyOpportunity(link, index, targetUrl, config));
        });
      } else {
        for (let index = 0; index < candidates.length; index += 1) {
          const link = candidates[index];
          const listingHaystack = `${link.href} ${link.text}`;
          const listingMatch = matchesKeywords(listingHaystack, keywords);

          const detail = await this._followAndScrapeDetail(page, link, config, logs);
          const detailHaystack = `${detail.title} ${detail.body}`;
          const detailMatch = matchesKeywords(detailHaystack, keywords);

          const includeOpportunity =
            !keywords.length ||
            (skipDetailKeywordRecheck ? listingMatch : listingMatch || detailMatch);

          if (!includeOpportunity) {
            logs.push({
              level: 'info',
              message: `Skipped ${link.href} — no keyword match on listing or detail page`
            });
            continue;
          }

          const title = pickTitle(link.text, detail.title);
          const description =
            detail.body ||
            (listingMatch ? link.text : '') ||
            `Discovered via web scrape from ${targetUrl}`;

          opportunities.push(
            this.normalizeOpportunity(
              {
                externalId: link.href,
                reference: `SCRAPE-${Date.now()}-${index}`,
                title: title || `Opportunity ${index + 1}`,
                description,
                organization: config.sourceName || 'Web portal',
                sourceUrl: link.href,
                metadata: {
                  scrapeSource: targetUrl,
                  listingAnchorText: link.text,
                  detailTitle: detail.title,
                  detailChars: detail.body.length,
                  listingKeywordMatch: listingMatch,
                  detailKeywordMatch: detailMatch
                }
              },
              { name: config.sourceName || 'Web scrape' }
            )
          );
        }
      }

      const elapsedMs = Date.now() - startedAt;

      return {
        opportunities,
        nextCursor: null,
        logs: [
          {
            level: 'info',
            message: `Web scrape discovered ${opportunities.length} opportunity(ies) from ${targetUrl} in ${elapsedMs}ms`
          },
          {
            level: 'info',
            message: followDetailLinks
              ? `Detail-page following enabled (limit ${limit})`
              : 'Detail-page following disabled — listing links only'
          },
          {
            level: 'info',
            message: loggedIn
              ? 'Successfully logged in via Playwright'
              : 'Performed anonymous scrape (no login credentials or login failed)'
          },
          ...(excelKeywordsLoaded > 0
            ? [
                {
                  level: 'info',
                  message: `Loaded ${excelKeywordsLoaded} keywords from attached Excel file`
                }
              ]
            : []),
          ...logs
        ]
      };
    } catch (e) {
      throw new Error(`Scrape failed: ${e.message}`);
    } finally {
      await browser.close();
    }
  }

  async testConnection({ config = {} }) {
    this.validateConfig(config);
    const loginUrl = config.loginUrl || config.searchUrl || config.baseUrl;
    const { browser, context } = await this._createBrowserContext();

    try {
      const page = await context.newPage();
      const response = await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

      const status = response ? response.status() : 200;
      if (status >= 400) {
        throw new Error(`Portal unreachable (${status})`);
      }

      let message = `Portal reachable (${status}). `;
      const loginUsername = config.loginUsername || config.username;
      const loginPassword = config.loginPassword || config.password;
      if (loginUsername && loginPassword) {
        const loggedIn = await this._performLogin(page, config);
        if (loggedIn) {
          message += 'Login successful via Playwright.';
        } else {
          message += 'Login attempt failed. Please check selectors or credentials.';
        }
      } else {
        message += 'No login credentials provided.';
      }

      return {
        ok: true,
        message,
        statusCode: status
      };
    } finally {
      await browser.close();
    }
  }
}

module.exports = WebScrapeConnector;
