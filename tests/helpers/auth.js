const { expect } = require('@playwright/test');
const { adminEmail, adminPassword } = require('./env');

/**
 * Log in via UI (use when storageState is not loaded).
 */
async function loginAsAdmin(page) {
  await page.goto('/login');
  await page.getByPlaceholder('Enter your email').fill(adminEmail);
  await page.getByPlaceholder('Enter your password').fill(adminPassword);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/(dashboard|tender-intelligence)/, { timeout: 45000 });
}

module.exports = { loginAsAdmin };
