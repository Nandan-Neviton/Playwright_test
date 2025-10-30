// @ts-check
import { defineConfig, devices } from '@playwright/test';

const date = new Date();
const timestamp = date.toISOString().replace(/[:.]/g, '-');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 1200000,
  globalTimeout: 6000000,

  reporter: [
    ['line'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'playwright-report/.last-run.json' }], // ✅ added for rerun script
    ['allure-playwright', { outputFolder: 'allure-results', detail: true }],
  ],

  use: {
    baseURL: process.env.UAT_BASE_URL || 'https://uat.note-iq.com',
    // trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 60000,
    viewport: { width: 1280, height: 720 },
    headless: true,
    ignoreHTTPSErrors: true,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  globalTeardown: require.resolve('./global-teardown'),
});
