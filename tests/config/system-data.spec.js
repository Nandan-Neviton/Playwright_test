import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, goToConfigSection, filterAndDownload, filterAndSearch, toggleAndCheck } from '../utils/commonActions.js';

test.describe.serial('CI Tests — Admin System Data Field Types', () => {

    // Test data setup
    const systemData = {
        name: faker.commerce.productName(),                      // Random field name
        value: [],                                                // Random selected value
        successMessage: 'System Data Field Type created successfully', // Success message
        randomDigit: Math.floor(Math.random() * 9) + 1,         // Random 1–9 digit
    };
    const newName = faker.commerce.department().slice(0, 4);

    test('01 - Create a new System Data Field Type', async ({ page }) => {
        console.log('🔹 Test Start: Create System Data Field Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'System Data Field Types');

        console.log(`✏️ Creating field type with name: ${systemData.name}`);
        await page.getByRole('tab', { name: 'New System Data Field Types' }).click();

        await page.getByRole('textbox', { name: 'Name' }).fill(systemData.name);

        console.log('🔹 Opening Data Field Type dropdown');
        await page.locator('#data_field_type').click();

        const buOptions = page.locator('ul[role="listbox"] li');
        await buOptions.first().waitFor({ state: 'visible' });

        const buCount = await buOptions.count();
        if (buCount === 0) {
            throw new Error('❌ No Data Field Type options available');
        }

        console.log('🔹 Selecting a random Data Field Type');
        const randomIndex = faker.number.int({ min: 0, max: buCount - 1 });
        const option = buOptions.nth(randomIndex);
        const label = (await option.textContent())?.trim();

        if (!label) {
            throw new Error('❌ Failed to read option text');
        }

        systemData.value = [label];
        await option.click();

        console.log(`⚡ Selected Data Field Type: ${label}`);
        if (label === 'List Manager') {
            console.log('⚡ Handling List Manager...');
            await page.locator('#select_picklist').first().click();
            await page.locator('#select_picklist_name').first().click();
        } else if (label === 'String') {
            console.log('⚡ Handling String...');
            await page.getByRole('textbox', { name: 'Define Length' }).fill(systemData.randomDigit.toString());
        }

        console.log(`🎯 Final Selected Value: ${systemData.value[0]}`);
        await page.getByRole('button', { name: 'Create' }).click();

        await expect(page.getByRole('alert')).toHaveText(systemData.successMessage);
        console.log('✅ System Data Field Type created successfully');
    });

    test('02 - Verify System Data Field Type and toggle status', async ({ page }) => {
        console.log('🔹 Test Start: Verify and toggle System Data Field Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'System Data Field Types');

        console.log(`🔹 Filtering field type by name: ${systemData.name}`);
        await filterAndSearch(page, 'Name', systemData.name);
        await page.waitForTimeout(2000);

        await expect(page.getByRole('cell', { name: systemData.name })).toBeVisible();
        await expect(page.getByRole('cell', { name: systemData.value })).toBeVisible();

        console.log('🔹 Toggling System Data Field Type status');
        await toggleAndCheck(page, 'System Data Field Type has been deactivated', 'Inactive');
        await toggleAndCheck(page, 'System Data Field Type has been activated', 'Active');

        console.log('✅ Verified and toggled System Data Field Type successfully');
    });

    test('03 - Filter System Data Field Types and download', async ({ page }) => {
        console.log('🔹 Test Start: Filter and download System Data Field Types');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'System Data Field Types');

        console.log(`🔹 Filtering by field name: ${systemData.name}`);
        await filterAndDownload(page, 'Name', systemData.name);

        console.log('✅ Filter and download completed successfully');
    });

    test('04 - Edit System Data Field Type', async ({ page }) => {
        console.log('🔹 Test Start: Edit System Data Field Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'System Data Field Types');

        console.log(`✏️ Editing field type: ${systemData.name}`);
        await page.getByRole('row', { name: new RegExp(`^${systemData.name}.*`) }).getByRole('button').nth(1).click();

        console.log(`🔹 Updating field type name to: ${newName}`);
        await page.getByRole('textbox', { name: 'Name' }).fill(newName);
        await page.getByRole('button', { name: 'Update' }).click();

        await expect(page.getByRole('alert')).toHaveText('System Data Field Type updated successfully');
        console.log('✅ System Data Field Type updated successfully');
    });

    test('05 - Delete System Data Field Type', async ({ page }) => {
        console.log('🔹 Test Start: Delete System Data Field Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'System Data Field Types');

        console.log(`🔹 Filtering field type: ${systemData.name}`);
        await filterAndSearch(page, 'Name', systemData.name);
        await page.waitForTimeout(2000);

        console.log(`🗑 Deleting System Data Field Type: ${systemData.name}`);
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByRole('alert')).toHaveText('System Data Field Type deleted successfully');
        console.log('✅ System Data Field Type deleted successfully');
    });
});

test.describe('System Data Field Type Validations', () => {
    test('Validation: Creating with empty fields should show errors', async ({ page }) => {
        console.log('🔹 Test Start: Validate empty System Data Field Type creation');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'System Data Field Types');

        await page.getByRole('tab', { name: 'New System Data Field Types' }).click();
        await page.getByRole('button', { name: 'Create' }).click();

        console.log('🔹 Checking required field validations');
        await expect(page.getByText('Name is required')).toBeVisible();
        await expect(page.getByText('Data Field Type is required')).toBeVisible();

        console.log('✅ Validation messages displayed successfully');
    });
});
