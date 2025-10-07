// @ts-check
import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const date = new Date();
const timestamp = date.toISOString().replace(/[:.]/g, '-'); // safe folder name
const reportFolder = path.join('allure-reports', timestamp);

// Ensure allure report folder exists
if (!fs.existsSync(reportFolder)) {
  fs.mkdirSync(reportFolder, { recursive: true });
}

// Write date-time to environment.properties for Allure
const envPropsPath = path.join('allure-results', 'environment.properties');
if (!fs.existsSync('allure-results')) {
  fs.mkdirSync('allure-results');
}
fs.writeFileSync(envPropsPath, `TestRun=${date.toISOString()}`);

// Store timestamp for later use
process.env.ALLURE_REPORT_FOLDER = reportFolder;
process.env.ALLURE_RUN_TIMESTAMP = date.toISOString();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 120000,
  globalTimeout: 600000,

  reporter: [
    ['line'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
      },
    ],
  ],

  use: {
    baseURL: process.env.UAT_BASE_URL || 'https://uat.note-iq.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 60000,
    viewport: { width: 1280, height: 720 },
    headless: true,
    ignoreHTTPSErrors: true,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
