// utils/login.js
import { expect } from '@playwright/test';

export async function login(page, username, password) {
  console.log(">>> Navigating to login page...");

  await page.context().clearCookies(); // ensure fresh session
  await page.goto("https://uat.note-iq.com/", {
    waitUntil: "networkidle",
    timeout: 60000,
  });

  console.log(">>> Current URL after navigation:", page.url());
  await page.screenshot({ path: 'debug-before-login.png', fullPage: true });

  // Email field
  const emailField = page.getByRole('textbox', { name: 'Enter email address' });
  await expect(emailField).toBeVisible({ timeout: 15000 });
  await emailField.fill(username);

  // Password field
  const passwordField = page.getByRole('textbox', { name: 'Enter password' });
  await expect(passwordField).toBeVisible({ timeout: 15000 });
  await passwordField.fill(password);

  // Login button
  const loginBtn = page.getByRole('button', { name: 'LOGIN', exact: true });
  await expect(loginBtn).toBeVisible({ timeout: 15000 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle", timeout: 60000 }),
    loginBtn.click(),
  ]);

  console.log(">>> Login submitted, waiting for post-login page...");
  await page.screenshot({ path: 'debug-after-login.png', fullPage: true });

  // Wait for Admin link with retry logic
  const maxRetries = 3;
  let attempt = 0;
  const adminLink = page.locator('a[href="/admin"]');

  while (attempt < maxRetries) {
    try {
      await expect(adminLink).toBeVisible({ timeout: 10000 });
      console.log(">>> Login successful, Admin link found");
      return; // success
    } catch (err) {
      attempt++;
      console.warn(`>>> Attempt ${attempt}: Admin link not visible. Reloading page...`);
      await page.keyboard.press('F5'); // press F5 to reload
      await page.waitForLoadState('networkidle');
    }
  }

  throw new Error('Admin link not visible after multiple reload attempts');
}
