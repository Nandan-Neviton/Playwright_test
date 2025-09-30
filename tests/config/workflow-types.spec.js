// playwright/tests/workflowDataFieldTypes.spec.js
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import {
    goToModule,
    goToConfigSection,
    filterAndDownload,
    filterAndSearch,
    toggleAndCheck,
} from '../utils/commonActions.js';

// =======================
// Test Suite: Workflow Types
// =======================
test.describe.serial('CI Tests — Admin: Workflow Types', () => {
    // -----------------------
    // Test Data (Randomized for CI runs)
    // -----------------------
    const workflowData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        prefix: faker.string.alpha(3).toUpperCase(),
        serialNumberStart: faker.number.int({ min: 100, max: 999 }).toString(),
        userCount: faker.number.int({ min: 1, max: 10 }).toString(),
        slaDays: faker.number.int({ min: 1, max: 30 }).toString(),
        actionType: 'Retire', // Fixed for stability
        releaseCondition: 'Delay',
        incrementType: 'Minor',
        role: 'Admin',
        department1: 'Automotive',
        department2: 'QA_ACT',
        checklist: 'Sleek Ceramic Shoes', // Replace with faker if dynamic list exists
        lifecycleState: '@NA_Approve',
        printTemplate: 'Template 1',
    };

    const updatedName = faker.commerce.department().slice(0, 4);

    // -----------------------
    // 01 - Create
    // -----------------------
    test('01 - Create Workflow Type', async ({ page }) => {
        console.log('🚀 [START] Creating new Workflow Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Workflow Type');

        // Fill form
        console.log('📝 Filling Workflow Type creation form...');
        await page.getByRole('tab', { name: 'New Workflow Type' }).click();
        await page.getByRole('textbox', { name: 'Workflow Type Name' }).fill(workflowData.name);
        await page.getByRole('textbox', { name: 'Enter Description' }).fill(workflowData.description);
        await page.getByRole('textbox', { name: 'Enter Prefix' }).fill(workflowData.prefix);
        await page.locator('#workflow_type_sn_start').fill(workflowData.serialNumberStart);
        await page.locator('#workflow_type_sn_length').fill('6');

        // Dropdown selections
        console.log('🔽 Selecting dropdown values...');
        await page.locator('#workflow_Action_type').click();
        await page.getByRole('option', { name: workflowData.actionType }).click();

        await page.locator('#add_lifecycle_print_template').click();
        await page.getByRole('option', { name: '@NA_PrintTemplate' }).click();

        await page.locator('#workflow_type_release_conditions').click();
        await page.getByRole('option', { name: workflowData.releaseCondition }).click();

        await page.getByRole('combobox', { name: 'Major' }).click();
        await page.getByRole('option', { name: 'Major' }).click();

        await page.getByPlaceholder('Enter Days').fill('5');
        await page.getByText('SerialParallel').click();
        await page.getByText('YesNo').click();

        // Lifecycle setup
        console.log('🔗 Adding lifecycle configuration...');
        await page.getByRole('button', { name: 'Add Lifecycle State' }).click();
        await page.locator('#add_lifecycle_state').click();
        await page.getByRole('option', { name: workflowData.lifecycleState }).click();

        await page.locator('#add_lifecycle_role').click();
        await page.getByRole('option', { name: workflowData.role }).click();

        await page.locator('#add_lifecycle_department').first().click();
        await page.getByRole('option', { name: workflowData.department1 }).click();
        await page.locator('#add_lifecycle_department').nth(1).click();
        await page.getByRole('option', { name: workflowData.department2 }).click();

        await page.locator('#add_lifecycle_checklist').click();
        await page.getByRole('option', { name: workflowData.checklist }).click();

        await page.locator('input[name="userCount"]').fill(workflowData.userCount);
        await page.locator('input[name="slaDays"]').fill(workflowData.slaDays);

        await page.locator('#add_lifecycle_increment_type').click();
        await page.getByRole('option', { name: workflowData.incrementType }).click();

        // Save
        console.log('💾 Submitting Workflow Type creation...');
        await page.getByRole('button', { name: 'Map' }).click();
        await page.getByRole('button', { name: 'Create' }).click();

        console.log('✅ [SUCCESS] Workflow Type created:', workflowData);
    });

    // -----------------------
    // 02 - Verify + Toggle
    // -----------------------
    test('02 - Verify & Toggle Workflow Type', async ({ page }) => {
        console.log('🔍 [START] Verifying and toggling Workflow Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Workflow Type');

        await filterAndSearch(page, 'Name', workflowData.name);
        await page.waitForTimeout(2000);

        await expect(page.getByRole('cell', { name: workflowData.name })).toBeVisible();
        await expect(page.getByRole('cell', { name: workflowData.description })).toBeVisible();

        console.log('🔁 Toggling status...');
        await toggleAndCheck(page, 'Workflow Type has been deactivated', 'Inactive');
        await toggleAndCheck(page, 'Workflow Type has been activated', 'Active');

        console.log('✅ [SUCCESS] Verified and toggled Workflow Type');
    });

    // -----------------------
    // 03 - Filter & Download
    // -----------------------
    test('03 - Filter & Download Workflow Type', async ({ page }) => {
        console.log('📂 [START] Filtering and downloading Workflow Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Workflow Type');

        await filterAndDownload(page, 'Name', workflowData.name);

        console.log('✅ [SUCCESS] Filter and download completed');
    });

    // -----------------------
    // 04 - Edit
    // -----------------------
    test('04 - Edit Workflow Type', async ({ page }) => {
        console.log('✏️ [START] Editing Workflow Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Workflow Type');

        await page.getByRole('row', { name: new RegExp(`^${workflowData.name}.*`) })
            .getByRole('button')
            .nth(1)
            .click();

        await page.getByRole('textbox', { name: 'Name' }).fill(updatedName);
        await page.waitForTimeout(3000); // Wait for input stabilization
        await page.getByRole('button', { name: 'Update' }).click();

        await expect(page.getByRole('alert')).toHaveText('Workflow Type updated successfully');
        console.log(`✅ [SUCCESS] Workflow Type updated to: ${updatedName}`);
    });

    // -----------------------
    // 05 - Delete
    // -----------------------
    test('05 - Delete Workflow Type', async ({ page }) => {
        console.log('🗑 [START] Deleting Workflow Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Workflow Type');

        await filterAndSearch(page, 'Name', workflowData.name);
        await page.waitForTimeout(2000);

        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByRole('alert')).toHaveText('Workflow Type deleted successfully');
        console.log(`✅ [SUCCESS] Workflow Type deleted: ${workflowData.name}`);
    });
});

// =======================
// Negative Tests: Validations
// =======================
test.describe('CI Tests — Validations: Workflow Types', () => {
    test('Validation: Empty field submission should show error messages', async ({ page }) => {
        console.log('⚠️ [START] Validating required field errors on empty form submission');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Workflow Type');

        await page.getByRole('tab', { name: 'New Workflow Type' }).click();
        await page.getByRole('button', { name: 'Create' }).click();

        // Assertions
        console.log('🔎 Checking validation error messages...');
        await expect(page.getByText('Name is required')).toBeVisible();
        await expect(page.getByText('Prefix is required')).toBeVisible();
        await expect(page.getByText('WF-Serial Number Start Value is required')).toBeVisible();
        await expect(page.getByText('WF-Serial Number Length Value is required')).toBeVisible();
        await expect(page.getByText('Please select Workflow Action Type')).toBeVisible();
        await expect(page.getByText('Please select Workflow Release Condition')).toBeVisible();
        await expect(page.getByText('Please select At least one Lifecycle State')).toBeVisible();

        console.log('✅ [SUCCESS] Validation errors displayed correctly');
    });
});
