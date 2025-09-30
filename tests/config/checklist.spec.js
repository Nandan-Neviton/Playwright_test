import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, goToConfigSection, filterAndDownload, filterAndSearch, toggleAndCheck } from '../utils/commonActions.js';

test.describe.serial('CI Tests — Admin Checklist', () => {
    // Test data setup
    const checklistData = {
        name: faker.commerce.productName(),                // Random checklist name
        description: faker.commerce.productDescription(),  // Random checklist description
        successMessage: 'Checklist created successfully',  // Success message after creation
    };
    const newName = faker.commerce.department().slice(0, 4);
    const headerName = faker.commerce.department().slice(0, 4);

    test('01 - Create Checklist successfully', async ({ page }) => {
        console.log('🔹 Test Start: Create Checklist');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Checklist');

        await page.getByRole('tab', { name: 'New Checklist' }).click();
        await page.getByRole('textbox', { name: 'Checklist Name' }).fill(checklistData.name);
        await page.getByRole('textbox', { name: 'Checklist Description' }).fill(checklistData.description);
        await page.locator('#checklist_description').fill(checklistData.description);

        await page.getByRole('button', { name: 'Create' }).click();

        // Add checkpoint
        await page.getByRole('button', { name: 'Add Checkpoint' }).click();
        await page.getByRole('textbox', { name: 'Enter Checkpoint Name' }).fill('checkpoint1');

        // Add table column
        await page.getByRole('button', { name: 'Add Table Column' }).click();
        await page.locator('#checkpoint_type').click();
        await page.getByRole('option', { name: 'Constant String' }).click();
        await page.getByRole('textbox', { name: 'Enter Header Name' }).fill(headerName);
        await page.getByRole('textbox', { name: 'Enter String Name' }).fill('random');
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        await page.getByRole('button', { name: 'Create' }).click();

        await expect(page.getByRole('alert')).toHaveText(checklistData.successMessage);
        console.log('✅ Checklist created successfully');
    });

    test('02 - Verify created Checklist and toggle status', async ({ page }) => {
        console.log('🔹 Test Start: Verify Checklist and Toggle Status');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Checklist');

        console.log(`🔹 Filtering by Name: ${checklistData.name}`);
        await filterAndSearch(page, 'Name', checklistData.name);
        await page.waitForTimeout(2000);

        await expect(page.getByRole('cell', { name: checklistData.name })).toBeVisible();

        console.log('🔹 Toggling status');
        await toggleAndCheck(page, 'Checklist has been deactivated', 'Inactive');
        await toggleAndCheck(page, 'Checklist has been activated', 'Active');

        console.log('✅ Checklist verified and toggled');
    });

    test('03 - Filter Checklist and download results', async ({ page }) => {
        console.log('🔹 Test Start: Filter and Download Checklist');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Checklist');

        console.log(`🔹 Filtering by Name: ${checklistData.name}`);
        await filterAndDownload(page, 'Name', checklistData.name);

        console.log('✅ Filter and download completed');
    });

    test('04 - Edit Checklist', async ({ page }) => {
        console.log('🔹 Test Start: Edit Checklist');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Checklist');

        console.log(`✏️ Editing Checklist: ${checklistData.name}`);
        await page.getByRole('row', { name: new RegExp(`^Clone ${checklistData.name}.*`) }).getByRole('button').nth(2).click();

        console.log(`🔹 Updating Name to: ${newName}`);
        await page.getByRole('textbox', { name: 'Checklist Name' }).fill(newName);
        await page.getByRole('button', { name: 'Update' }).click();

        await expect(page.getByRole('alert')).toHaveText('Checklist updated successfully');
        console.log('✅ Checklist updated successfully');
    });

    test('05 - Delete Checklist', async ({ page }) => {
        console.log('🔹 Test Start: Delete Checklist');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Checklist');

        console.log(`🔹 Filtering for deletion: ${checklistData.name}`);
        await filterAndSearch(page, 'Name', checklistData.name);
        await page.waitForTimeout(2000);

        console.log(`🗑 Deleting Checklist: ${checklistData.name}`);
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByRole('alert')).toHaveText('Checklist deleted successfully');
        console.log('✅ Checklist deleted successfully');
    });
});

test.describe('Checklist Validations', () => {
    test('Validation: Empty fields on new Checklist creation', async ({ page }) => {
        console.log('🔹 Test Start: Validate empty fields on Checklist creation');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Checklist');

        await page.getByRole('tab', { name: 'New Checklist' }).click();
        await page.getByRole('button', { name: 'Create' }).click();

        console.log('🔹 Checking validation messages...');
        await expect(page.getByText('Name is required')).toBeVisible();
        await expect(page.getByText('At least one checkpoint is required')).toBeVisible();

        console.log('✅ Validation messages displayed correctly');
    });
});
