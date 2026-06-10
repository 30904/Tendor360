// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Discovery & email tender scanning', () => {
  test('TC-M-020 Discovery hub shows connector telemetry', async ({ page }) => {
    await page.goto('/tender-discovery');
    await expect(page.getByText(/discovery|ingestion|connector/i).first()).toBeVisible({ timeout: 20000 });
  });

  test('TC-M-026 Prospecting RTM board renders TB requirements', async ({ page }) => {
    await page.goto('/tender-discovery/prospecting');
    await expect(page.getByText('TB-001').first()).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('TB-006').first()).toBeVisible();
  });

  test('TC-M-030 Email scanning RTM and feed', async ({ page }) => {
    await page.goto('/tender-discovery/email-scanning');
    await expect(page.getByText('ATS-001').first()).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/Email Tender Scanning|mailbox/i).first()).toBeVisible();
  });

  test('TC-M-031 Scan now button is clickable', async ({ page }) => {
    await page.goto('/tender-discovery/email-scanning');
    const scanBtn = page.getByRole('button', { name: /Scan now/i });
    await expect(scanBtn).toBeVisible({ timeout: 15000 });
    await scanBtn.click();
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).not.toContainText('Access denied');
  });
});
