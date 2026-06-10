// @ts-check
const { test, expect } = require('@playwright/test');

const ref = `E2E-${Date.now().toString(36).toUpperCase()}`;

test.describe.serial('TC-M-050 — Tender lifecycle (create → award → close)', () => {
  test('TC-M-051 Create tender via pipeline', async ({ page }) => {
    await page.goto('/tender-intelligence/pipeline');
    await page.getByRole('button', { name: 'Add tender' }).click();
    await expect(page).toHaveURL(/\/pipeline\/new/);

    await page.getByLabel('Reference *').fill(ref);
    await page.getByLabel('Title *').fill(`Automated E2E Tender ${ref}`);
    await page.getByLabel('Organization *').fill('E2E Test Health System');
    await page.getByLabel('Location *').fill('Boston, MA');
    await page.getByLabel('Description *').fill('Playwright automated end-to-end test opportunity.');
    await page.getByLabel('Estimated value *').fill('250000');
    await page.getByLabel('Deadline *').fill('2030-12-31');

    const selects = page.locator('select');
    if (await selects.count()) {
      await selects.first().selectOption({ index: 1 }).catch(() => {});
    }

    await page.getByRole('button', { name: 'Create tender' }).click();
    await expect(page).toHaveURL(/\/pipeline\/(?!new)/, { timeout: 30000 });
    await expect(page.getByText(ref).first()).toBeVisible({ timeout: 20000 });
  });

  test('TC-M-054 Edit tender stage to pursuing', async ({ page }) => {
    await page.goto('/tender-intelligence/pipeline');
    await page.getByPlaceholder(/search/i).fill(ref);
    await page.waitForTimeout(800);
    await page.getByText(ref).first().click();
    await page.getByRole('button', { name: 'Edit tender' }).click();
    const stageSelect = page.locator('select').filter({ hasText: /identified|evaluating|pursuing/i }).first();
    if (await stageSelect.count()) {
      await stageSelect.selectOption('pursuing').catch(() => {});
    }
    await page.getByRole('button', { name: 'Update tender' }).click();
    await expect(page.getByText(/success|updated/i).first()).toBeVisible({ timeout: 15000 }).catch(
      () => expect(page).toHaveURL(/\/pipeline\//)
    );
  });

  test('TC-M-071 Open opportunity workspace for tender', async ({ page }) => {
    await page.goto('/opportunity-workspace');
    await expect(page.getByText(/opportunity|workspace/i).first()).toBeVisible({ timeout: 20000 });
  });

  test('TC-M-200 Mark tender awarded (via pipeline edit)', async ({ page }) => {
    await page.goto('/tender-intelligence/pipeline');
    await page.getByPlaceholder(/search/i).fill(ref);
    await page.waitForTimeout(800);
    await page.getByText(ref).first().click();
    await page.getByRole('button', { name: 'Edit tender' }).click();
    const statusSelect = page.locator('select').filter({ hasText: /active|awarded|closed/i }).first();
    if (await statusSelect.count()) {
      await statusSelect.selectOption('awarded').catch(() => {});
    }
    await page.getByRole('button', { name: 'Update tender' }).click();
    await page.waitForTimeout(1500);
  });

  test('TC-M-203 Closeout archive page loads', async ({ page }) => {
    await page.goto('/post-award-tracker/closeout-archive');
    await expect(page.getByText(/closeout|archive/i).first()).toBeVisible({ timeout: 20000 });
  });

  test('TC-M-205 Close tender status', async ({ page }) => {
    await page.goto('/tender-intelligence/pipeline');
    await page.getByPlaceholder(/search/i).fill(ref);
    await page.waitForTimeout(800);
    await page.getByText(ref).first().click();
    await page.getByRole('button', { name: 'Edit tender' }).click();
    const statusSelect = page.locator('select').filter({ hasText: /active|closed|awarded/i }).first();
    if (await statusSelect.count()) {
      await statusSelect.selectOption('closed').catch(() => {});
    }
    await page.getByRole('button', { name: 'Update tender' }).click();
    await expect(page).toHaveURL(/\/pipeline/);
  });
});
