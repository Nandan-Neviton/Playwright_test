import { expect } from '@playwright/test';

export async function login(page, username, password) {
  console.log(">>> Navigating to login page...");

  // Always navigate to fixed login page
  await page.goto("https://uat.note-iq.com", {
    waitUntil: "domcontentloaded",
    timeout: 6000,
  });

  console.log(">>> Current URL after navigation:", page.url());

  // Debug screenshot of what CI actually sees
  await page.screenshot({ path: 'debug-login.png', fullPage: true });

  // Fill login form
  await page.getByRole('textbox', { name: /email/i }).fill(username);
  await page.getByRole('textbox', { name: /password/i }).fill(password);
  await page.getByRole('button', { name: /^login$/i }).click();

  console.log(">>> Login submitted");
}
