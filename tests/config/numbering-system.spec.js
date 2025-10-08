import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, goToConfigSection, filterAndDownload, filterAndSearch, toggleAndCheck } from '../utils/commonActions.js';

test.describe.serial('CI Tests — Admin Numbering System Management', () => {

    // Test data setup
    const numberData = {
        category: faker.commerce.department(),   // Random category
        name: faker.commerce.productName(),      // Random numbering system name
        value: [],                                // Picklist values
        successMessage: 'Numbering System has been created', // Success message
        randomDigit: Math.floor(Math.random() * 9) + 1, // Random digit 1–9
        randomDigit2: Math.floor(Math.random() * 9) + 1, // Another random digit
        description: faker.commerce.productDescription(), // Random description
    };

    const newName = faker.commerce.department().slice(0, 4);

    test('01 - Create Numbering System', async ({ page }) => {
        console.log('🔹 Test Start: Create Numbering System');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Numbering System');

        console.log(`✏️ Filling Numbering System details: ${numberData.name}`);
        await page.getByRole('tab', { name: 'New Numbering System' }).click();
        await page.getByRole('textbox', { name: 'Name' }).fill(numberData.name);
        await page.getByRole('textbox', { name: 'Maximum Digit' }).fill(numberData.randomDigit.toString());
        await page.getByRole('textbox', { name: 'Starting Value' }).fill(numberData.randomDigit2.toString());
        await page.locator('#num_sys_description').fill(numberData.description);

        console.log('🔹 Adding Field Type...');
        await page.getByRole('button', { name: 'Add Field Type' }).click();
        await page.getByRole('combobox', { name: 'Search Field Type' }).click();

        const buOptions = page.locator('ul[role="listbox"] li');
        await buOptions.first().waitFor({ state: 'visible' });
        const buCount = await buOptions.count();

        if (buCount === 0) throw new Error('❌ No Field Types available to select');

        const randomIndex = faker.number.int({ min: 0, max: buCount - 1 });
        const option = buOptions.nth(randomIndex);
        const label = (await option.textContent())?.trim();

        if (!label) throw new Error('❌ Failed to read option text');

        numberData.value = [label];
        console.log(`🔹 Selected Field Type: ${label}`);
        await option.click();

        // Special case handling for specific field types
        if (label === 'Constant String') {
            console.log('⚡ Handling Constant String field type...');
            await page.getByRole('textbox', { name: 'Enter Constant String' }).fill('random');
            await page.getByRole('button', { name: 'Add' }).click();

        } else if (label === 'System Data Field Types' || label === 'Year') {
            console.log(`⚡ Handling ${label} field type with dependent dropdown...`);
            await page.locator('#year-format, #sub_field_type_value').first().click()
                .then(() => page.locator('ul[role="listbox"] li').first().click());
            await page.getByRole('button', { name: 'Add' }).click();

        } else {
            console.log(`✅ Selected: ${label}`);
            await page.getByRole('button', { name: 'Add' }).click();
        }

        console.log(`🎯 Final Selected Value(s): ${numberData.value.join(', ')}`);
        await page.getByRole('button', { name: 'Generate' }).click();

        await expect(page.getByRole('alert')).toHaveText(numberData.successMessage);
        console.log('✅ Numbering System created successfully');
    });

    test('02 - Verify Numbering System and Toggle Status', async ({ page }) => {
        console.log('🔹 Test Start: Verify Numbering System and Toggle Status');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Numbering System');

        await filterAndSearch(page, 'Name', numberData.name);
        await page.waitForTimeout(2000);

        console.log('🔹 Verifying created numbering system details...');
        await expect(page.getByRole('cell', { name: numberData.name })).toBeVisible();
        await expect(page.getByRole('cell', { name: numberData.description })).toBeVisible();

        console.log('🔹 Toggling numbering system status...');
        await toggleAndCheck(page, 'Numbering System has been deactivated', 'Inactive');
        await toggleAndCheck(page, 'Numbering System has been activated', 'Active');
    });

    test('03 - Filter Numbering System and Download', async ({ page }) => {
        console.log('🔹 Test Start: Filter and Download Numbering System');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Numbering System');

        await filterAndDownload(page, 'Name', numberData.name);
        console.log('✅ Filter and download successful');
    });

    test('04 - Edit Numbering System', async ({ page }) => {
        console.log('🔹 Test Start: Edit Numbering System');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Numbering System');

        console.log(`✏️ Editing numbering system: ${numberData.name}`);
        await page.getByRole('row', { name: new RegExp(`^${numberData.name}.*`) }).getByRole('button').nth(1).click();
        await page.getByRole('textbox', { name: 'Name' }).fill(newName);
        await page.getByRole('button', { name: 'Update' }).isVisible();
        await page.getByRole('button', { name: 'Update' }).click();

        await expect(page.getByRole('alert')).toHaveText('Numbering System has been updated');
        console.log('✅ Numbering System updated successfully');
    });

    test('05 - Delete Numbering System', async ({ page }) => {
        console.log('🔹 Test Start: Delete Numbering System');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Numbering System');

        await filterAndSearch(page, 'Name', numberData.name);
        await page.waitForTimeout(2000);

        console.log(`🗑 Deleting numbering system: ${numberData.name}`);
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByRole('alert')).toHaveText('Numbering System has been deleted');
        console.log('✅ Numbering System deleted successfully');
    });
});

test.describe('Numbering System Validations', () => {
    test('Validation: Empty fields on new numbering system creation', async ({ page }) => {
        console.log('🔹 Test Start: Validate empty fields');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Numbering System');

        await page.getByRole('tab', { name: 'New Numbering System' }).click();
        await page.getByRole('button', { name: 'Generate' }).click();

        console.log('🔹 Checking validation messages...');
        await expect(page.getByText('Name is required')).toBeVisible();
        await expect(page.getByText('Maximum Digit is required')).toBeVisible();
        await expect(page.getByText('Starting Value is required')).toBeVisible();
        await expect(page.getByText('At least one Field Type is required')).toBeVisible();

        console.log('✅ Validation messages displayed successfully');
    });
});
