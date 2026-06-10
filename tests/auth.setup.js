// @ts-check
const { test: setup, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { adminEmail, adminPassword, apiURL } = require('./helpers/env');

const authFile = path.join(__dirname, '.auth/admin.json');

setup('authenticate as MediCare admin', async ({ page, request }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const loginRes = await request.post(`${apiURL}/auth/login`, {
    data: { email: adminEmail, password: adminPassword }
  });
  expect(loginRes.ok()).toBeTruthy();
  const body = await loginRes.json();
  const { accessToken, user } = body.data;

  await page.goto('/login');
  await page.evaluate(
    ([token, userJson]) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(userJson));
    },
    [accessToken, user]
  );

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/(dashboard|tender-intelligence)/, { timeout: 30000 });
  await page.context().storageState({ path: authFile });
});
