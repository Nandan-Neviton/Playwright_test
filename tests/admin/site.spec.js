import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, filterAndSearch, filterAndDownload, toggleAndCheck } from '../utils/commonActions.js';

// Get creds + URL from env
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const USERNAME = process.env.TEST_USERNAME;
const PASSWORD = process.env.TEST_PASSWORD;

// Test suite for Admin - Site creation and verification
test.describe.serial('Admin - Site Management Tests', () => {
    const siteData = {
        name: faker.company.name(),
        code: faker.string.alphanumeric(5).toUpperCase(),
        address: faker.location.streetAddress(),
        timezone: '',
        dateFormat: '',
        successMessage: 'Site created successfully',
    };
    const newName = faker.company.name().slice(0, 4);

    console.log('Test Site Data:', siteData);

    // ---------- TEST 1: Create a New Site ----------
    test('should create a new site with valid details', async ({ page }) => {
        await login(page, BASE_URL, USERNAME, PASSWORD);
        await goToModule(page, 'Site');

        await expect(page.getByRole('tab', { name: 'New Site' })).toBeVisible();
        await page.getByRole('tab', { name: 'New Site' }).click();

        await page.getByRole('textbox', { name: 'Enter Site Name' }).fill(siteData.name);
        await page.getByRole('textbox', { name: 'Enter Site Code' }).fill(siteData.code);
        await page.getByRole('textbox', { name: 'Enter Address' }).fill(siteData.address);

        // Random Timezone
        await page.locator('#timezone').click();
        const tzOptions = page.locator('ul[role="listbox"] li');
        const tzCount = await tzOptions.count();
        const tzIndex = faker.number.int({ min: 0, max: tzCount - 1 });
        const tzOption = tzOptions.nth(tzIndex);
        siteData.timezone = (await tzOption.textContent())?.trim() ?? '';
        await tzOption.click();

        // Random Date Format
        await page.locator('#date').click();
        const dfOptions = page.locator('ul[role="listbox"] li');
        const dfCount = await dfOptions.count();
        const dfIndex = faker.number.int({ min: 0, max: dfCount - 1 });
        siteData.dateFormat = (await dfOptions.nth(dfIndex).textContent())?.trim() ?? '';
        await dfOptions.nth(dfIndex).click();

        await page.getByRole('button', { name: 'Create' }).click();
        await expect(page.getByRole('alert')).toHaveText(siteData.successMessage);
    });

    // ---------- TEST 2: Verify Site ----------
    test('should verify the newly created site details', async ({ page }) => {
        await login(page, BASE_URL, USERNAME, PASSWORD);
        await goToModule(page, 'Site');

        await filterAndSearch(page, 'Code', siteData.code);
        await page.waitForTimeout(2000);

        await expect(page.getByRole('cell', { name: siteData.name }).first()).toBeVisible();
        await expect(page.getByRole('cell', { name: siteData.code })).toBeVisible();
        await expect(page.getByRole('cell', { name: siteData.timezone }).first()).toBeVisible();

        await toggleAndCheck(page, 'Site has been deactivated', 'Inactive');
        await toggleAndCheck(page, 'Site has been activated', 'Active');
    });

    // ---------- TEST 3: Filter & Download ----------
    test('should filter site list by site code and download results', async ({ page }) => {
        await login(page, BASE_URL, USERNAME, PASSWORD);
        await goToModule(page, 'Site');
        await filterAndDownload(page, 'Site Code', siteData.code);
    });

    // ---------- TEST 4: Edit Site ----------
    test('Edit action button working', async ({ page }) => {
        await login(page, BASE_URL, USERNAME, PASSWORD);
        await goToModule(page, 'Site');

        await page
            .getByRole('row', { name: new RegExp(`^${siteData.name}.*`) })
            .getByRole('button')
            .nth(1)
            .click();

        await page.getByRole('textbox', { name: 'Site Name' }).fill(newName);
        await page.getByRole('button', { name: 'Update' }).click();
        await expect(page.getByRole('alert')).toHaveText('Site updated successfully');
    });

    // ---------- TEST 5: Delete Site ----------
    test('Delete action button working', async ({ page }) => {
        await login(page, BASE_URL, USERNAME, PASSWORD);
        await goToModule(page, 'Site');

        await page
            .getByRole('row', { name: new RegExp(`^(${newName}|${siteData.name}).*`) })
            .getByRole('button')
            .nth(2)
            .click();

        await page.getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByRole('alert')).toHaveText('Site deleted successfully');
    });
});
