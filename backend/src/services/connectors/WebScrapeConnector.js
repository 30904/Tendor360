const { chromium } = require('playwright');
const BaseConnector = require('./BaseConnector');
const { loadKeywordsFromFile } = require('../../modules/tender-discovery/services/ExcelKeywordLoaderService');

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
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Tender360-DiscoveryBot/1.0',
      acceptDownloads: true,
      viewport: { width: 1280, height: 720 }
    });
    return { browser, context };
  }

  async _performLogin(page, config) {
    if (!config.loginUsername || !config.loginPassword || !config.loginUrl) {
      return false; // No login credentials provided
    }

    try {
      await page.goto(config.loginUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

      // Attempt to find common login fields if specific selectors aren't provided
      // This is a generic heuristic.
      const userSelector = config.usernameSelector || 'input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]';
      const passSelector = config.passwordSelector || 'input[type="password"], input[name*="pass"]';
      const submitSelector = config.submitSelector || 'button[type="submit"], input[type="submit"], button:has-text("Log In"), button:has-text("Sign In"), button:has-text("Login")';

      await page.waitForSelector(userSelector, { state: 'visible', timeout: 10000 });
      await page.fill(userSelector, config.loginUsername);
      await page.fill(passSelector, config.loginPassword);
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}), // catch timeout if it doesn't navigate but just updates DOM
        page.click(submitSelector)
      ]);
      
      return true;
    } catch (e) {
      console.warn(`WebScrapeConnector login failed or timed out: ${e.message}`);
      return false;
    }
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
    const { browser, context } = await this._createBrowserContext();

    try {
      const page = await context.newPage();
      
      const loggedIn = await this._performLogin(page, config);
      
      if (config.searchUrl) {
        await page.goto(config.searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      }

      const linkSelector = config.itemLinkSelector || 'a[href]';
      await page.waitForSelector(linkSelector, { state: 'attached', timeout: 15000 }).catch(() => {});

      // Evaluate in browser context to get links
      const links = await page.evaluate((sel) => {
        const anchors = Array.from(document.querySelectorAll(sel));
        return anchors
          .map(a => ({ href: a.href, text: a.innerText.trim() }))
          .filter(a => a.href && !a.href.startsWith('#') && !a.href.startsWith('javascript:'));
      }, linkSelector);

      let keywords = (config.keywords || []).map((k) => String(k).toLowerCase());
      let excelKeywordsLoaded = 0;

      if (config.keywordFilePath) {
        try {
          const excelKeywords = loadKeywordsFromFile(config.keywordFilePath);
          keywords = [...new Set([...keywords, ...excelKeywords])];
          excelKeywordsLoaded = excelKeywords.length;
        } catch (err) {
          console.warn(`Failed to load Excel keywords from ${config.keywordFilePath}:`, err.message);
        }
      }

      const opportunities = links
        .filter((link) => {
          if (!keywords.length) return true;
          const haystack = `${link.href} ${link.text}`.toLowerCase();
          return keywords.some((kw) => haystack.includes(kw));
        })
        .slice(0, limit)
        .map((link, index) => {
          return this.normalizeOpportunity(
            {
              externalId: link.href,
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
            message: loggedIn ? `Successfully logged in via Playwright` : `Performed anonymous scrape (no login credentials or login failed)`
          },
          ...(excelKeywordsLoaded > 0 ? [{
            level: 'info',
            message: `Loaded ${excelKeywordsLoaded} keywords from attached Excel file`
          }] : [])
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
      const response = await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      const status = response ? response.status() : 200;
      if (status >= 400) {
        throw new Error(`Portal unreachable (${status})`);
      }

      let message = `Portal reachable (${status}). `;
      if (config.loginUsername && config.loginPassword) {
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
