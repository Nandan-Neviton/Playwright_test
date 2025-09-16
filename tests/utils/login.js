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

  // Try multiple selectors for email input
  const emailField = page.getByRole('textbox', { name: 'Enter email address' })
  await emailField.fill(username);

  const passwordField = page.getByRole('textbox', { name: 'Enter password' })
  await passwordField.fill(password);

  // Click Login button
  const loginBtn = page.getByRole('button', { name: 'LOGIN', exact: true })
  await loginBtn.click();

  console.log(">>> Login submitted");
  await page.screenshot({ path: 'debug-after-login.png', fullPage: true });
}
