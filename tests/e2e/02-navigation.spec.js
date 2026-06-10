// @ts-check
const { test, expect } = require('@playwright/test');

const HUB_ROUTES = [
  { id: 'TC-M-010', path: '/dashboard', heading: /dashboard|intelligence|Active/i },
  { id: 'TC-M-020', path: '/tender-discovery', heading: /discovery|ingestion/i },
  { id: 'TC-M-026', path: '/tender-discovery/prospecting', heading: /prospecting|TB-00/i },
  { id: 'TC-M-030', path: '/tender-discovery/email-scanning', heading: /email|ATS/i },
  { id: 'TC-M-050', path: '/tender-intelligence/pipeline', heading: /pipeline/i },
  { id: 'TC-M-070', path: '/ai-document-intelligence', heading: /document intelligence|AI/i },
  { id: 'TC-M-071', path: '/ai-document-intelligence/rtm', heading: /tender intelligence|TB-00/i },
  { id: 'TC-M-074', path: '/ai-document-intelligence/crm', heading: /CRM|TB-011/i },
  { id: 'TC-M-120', path: '/qualification-evaluation', heading: /qualification/i },
  { id: 'TC-M-140', path: '/go-no-go', heading: /go|no-go/i },
  { id: 'TC-M-150', path: '/pricing-simulation', heading: /pricing|commercial/i },
  { id: 'TC-M-200', path: '/post-award-tracker', heading: /post-award|award/i },
  { id: 'TC-M-203', path: '/post-award-tracker/closeout-archive', heading: /closeout|archive/i }
];

test.describe('TC-M — Module navigation smoke (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  for (const route of HUB_ROUTES) {
    test(`${route.id} ${route.path} loads`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('body')).not.toContainText('500 Internal Server Error');
      await expect(page.getByText(route.heading).first()).toBeVisible({ timeout: 25000 });
    });
  }
});
