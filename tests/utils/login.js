import { expect } from '@playwright/test';

export async function login(page, username, password) {
  console.log(">>> Navigating to login page...");

  // Navigate to your app's login page
  await page.goto(process.env.BASE_URL || "https://uat.note-iq.com/login", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  console.log(">>> Current URL after navigation:", page.url());

  // Debug screenshot of what CI actually sees
  await page.screenshot({ path: 'debug-login.png', fullPage: true });

  // Wait explicitly for email input
  await expect(
    page.getByRole('textbox', { name: /email/i })
  ).toBeVisible({ timeout: 60000 });

  // Fill login form
  await page.getByRole('textbox', { name: /email/i }).fill(username);
  await page.getByRole('textbox', { name: /password/i }).fill(password);
  await page.getByRole('button', { name: /^login$/i }).click();

  console.log(">>> Login submitted");
}
