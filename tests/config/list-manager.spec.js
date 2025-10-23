import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, goToConfigSection, filterAndDownload, filterAndSearch, toggleAndCheck } from '../utils/commonActions.js';
import { ai } from '../../playwright.config.js';

if (ai.heal) {
  console.log('AI healing is enabled');
}
test.describe.serial('CI Tests — Admin List Manager', () => {
  // -------------------- TEST DATA SETUP --------------------
  const listData = {
    category: faker.commerce.department(), // Random pick list category
    name: faker.commerce.productName(), // Random pick list name
    value: faker.commerce.productAdjective(), // Random pick list value
    successMessage: 'Pick List created successfully', // Success message after creation
  };
  const newName = faker.commerce.department().slice(0, 4); // New name for edit operation

  // =========================================================
  // 01 - CREATE PICK LIST
  // =========================================================
  test('01 - Create Pick List successfully', async ({ page }) => {
    console.log('🔹 Test Start: Create Pick List');

    // Step 1: Login and navigate to List Manager module
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'List Manager');

    // Step 2: Fill new pick list details
    console.log(`✏️ Creating Pick List: Category="${listData.category}", Name="${listData.name}"`);
    await page.getByRole('tab', { name: 'New Pick List' }).click();
    await page.getByRole('textbox', { name: 'Enter Pick List Category Name' }).fill(listData.category);
    await page.getByRole('textbox', { name: 'Enter Pick List Name' }).fill(listData.name);
    await page.getByRole('textbox', { name: 'Enter Pick List Value' }).fill(listData.value);
    await page.getByRole('button', { name: 'Apply' }).click();

    // Step 3: Verify data appears in the table
    console.log('🔹 Verifying created pick list is visible and active');
    await expect(page.getByRole('cell', { name: listData.name })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Active' })).toBeVisible();

    // Step 4: Toggle status between Active/Inactive and back
    console.log('🔹 Testing toggle status functionality');
    await page.getByRole('cell', { name: 'Active' }).click();
    await page.getByRole('checkbox').click();
    await page.getByRole('cell', { name: 'Inactive' }).click();
    await page.getByRole('checkbox').click();
    await page.getByRole('cell', { name: 'Active' }).click();

    // Step 5: Save the new Pick List
    console.log('🔹 Clicking Create button');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByRole('alert')).toHaveText(listData.successMessage);

    console.log('✅ Pick List created successfully');
  });

  // =========================================================
  // 02 - VERIFY PICK LIST AND TOGGLE STATUS
  // =========================================================
  test('02 - Verify created Pick List and toggle status', async ({ page }) => {
    console.log('🔹 Test Start: Verify Pick List and Toggle Status');

    // Step 1: Login and go to List Manager
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'List Manager');

    // Step 2: Filter by category
    console.log(`🔹 Filtering Pick List by category: ${listData.category}`);
    await filterAndSearch(page, 'Pick List Category Name', listData.category);
    await page.waitForTimeout(2000);

    // Step 3: Verify that the created Pick List exists
    console.log('🔹 Verifying created pick list presence');
    await expect(page.getByRole('cell', { name: listData.name })).toBeVisible();
    await expect(page.getByRole('cell', { name: listData.value })).toBeVisible();

    // Step 4: Toggle status and validate alerts
    console.log('🔹 Toggling Pick List status');
    await toggleAndCheck(page, 'Pick List has been deactivated', 'Inactive');
    await toggleAndCheck(page, 'Pick List has been activated', 'Active');

    console.log('✅ Verified Pick List and toggled status successfully');
  });

  // =========================================================
  // 03 - FILTER PICK LIST AND DOWNLOAD
  // =========================================================
  test('03 - Filter Pick List by category and download results', async ({ page }) => {
    console.log('🔹 Test Start: Filter Pick List and Download');

    // Step 1: Login and navigate to module
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'List Manager');

    // Step 2: Filter by category and download results
    console.log(`🔹 Filtering by category: ${listData.category}`);
    await filterAndDownload(page, 'Pick List Category Name', listData.category);

    console.log('✅ Filter and download successful');
  });

  // =========================================================
  // 04 - EDIT PICK LIST
  // =========================================================
  test('04 - Edit Pick List', async ({ page }) => {
    console.log('🔹 Test Start: Edit Pick List');

    // Step 1: Login and go to List Manager
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'List Manager');

    // Step 2: Edit the pick list entry
    console.log(`✏️ Editing Pick List: ${listData.category}`);
    await page
      .getByRole('row', { name: new RegExp(`^${listData.category}.*`) })
      .getByRole('button')
      .nth(1)
      .click();

    // Step 3: Update pick list category name
    console.log(`🔹 Updating Pick List category to: ${newName}`);
    await page.getByRole('textbox', { name: 'Enter Pick List Category Name' }).fill(newName);
    await page.getByRole('button', { name: 'Update' }).isVisible();
    await page.getByRole('button', { name: 'Update' }).click();

    // Step 4: Validate success message
    await expect(page.getByRole('alert')).toHaveText('Pick List updated successfully');
    console.log('✅ Pick List updated successfully');
  });

  // =========================================================
  // 05 - DELETE PICK LIST
  // =========================================================
  test('05 - Delete Pick List', async ({ page }) => {
    console.log('🔹 Test Start: Delete Pick List');

    // Step 1: Login and navigate to List Manager
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'List Manager');

    // Step 2: Filter and locate pick list to delete
    console.log(`🔹 Filtering to find Pick List: ${listData.category}`);
    await filterAndSearch(page, 'Pick List Category Name', listData.category);
    await page.waitForTimeout(2000);

    // Step 3: Delete pick list and confirm
    console.log(`🗑 Deleting Pick List: ${listData.category}`);
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    // Step 4: Validate success message
    await expect(page.getByRole('alert')).toHaveText('Pick List deleted successfully');
    console.log('✅ Pick List deleted successfully');
  });
});

/*
=========================================================
OPTIONAL VALIDATION TEST (currently commented out)
=========================================================
This test checks whether validation messages appear
when attempting to create a Pick List without filling
required fields.
=========================================================

test.describe('List Manager Validations', () => {
  test('Validation: Empty Pick List creation', async ({ page }) => {
    console.log('🔹 Test Start: Validate Pick List creation with empty fields');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'List Manager');
    await page.getByRole('tab', { name: 'New Pick List' }).click();
    await page.getByRole('button', { name: 'Create' }).click();

    console.log('✅ Validation messages checked');
  });
});
*/
