// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Intelligence & CRM', () => {
  test('TC-M-070 Tender Intelligence RTM page', async ({ page }) => {
    await page.goto('/ai-document-intelligence/rtm');
    await expect(page.getByText('TB-006').first()).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('TB-010').first()).toBeVisible();
  });

  test('TC-M-074 CRM Account Intelligence RTM', async ({ page }) => {
    await page.goto('/ai-document-intelligence/crm');
    await expect(page.getByText('TB-011').first()).toBeVisible({ timeout: 20000 });
  });

  test('TC-M-005 Admin discovery connectors page', async ({ page }) => {
    await page.goto('/admin-config/discovery-connectors');
    await expect(page.getByText(/discovery connector|GovWin|connector/i).first()).toBeVisible({
      timeout: 25000
    });
  });
});
