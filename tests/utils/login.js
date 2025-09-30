// utils/login.js
import { expect } from '@playwright/test';
import fs from 'fs';

export async function login(page, username, password) {
  console.log(">>> Navigating to login page...");

  await page.context().clearCookies(); // ensure fresh session

  // Retry page load up to 3 times if blank
  const maxLoadRetries = 3;
  let loadAttempt = 0;
  let pageLoaded = false;

  while (loadAttempt < maxLoadRetries && !pageLoaded) {
    try {
      await page.goto("https://uat.note-iq.com/", {
        waitUntil: "load", // ensures full page load
        timeout: 120000,   // 2 minutes
      });
      pageLoaded = true;
    } catch (err) {
      loadAttempt++;
      console.warn(`>>> Attempt ${loadAttempt}: Page failed to load, retrying...`);
    }
  }

  if (!pageLoaded) throw new Error('Page failed to load after multiple attempts');

  console.log(">>> Current URL after navigation:", page.url());

  // Ensure page has content, if blank retry
  const content = await page.content();
  if (!content || content.length < 100) {
    console.warn(">>> Page content seems blank. Capturing HTML and retrying...");
    fs.writeFileSync('blank-page.html', content);
    await page.reload({ waitUntil: 'networkidle' });
  }

  // Fill Email
  const emailField = page.getByRole('textbox', { name: 'Enter email address' });
  await expect(emailField).toBeVisible({ timeout: 20000 });
  await emailField.fill(username);

  // Fill Password
  const passwordField = page.getByRole('textbox', { name: 'Enter password' });
  await expect(passwordField).toBeVisible({ timeout: 20000 });
  await passwordField.fill(password);

  // Click Login
  const loginBtn = page.getByRole('button', { name: 'LOGIN', exact: true });
  await expect(loginBtn).toBeVisible({ timeout: 20000 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle", timeout: 120000 }),
    loginBtn.click(),
  ]);

  console.log(">>> Login submitted, waiting for post-login page...");


  // Wait for Admin link with retry logic
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      console.log(">>> Login successful");
      return; // success
    } catch (err) {
      attempt++;
      await page.reload({ waitUntil: 'networkidle' });
      await page.screenshot({ path: `debug-reload-${attempt}.png`, fullPage: true });
    }
  }

  // If still not visible, throw error
  const finalContent = await page.content();
  fs.writeFileSync('final-page.html', finalContent);
  throw new Error('Admin link not visible after multiple reload attempts');
}
