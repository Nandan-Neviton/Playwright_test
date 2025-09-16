// @ts-check
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, filterAndSearch, filterAndDownload, toggleAndCheck } from '../utils/commonActions.js';

// Force desktop viewport to avoid responsive issues in GitHub Actions
test.use({ viewport: { width: 1920, height: 1080 } });

test.describe.serial('Admin - Site Management Tests', () => {
  // Shared test data (persist across serial tests)
  const siteData = {
    name: faker.company.name(),
    code: faker.string.alphanumeric(5).toUpperCase(),
    address: faker.location.streetAddress(),
    timezone: '',
    dateFormat: '',
    successMessage: 'Site created successfully',
  };

  const updatedName = faker.company.name().slice(0, 6);

  console.log('>>> Test Site Data:', siteData);
  console.log('>>> Updated Name for Edit Test:', updatedName);

  test.beforeEach(async ({ page }) => {
    await login(
      page,
      process.env.ADMIN_USER || 'Nameera.Alam@adms.com',
      process.env.ADMIN_PASS || 'Adms@123'
    );
  });

  // ---------- TEST 1: Create a New Site ----------
  // test('should create a new site with valid details', async ({ page }) => {
  //   await goToModule(page, 'Site');

  //   await page.getByRole('tab', { name: /new site/i }).click();

  //   await page.getByRole('textbox', { name: /site name/i }).fill(siteData.name);
  //   await page.getByRole('textbox', { name: /site code/i }).fill(siteData.code);
  //   await page.getByRole('textbox', { name: /address/i }).fill(siteData.address);

  //   // Select a random Timezone
  //   await page.locator('#timezone').click();
  //   const tzOptions = page.locator('ul[role="listbox"] li');
  //   const tzCount = await tzOptions.count();
  //   if (tzCount === 0) throw new Error('No timezone options found');
  //   const tzIndex = faker.number.int({ min: 0, max: tzCount - 1 });
  //   const tzOption = tzOptions.nth(tzIndex);
  //   siteData.timezone = (await tzOption.textContent())?.trim() ?? '';
  //   await tzOption.click();
  //   console.log(`>>> Selected Timezone: ${siteData.timezone}`);

  //   // Select a random Date Format
  //   await page.locator('#date').click();
  //   const dfOptions = page.locator('ul[role="listbox"] li');
  //   const dfCount = await dfOptions.count();
  //   if (dfCount === 0) throw new Error('No date format options found');
  //   const dfIndex = faker.number.int({ min: 0, max: dfCount - 1 });
  //   siteData.dateFormat = (await dfOptions.nth(dfIndex).textContent())?.trim() ?? '';
  //   await dfOptions.nth(dfIndex).click();
  //   console.log(`>>> Selected Date Format: ${siteData.dateFormat}`);

  //   await page.getByRole('button', { name: /^create$/i }).click();

  //   await expect(page.getByRole('alert')).toHaveText(siteData.successMessage, {
  //     timeout: 5000,
  //   });
  // });

  // ---------- TEST 2: Verify the Created Site ----------
  test('should verify the newly created site details', async ({ page }) => {
    await goToModule(page, 'Site');

    await filterAndSearch(page, 'Code', siteData.code);

    const row = page.getByRole('row', { name: new RegExp(siteData.code, 'i') });
    await expect(row).toBeVisible({ timeout: 5000 });
    await expect(row).toContainText(siteData.name);
    await expect(row).toContainText(siteData.timezone);

    // Toggle Active <-> Inactive
    await toggleAndCheck(page, 'Site has been deactivated', 'Inactive');
    await toggleAndCheck(page, 'Site has been activated', 'Active');
  });

  // ---------- TEST 3: Filter & Download Site List ----------
  test('should filter site list by site code and download results', async ({ page }) => {
    await goToModule(page, 'Site');
    await filterAndDownload(page, 'Site Code', siteData.code);
  });

  // ---------- TEST 4: Edit Site ----------
  test('should edit an existing site', async ({ page }) => {
    await goToModule(page, 'Site');

    const row = page.getByRole('row', { name: new RegExp(siteData.name, 'i') });
    await expect(row).toBeVisible({ timeout: 5000 });
    await row.getByRole('button', { name: /edit/i }).click();

    await page.getByRole('textbox', { name: /site name/i }).fill(updatedName);
    await page.getByRole('button', { name: /^update$/i }).click();

    await expect(page.getByRole('alert')).toHaveText('Site updated successfully', {
      timeout: 5000,
    });
  });

  // ---------- TEST 5: Delete Site ----------
  test('should delete an existing site', async ({ page }) => {
    await goToModule(page, 'Site');

    const row = page.getByRole('row', { name: new RegExp(`(${updatedName}|${siteData.name})`, 'i') });
    await expect(row).toBeVisible({ timeout: 5000 });
    await row.getByRole('button', { name: /delete/i }).click();

    await page.getByRole('button', { name: /^delete$/i }).click();

    await expect(page.getByRole('alert')).toHaveText('Site deleted successfully', {
      timeout: 5000,
    });
  });
});
