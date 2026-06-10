// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';
const apiPort = process.env.PLAYWRIGHT_API_PORT || '5026';

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    [path.join(__dirname, 'tests/reporters/tender360-summary-reporter.js')]
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 45000,
    storageState: path.join(__dirname, 'tests/.auth/admin.json')
  },
  projects: [
    {
      name: 'setup',
      testDir: './tests',
      testMatch: /auth\.setup\.js/,
      use: { ...devices['Desktop Chrome'], storageState: { cookies: [], origins: [] } }
    },
    {
      name: 'auth',
      testMatch: /01-auth\.spec\.js/,
      use: { ...devices['Desktop Chrome'], storageState: { cookies: [], origins: [] } }
    },
    {
      name: 'chromium',
      testMatch: /0[2-9]-.*\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup']
    }
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : [
        {
          command: 'npm run dev:backend',
          cwd: __dirname,
          url: `http://127.0.0.1:${apiPort}/api/health`,
          reuseExistingServer: false,
          timeout: 180000,
          env: { ...process.env, NODE_ENV: 'test', PORT: apiPort }
        },
        {
          command: 'npm run dev:frontend',
          cwd: __dirname,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 180000,
          env: {
            ...process.env,
            VITE_API_URL: `http://127.0.0.1:${apiPort}/api`
          }
        }
      ],
  timeout: 120000,
  expect: { timeout: 15000 }
});
