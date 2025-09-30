// utils/commonActions.js
import { expect } from '@playwright/test';

export async function goToAdminSection(page) {
  const adminLink = page.locator('a[href="/admin"]');
  await expect(adminLink).toBeVisible({ timeout: 15000 }); // wait until link is visible
  await adminLink.click();
  console.log(">>> Navigated to Admin section");
}
export async function goToConfigSection(page) {
  const configLink = page.locator('a[href="/configuration"]');
  await expect(configLink).toBeVisible({ timeout: 15000 }); // wait until link is visible
  await configLink.click();
  console.log(">>> Navigated to Config section");
}

export async function goToModule(page, moduleName) {

  const moduleLink = page.getByRole('link', { name: moduleName });
  await expect(moduleLink).toBeVisible({ timeout: 15000 });
  await moduleLink.click();
  console.log(`>>> Navigated to module: ${moduleName}`);
}

export async function toggleAndCheck(page, expectedAlert, expectedStatus) {
  const toggle = page.locator('.PrivateSwitchBase-input.MuiSwitch-input.css-1m9pwf3').first();
  await expect(toggle).toBeVisible({ timeout: 10000 });
  await toggle.click();

  const alert = page.getByRole('alert').last();
  await expect(alert).toContainText(expectedAlert);

  const statusCell = page.getByRole('cell', { name: expectedStatus }).first();
  await expect(statusCell).toBeVisible({ timeout: 10000 });
  console.log(`>>> Toggle checked, expected status: ${expectedStatus}`);
}

export async function filterAndDownload(page, filterBy, value) {
  await page.locator('#table-search-option').click();
  await page.getByRole('option', { name: filterBy }).click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill(value);

  const choice = ['Excel', 'PDF'][Math.floor(Math.random() * 2)];
  console.log(`>>> Chosen download format: ${choice}`);

  await page.getByRole('button', { name: 'Download' }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: choice }).click(),
  ]);

  const suggestedName = download.suggestedFilename();
  console.log(`>>> Downloaded file: ${suggestedName}`);
  expect(suggestedName).toMatch(/\.(xlsx|pdf|csv)$/i);
}

export async function filterAndSearch(page, filterBy, value) {
  await page.locator('#table-search-option').click();
  await page.getByRole('option', { name: filterBy }).click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill(value);
  console.log(`>>> Applied filter: ${filterBy}, value: ${value}`);
}
