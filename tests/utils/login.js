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

  // Verify successful login (check Admin link exists)
  await expect(page.locator('a[href="/admin"]')).toBeVisible({ timeout: 20000 });
  console.log(">>> Login successful, Admin link found");
}
