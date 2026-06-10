// @ts-check
const { test, expect } = require('@playwright/test');
const { loginAsAdmin } = require('../helpers/auth');
const { adminEmail } = require('../helpers/env');

test.describe('TC-M-001 — Authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC-M-001a Login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tender360', level: 1 })).toBeVisible();
  });

  test('TC-M-001b Invalid credentials show error', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.getByPlaceholder('Enter your email').fill('invalid@example.com');
    await page.getByPlaceholder('Enter your password').fill('WrongPass123');
    const loginResponse = page.waitForResponse(
      (res) => res.url().includes('/auth/login') && res.request().method() === 'POST'
    );
    await page.getByRole('button', { name: 'Sign In' }).click();
    const response = await loginResponse;
    expect(response.status()).toBe(401);
    await expect(page.locator('.error-alert')).toContainText(/invalid email or password|login failed/i);
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-M-001c Valid admin login reaches dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/dashboard|intelligence|Active tenders/i).first()).toBeVisible({
      timeout: 20000
    });
  });

  test('TC-A-001 API health endpoint', async ({ request }) => {
    const apiBase = process.env.PLAYWRIGHT_API_URL || 'http://localhost:5026/api';
    const response = await request.get(`${apiBase}/health`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('OK');
  });
});
