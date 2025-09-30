// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Global and test timeouts */
  timeout: 120000,         // 2 minutes per test
  globalTimeout: 600000,   // 10 minutes for the whole suite

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['line'],   // good for CI logs
    ['html', { open: 'never' }],
    ['allure-playwright'] // keep HTML report as artifact
  ],

  /* Shared settings for all the projects below */
  use: {
    baseURL: process.env.UAT_BASE_URL || 'https://uat.note-iq.com',
    trace: 'retain-on-failure',      // Keep trace for failed tests
    screenshot: 'only-on-failure',   // Capture screenshot on failure
    video: 'retain-on-failure',      // Record video for failed tests
    actionTimeout: 30000,            // Max time for single action
    navigationTimeout: 60000,        // Max time for navigation
    viewport: { width: 1280, height: 720 },
    headless: true,
    ignoreHTTPSErrors: true,
  },

  /* Configure projects */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Run only chromium in CI for stability
    // Uncomment these for local cross-browser runs:
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
