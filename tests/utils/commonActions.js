// utils/commonActions.js
import { expect } from '@playwright/test';


export async function goToAdminSection(page) {
  await page.locator('a:nth-child(2)').click();
}


export async function goToModule(page, moduleName) {
  await goToAdminSection(page);
  await page.getByRole('link', { name: moduleName }).click();
}

export async function toggleAndCheck(page, expectedAlert, expectedStatus) {
  const toggle = page.locator('.PrivateSwitchBase-input.MuiSwitch-input.css-1m9pwf3').first();
  await expect(toggle).toBeVisible();
  await toggle.click();

  await expect(page.getByRole('alert').last()).toContainText(expectedAlert);
  await expect(page.getByRole('cell', { name: expectedStatus }).first()).toBeVisible();
}


export async function filterAndDownload(page, filterBy, value) {
  await page.locator('#table-search-option').click();
  await page.getByRole('option', { name: filterBy }).click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill(value);

  const choice = ['Excel', 'PDF'][Math.floor(Math.random() * 2)];
  console.log(`Chosen download format: ${choice}`);

  page.getByRole('button', { name: 'Download' }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: choice }).click(),
  ]);

  const suggestedName = download.suggestedFilename();
  console.log(`Downloaded file: ${suggestedName}`);
  expect(suggestedName).toMatch(/\.(xlsx|pdf|csv)$/i);
}
export async function filterAndSearch(page, filterBy, value) {
  await page.locator('#table-search-option').click();
  await page.getByRole('option', { name: filterBy }).click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill(value);
}