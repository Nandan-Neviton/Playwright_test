import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, filterAndSearch, filterAndDownload, toggleAndCheck } from '../utils/commonActions.js';

// Test suite for Admin - Site creation and verification
test.describe.serial('Admin - Site Management Tests', () => {
  // Store test data in one place (some fields are random to avoid duplicates)
  const siteData = {
    name: faker.company.name(),
    code: faker.string.alphanumeric(5).toUpperCase(),
    address: faker.location.streetAddress(),
    timezone: '',
    dateFormat: '',
    successMessage: 'Site created successfully',
  };
  const newName = faker.company.name().slice(0, 8); // keep at least 8 chars for uniqueness

  console.log('>>> Test Site Data:', siteData);
  console.log('>>> New Name for Edit Test:', newName);

  // ---------- TEST 1: Create a New Site ----------
  test('should create a new site with valid details', async ({ page }) => {
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToModule(page, 'Site');

    // Open "New Site" tab
    await page.getByRole('tab', { name: /new site/i }).click();

    // Fill in basic site details
    await page.getByRole('textbox', { name: /enter site name/i }).fill(siteData.name);
    await page.getByRole('textbox', { name: /enter site code/i }).fill(siteData.code);
    await page.getByRole('textbox', { name: /enter address/i }).fill(siteData.address);

    // Pick a random Timezone
    await page.locator('#timezone').click();
    const timezoneOptions = page.locator('ul[role="listbox"] li');
    const tzCount = await timezoneOptions.count();
    if (tzCount === 0) throw new Error("No timezone options found");
    const tzIndex = faker.number.int({ min: 0, max: tzCount - 1 });
    const option = timezoneOptions.nth(tzIndex);
    siteData.timezone = (await option.textContent())?.trim() ?? '';
    await option.click();
    console.log(`>>> Selected Timezone: ${siteData.timezone}`);

    // Pick a random Date Format
    await page.locator('#date').click();
    const dateFormatOptions = page.locator('ul[role="listbox"] li');
    const dfCount = await dateFormatOptions.count();
    if (dfCount === 0) throw new Error("No date format options found");
    const dfIndex = faker.number.int({ min: 0, max: dfCount - 1 });
    siteData.dateFormat = (await dateFormatOptions.nth(dfIndex).textContent())?.trim() ?? '';
    await dateFormatOptions.nth(dfIndex).click();
    console.log(`>>> Selected Date Format: ${siteData.dateFormat}`);

    // Save and verify success message
    await page.getByRole('button', { name: /^create$/i }).click();
    await expect(page.getByRole('alert')).toHaveText(siteData.successMessage);

    // Debug screenshot after creation
    await page.screenshot({ path: 'site-created.png', fullPage: true });
  });

  // ---------- TEST 2: Verify the Created Site ----------
  test('should verify the newly created site details', async ({ page }) => {
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToModule(page, 'Site');

    await filterAndSearch(page, 'Code', siteData.code);
    await page.waitForTimeout(2000);

    // Ensure site details are visible
    await expect(page.getByRole('cell', { name: siteData.name }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: siteData.code })).toBeVisible();
    await expect(page.getByRole('cell', { name: siteData.timezone }).first()).toBeVisible();

    // Toggle Active <-> Inactive
    await toggleAndCheck(page, 'Site has been deactivated', 'Inactive');
    await toggleAndCheck(page, 'Site has been activated', 'Active');
  });

  // ---------- TEST 3: Filter & Download Site List ----------
  test('should filter site list by site code and download results', async ({ page }) => {
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToModule(page, 'Site');

    await filterAndDownload(page, 'Site Code', siteData.code);
  });

  // ---------- TEST 4: Edit Site ----------
  test('should edit an existing site', async ({ page }) => {
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToModule(page, 'Site');

    // Find row and click Edit action
    const row = page.getByRole('row', { name: new RegExp(`^${siteData.name}.*`) });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: /edit/i }).click();

    await page.getByRole('textbox', { name: /site name/i }).fill(newName);
    await page.getByRole('button', { name: /^update$/i }).click();

    //await expect(page.getByRole('alert')).toHaveText('Site updated successfully');
  });

  // ---------- TEST 5: Delete Site ----------
  test('should delete an existing site', async ({ page }) => {
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToModule(page, 'Site');

    // Match either old name or new edited name
    const row = page.getByRole('row', { name: new RegExp(`^(${newName}|${siteData.name}).*`) });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: /delete/i }).click();

    await page.getByRole('button', { name: /^delete$/i }).click();

    await expect(page.getByRole('alert')).toHaveText('Site deleted successfully');
  });
});
