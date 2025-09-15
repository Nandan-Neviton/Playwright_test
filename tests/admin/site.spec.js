// import { test, expect } from '@playwright/test';
// import { faker } from '@faker-js/faker';
// import { login } from '../utils/login.js';
// import { goToModule, filterAndSearch, filterAndDownload, toggleAndCheck } from '../utils/commonActions.js';

// // Test suite for Admin - Site creation and verification
// test.describe.serial('Admin - Site Management Tests', () => {
//     // Store test data in one place (some fields are random to avoid duplicates)
//     const siteData = {
//         name: faker.company.name(),                       // Random site name
//         code: faker.string.alphanumeric(5).toUpperCase(), // Random short code like "A1B2C"
//         address: faker.location.streetAddress(),          // Random street address
//         timezone: '',                                     // To be selected from dropdown
//         dateFormat: '',                                   // To be selected from dropdown
//         successMessage: 'Site created successfully',      // Expected message after saving
//     };
//     const newName = faker.company.name().slice(0, 4);

//     console.log('Test Site Data:', siteData);
//     console.log('New Name for Edit Test:', newName);

//     // ---------- TEST 1: Create a New Site ----------
//     test('should create a new site with valid details', async ({ page }) => {
//         await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
//         await goToModule(page, 'Site');

//         // Open "New Site" tab
//         await page.getByRole('tab', { name: 'New Site' }).click();

//         // Fill in basic site details
//         await page.getByRole('textbox', { name: 'Enter Site Name' }).fill(siteData.name);
//         await page.getByRole('textbox', { name: 'Enter Site Code' }).fill(siteData.code);
//         await page.getByRole('textbox', { name: 'Enter Address' }).fill(siteData.address);

//         // Pick a random Timezone
//         await page.locator('#timezone').click();
//         const timezoneOptions = page.locator('ul[role="listbox"] li');
//         const tzCount = await timezoneOptions.count();
//         const tzIndex = faker.number.int({ min: 0, max: tzCount - 1 });
//         const option = timezoneOptions.nth(tzIndex);
//         siteData.timezone = (await option.textContent())?.trim() ?? '';
//         await option.click();
//         console.log(`Selected Timezone: ${siteData.timezone}`);

//         // Pick a random Date Format
//         await page.locator('#date').click();
//         const dateFormatOptions = page.locator('ul[role="listbox"] li');
//         const dfCount = await dateFormatOptions.count();
//         const dfIndex = faker.number.int({ min: 0, max: dfCount - 1 });
//         siteData.dateFormat = (await dateFormatOptions.nth(dfIndex).textContent())?.trim() ?? '';
//         await dateFormatOptions.nth(dfIndex).click();
//         console.log(`Selected Date Format: ${siteData.dateFormat}`);

//         // Save and verify success message
//         await page.getByRole('button', { name: 'Create' }).click();
//         await expect(page.getByRole('alert')).toHaveText(siteData.successMessage);
//     });

//     // ---------- TEST 2: Verify the Created Site ----------
//     test('should verify the newly created site details', async ({ page }) => {
//         await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
//         await goToModule(page, 'Site');

//         // Filter by Site Code
//         await filterAndSearch(page, 'Code', siteData.code);
//         await page.waitForTimeout(2000);

//         // Ensure site details are visible
//         await expect(page.getByRole('cell', { name: siteData.name }).first()).toBeVisible();
//         await expect(page.getByRole('cell', { name: siteData.code })).toBeVisible();
//         await expect(page.getByRole('cell', { name: siteData.timezone }).first()).toBeVisible();

//         // Toggle Active <-> Inactive using shared util
//         await toggleAndCheck(page, 'Site has been deactivated', 'Inactive');
//         await toggleAndCheck(page, 'Site has been activated', 'Active');
//     });

//     // ---------- TEST 3: Filter & Download Site List ----------
//     test('should filter site list by site code and download results', async ({ page }) => {
//         await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
//         await goToModule(page, 'Site');

//         // Use common filter + download util
//         await filterAndDownload(page, 'Site Code', siteData.code);
//     });

//     // ---------- TEST 4: Edit Site ----------
//     test('Edit action button working', async ({ page }) => {
//         await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
//         await goToModule(page, 'Site');

//         // Click Edit action
//         await page.getByRole('row', { name: new RegExp(`^${siteData.name}.*`) }).getByRole('button').nth(1).click();

//         // Update Site Name
//         await page.getByRole('textbox', { name: 'Site Name' }).fill(newName);
//         await page.getByRole('button', { name: 'Update' }).click();

//         // Verify success
//         await expect(page.getByRole('alert')).toHaveText('Site updated successfully');
//     });


//     // ---------- TEST 5: Delete Site ----------
//     test('Delete action button working', async ({ page }) => {
//         await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
//         await goToModule(page, 'Site');

//         // Click Delete action
//         await page.getByRole('row', { name: new RegExp(`^(${newName}|${siteData.name}).*`) })
//             .getByRole('button').nth(2).click();
//         await page.getByRole('button', { name: 'Delete' }).click();

//         // Verify success
//         await expect(page.getByRole('alert')).toHaveText('Site deleted successfully');
//     });
// });
