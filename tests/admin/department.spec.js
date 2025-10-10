import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, toggleAndCheck, filterAndDownload, filterAndSearch, goToAdminSection} from '../utils/commonActions.js';

// Test suite for Admin - Department creation and verification
test.describe.serial('Admin - Department creation and verification', () => {
    // Shared test data across tests
    const deptData = {
        name: faker.commerce.department(),                   // Random department name
        code: faker.string.alphanumeric(4).toUpperCase(),    // Random department code (4 chars, uppercase)
        description: faker.commerce.productDescription(),    // Random description
        successMessage: 'Department created successfully',   // Success message for department creation
        businessUnits: [],                                   // Will be dynamically populated during test
    };
    const newName = faker.commerce.department().slice(0, 4);

    console.log('Test Department Data:', deptData);
    console.log('New Name for Edit Test:', newName);

    // ---------- TEST 1: Create a New Department ----------
    test('should create a new department successfully', async ({ page }) => {
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Department');

        // Wait for "New Department" tab to be visible
        await expect(page.getByRole('tab', { name: 'New Department' })).toBeVisible();
        await page.getByRole('tab', { name: 'New Department' }).click();

        // Fill out department creation form
        await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
        await page.getByRole('textbox', { name: 'Name' }).fill(deptData.name);

        await expect(page.getByRole('textbox', { name: 'Code' })).toBeVisible();
        await page.getByRole('textbox', { name: 'Code' }).fill(deptData.code);

        // -------- Random multiple Business Unit selection --------
        await page.locator('#business_unit').click();
        const buOptions = page.locator('ul[role="listbox"] li');

        // Wait until business unit options are loaded
        await buOptions.first().waitFor({ state: 'visible' });

        const buCount = await buOptions.count();
        if (buCount === 0) {
            throw new Error('No Business Units available to select');
        }

        // Pick random indexes to select business units
        const numToSelect = faker.number.int({ min: 1, max: 10 });
        const indexes = faker.helpers.arrayElements([...Array(buCount).keys()], numToSelect);

        deptData.businessUnits = [];
        for (const idx of indexes) {
            const option = buOptions.nth(idx);
            const label = (await option.textContent())?.trim();
            if (label) {
                deptData.businessUnits.push(label);
            }
            await option.click(); // Select business unit
        }
        console.log(`✅ Selected Business Units: ${deptData.businessUnits.join(', ')}`);

        // Fill in description
        await expect(page.locator('#org_description')).toBeVisible();
        await page.locator('#org_description').fill(deptData.description);

        // Submit form
        await page.getByRole('button', { name: 'Create' }).click();

        // Verify success message (use toContainText for safer check)
        await expect(page.getByRole('alert')).toContainText(deptData.successMessage);
    });

    // ---------- TEST 2: Verify Created Department ----------
    test('should verify the created department and toggle its status', async ({ page }) => {
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Department');

        await filterAndSearch(page, 'Department Code', deptData.code);

        // Wait until row with department appears (instead of timeout)
        await expect(page.getByRole('cell', { name: deptData.name }).first()).toBeVisible();
        await expect(page.getByRole('cell', { name: deptData.code })).toBeVisible();

        // Use reusable toggle function
        await toggleAndCheck(page, 'Department has been deactivated', 'Inactive');
        await toggleAndCheck(page, 'Department has been activated', 'Active');
    });

    // ---------- TEST 3: Filtering + Download ----------
    test('should filter departments by code and download results', async ({ page }) => {
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Department');

        // Reusable filter + download
        await filterAndDownload(page, 'Department Code', deptData.code);
    });
    //NOTE: Edit test commented out as the Edit functionality is currently not working
    // test('Edit action button working', async ({ page }) => {
    //     await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    //     await goToModule(page, 'Department');

    //     // Click Edit action
    //     await page.getByRole('row', { name: new RegExp(`^${deptData.name}.*`) }).getByRole('button').nth(1).click();

    //     // Update Site Name
    //     await page.getByRole('textbox', { name: 'Name' }).fill(newName);
    //     await page.getByRole('button', { name: 'Update' }).click();

    //     // Verify success
    //     await expect(page.getByRole('alert')).toHaveText('Department updated successfully');
    // });

    // ---------- TEST 4: Delete Action ----------
    test('Delete action button working', async ({ page }) => {
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Department');

        const row = page.getByRole('row', { name: new RegExp(`^(${newName}|${deptData.name}).*`) });

        // Wait until row is visible
        await expect(row).toBeVisible();

        await row.getByRole('button').nth(2).click();
        await page.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByRole('alert')).toHaveText('Department deleted successfully');
    });
});

// ---------------- VALIDATIONS IN NEW DEPARTMENT CREATION ----------------
test.describe('Admin - Department Verifications in User Creation', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Department');
    });

    // ---------- TEST 5: Missing Required Fields ----------
    test('should show validation errors when required fields are missing', async ({ page }) => {
        await expect(page.getByRole('tab', { name: 'New Department' })).toBeVisible();
        await page.getByRole('tab', { name: 'New Department' }).click();

        await page.getByRole('button', { name: 'Create' }).click();

        // Expect validation messages
        await expect(page.getByText('Department Name is required')).toBeVisible();
        await expect(page.getByText('Department Code is required')).toBeVisible();
        await expect(page.getByText('Please select a Site')).toBeVisible();
    });

    // ---------- TEST 6: Validate Department Code Format ----------
    test('should validate department code format (max 5 alphanumeric characters)', async ({ page }) => {
        await page.getByRole('tab', { name: 'New Department' }).click();

        // Invalid long code
        await page.locator('#dept_code').fill('TENCHARACTERSINVALIDTEST');
        await page.getByRole('button', { name: 'Create' }).click();
        await expect(page.getByText(/Department Code must be at/)).toBeVisible();

        // Valid short code (<= 5 chars)
        await page.locator('#dept_code').fill('ABC1');

        // Wait for validation message to disappear
        await expect(page.getByText('Department Code must be at most 5 characters')).toHaveCount(0);
    });
});
