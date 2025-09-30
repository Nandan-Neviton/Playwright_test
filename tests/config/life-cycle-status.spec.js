import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, goToConfigSection, filterAndDownload, filterAndSearch, toggleAndCheck } from '../utils/commonActions.js';

test.describe.serial('CI Tests — Admin Life Cycle States', () => {
    // Test data setup
    const lifeData = {
        name: faker.commerce.productName(),                         // Random state name
        description: faker.commerce.productDescription(),           // Random description
        successMessage: 'Life Cycle States created successfully',   // Success message after creation
    };
    const newName = faker.commerce.department().slice(0, 4);

    test('01 - Create Life Cycle States successfully', async ({ page }) => {
        console.log('🔹 Test Start: Create Life Cycle States');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Life Cycle States');

        await page.getByRole('tab', { name: 'New Life Cycle States' }).click();
        await page.getByRole('textbox', { name: 'Enter Name' }).fill(lifeData.name);
        await page.locator('#life_cycle_state_description').fill(lifeData.description);
        await page.getByRole('button', { name: 'Create' }).click();

        await expect(page.getByRole('alert')).toContainText(lifeData.successMessage);
        console.log('✅ Life Cycle State created successfully');
    });

    test('02 - Verify created Life Cycle State and toggle status', async ({ page }) => {
        console.log('🔹 Test Start: Verify Life Cycle State and Toggle Status');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Life Cycle States');

        console.log(`🔹 Filtering by Name: ${lifeData.name}`);
        await filterAndSearch(page, 'Name', lifeData.name);

        await expect(page.getByRole('cell', { name: lifeData.name })).toBeVisible();

        console.log('🔹 Toggling status');
        await toggleAndCheck(page, 'Life Cycle States has been deactivated', 'Inactive');
        await toggleAndCheck(page, 'Life Cycle States has been activated', 'Active');

        console.log('✅ Life Cycle State verified and toggled');
    });

    test('03 - Filter Life Cycle States and download results', async ({ page }) => {
        console.log('🔹 Test Start: Filter and Download Life Cycle States');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Life Cycle States');

        console.log(`🔹 Filtering by Name: ${lifeData.name}`);
        await filterAndDownload(page, 'Name', lifeData.name);

        console.log('✅ Filter and download completed');
    });

    test('04 - Edit Life Cycle State', async ({ page }) => {
        console.log('🔹 Test Start: Edit Life Cycle State');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Life Cycle States');

        console.log(`✏️ Editing Life Cycle State: ${lifeData.name}`);
        await page.getByRole('row', { name: new RegExp(`^${lifeData.name}.*`) })
            .getByRole('button')
            .nth(1)
            .click();

        console.log(`🔹 Updating Name to: ${newName}`);
        await page.getByRole('textbox', { name: 'Enter Name' }).fill(newName);
        await page.getByRole('button', { name: 'Update' }).click();

        await expect(page.getByRole('alert')).toHaveText('Life Cycle States updated successfully');
        console.log('✅ Life Cycle State updated');
    });

    test('05 - Delete Life Cycle State', async ({ page }) => {
        console.log('🔹 Test Start: Delete Life Cycle State');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Life Cycle States');

        console.log(`🔹 Filtering for deletion: ${lifeData.name}`);
        await filterAndSearch(page, 'Name', lifeData.name);
        await page.waitForTimeout(2000);

        console.log(`🗑 Deleting Life Cycle State: ${lifeData.name}`);
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByRole('alert')).toHaveText('Life Cycle States deleted successfully');
        console.log('✅ Life Cycle State deleted');
    });
});

test.describe('Numbering System Validations', () => {
    test('Validation: Empty fields on new numbering system creation', async ({ page }) => {
        console.log('🔹 Test Start: Validate empty fields');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Life Cycle States');

        await page.getByRole('tab', { name: 'New Life Cycle States' }).click();
        await page.getByRole('button', { name: 'Create' }).click();

        console.log('🔹 Checking validation messages...');
        await expect(page.getByText('Name is required')).toBeVisible();

        console.log('✅ Validation messages displayed');
    });
});
