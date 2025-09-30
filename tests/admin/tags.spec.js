import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, filterAndDownload, toggleAndCheck, filterAndSearch, goToAdminSection } from '../utils/commonActions.js';

// Test suite for Admin - Tag Management
test.describe.serial('Admin - Tag Management', () => {
    // Shared test data
    const tagData = {
        name: `${faker.commerce.department()}_${Date.now()}_${faker.string.alphanumeric(4)}`, // ✅ Unique tag name
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(5).toUpperCase(), // ✅ Ensures unique code too
        successMessage: 'Tag created successfully',
    };

    // Store the generated unique name for later use (e.g., delete action)
    const newName = tagData.name;
    console.log('📌 Test Data Initialized:', tagData);
    console.log('📌 New Name for Delete Test:', newName);

    // ---------- TEST 1: Create a New Tag ----------
    test('should create a new tag successfully', async ({ page }) => {
        console.log('➡️ Starting test: Create a New Tag');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        console.log('✅ Logged in successfully');
        await goToAdminSection(page);
        await goToModule(page, 'Tags');
        console.log('✅ Navigated to Tags module');

        // Fill in the new Tag details
        console.log('📝 Filling in Tag details...');
        await page.getByRole('tab', { name: 'New Tag' }).click();
        await page.getByRole('textbox', { name: 'Tag Name' }).fill(tagData.name);
        await page.getByRole('textbox', { name: 'Tag Code' }).fill(tagData.code);
        await page.getByRole('textbox', { name: 'Tag Description' }).fill(tagData.description);

        await page.getByRole('button', { name: 'Create' }).click();
        console.log('📤 Submitted Tag creation form');

        // Verify success alert message
        await expect(page.getByRole('alert')).toHaveText(tagData.successMessage);
        console.log('✅ Tag created successfully with message:', tagData.successMessage);
    });

    // ---------- TEST 2: Verify Created Tag ----------
    test('should verify the created tag and toggle its status', async ({ page }) => {
        console.log('➡️ Starting test: Verify Created Tag');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Tags');

        console.log(`🔍 Searching for Tag with Code: ${tagData.code}`);
        await filterAndSearch(page, 'Tag Code', tagData.code);
        await page.waitForTimeout(2000);

        await expect(page.getByRole('cell', { name: tagData.name }).first()).toBeVisible();
        await expect(page.getByRole('cell', { name: tagData.code }).first()).toBeVisible();
        console.log('✅ Tag found in grid:', tagData.name, tagData.code);

        await toggleAndCheck(page, 'Tag has been deactivated', 'Inactive');
        console.log('✅ Tag deactivated');

        await toggleAndCheck(page, 'Tag has been activated', 'Active');
        console.log('✅ Tag re-activated');
    });

    // ---------- TEST 3: Filter and Download Tag Data ----------
    test('should filter tags by code and download the data', async ({ page }) => {
        console.log('➡️ Starting test: Filter and Download Tag Data');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Tags');

        console.log(`🔍 Filtering by Tag Code: ${tagData.code}`);
        await filterAndDownload(page, 'Code', tagData.code);
        console.log('✅ Tag data downloaded successfully');
    });

    // ---------- TEST 4: Edit Action ----------
    test('Edit action button working', async ({ page }) => {
        console.log('➡️ Starting test: Edit Tag');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        
        await goToAdminSection(page);
        await goToModule(page, 'Tags');

        console.log(`✏️ Editing Tag: ${tagData.name}`);
        await page.getByRole('row', { name: new RegExp(`^${tagData.name}.*`) }).getByRole('button').nth(1).click();

        await page.getByRole('textbox', { name: 'Tag Name' }).fill(newName);
        await page.getByRole('button', { name: 'Update' }).click();

        await expect(page.getByRole('alert')).toHaveText('Tag updated successfully');
        console.log('✅ Tag updated successfully');
    });

    // ---------- TEST 5: Delete Action ----------
    test('should delete a tag successfully', async ({ page }) => {
        console.log('➡️ Starting test: Delete Tag');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Tags');

        const row = page.getByRole('row', { name: new RegExp(`^(${newName}|${tagData.name}).*`) });
        await expect(row).toBeVisible();
        console.log('✅ Tag row is visible for deletion');

        await row.getByRole('button').nth(2).click();
        await page.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByRole('alert')).toHaveText('Tag deleted successfully');
        console.log('✅ Tag deleted successfully');
    });
});

// Test suite for Admin - Tag Validations
test.describe('Admin - Tag Validations', () => {
    test.beforeEach(async ({ page }) => {
        console.log('➡️ Running beforeEach hook for Tag Validations');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Tags');
        console.log('✅ Logged in and navigated to Tags module');
    });

    // ---------- TEST 6: Validation for Missing Required Fields ----------
    test('should validate required fields when creating a tag', async ({ page }) => {
        console.log('➡️ Starting test: Validate Required Fields');
        await page.getByRole('tab', { name: 'New Tag' }).click();
        await page.getByRole('button', { name: 'Create' }).click();
        console.log('📤 Submitted empty Tag creation form');

        await expect(page.getByText('Name is required')).toBeVisible();
        await expect(page.getByText('Tag Code is required')).toBeVisible();
        console.log('✅ Validation messages verified for missing fields');
    });
    test('tag code should at most contain 5 characters', async ({ page }) => {
        console.log('➡️ Starting test: Validate Tag Code Length');
        await page.getByRole('tab', { name: 'New Tag' }).click();
        await page.getByRole('textbox', { name: 'Tag Code' }).fill('thisismorethan5chars');
        await page.getByRole('button', { name: 'Create' }).click();
        console.log('📤 Submitted Tag creation form with long Tag Code');
        await page.getByRole('button', { name: 'Create' }).click();
        
        await expect(page.getByText('Tag Code must be at most 5 characters')).toBeVisible();
        console.log('✅ Validation message verified for Tag Code length');
    
    });
});
