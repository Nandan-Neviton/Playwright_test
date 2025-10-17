import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, goToConfigSection, filterAndDownload, filterAndSearch, toggleAndCheck } from '../utils/commonActions.js';

test.describe.serial('🧩 CI Tests — Admin Checklist', () => {
  // ✅ Test Data Setup — Using Faker for realistic random data
  const checklistData = {
    name: faker.commerce.productName(), // Random checklist name
    description: faker.commerce.productDescription(), // Random checklist description
    successMessage: 'Checklist created successfully', // Expected success message
  };
  const newName = faker.commerce.department().slice(0, 4); // Random short name for edit
  const headerName = faker.commerce.department().slice(0, 4); // Random column header

  // -------------------------------
  // 🧪 Test 01 - Create Checklist
  // -------------------------------
  test('01 - Should create a new Checklist successfully', async ({ page }) => {
    console.log('🔹 [TEST START] Create Checklist');

    // Step 1: Login to the application
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

    // Step 2: Navigate to Config → Checklist module
    await goToConfigSection(page);
    await goToModule(page, 'Checklist');

    // Step 3: Click "New Checklist" tab
    await page.getByRole('tab', { name: 'New Checklist' }).click();

    // Step 4: Fill in basic details (Name & Description)
    await page.getByRole('textbox', { name: 'Checklist Name' }).fill(checklistData.name);
    await page.getByRole('textbox', { name: 'Checklist Description' }).fill(checklistData.description);
    await page.locator('#checklist_description').fill(checklistData.description); // Ensure filled properly

    // Step 5: Create checklist
    await page.getByRole('button', { name: 'Create' }).click();

    // Step 6: Add first checkpoint
    await page.getByRole('button', { name: 'Add Checkpoint' }).click();
    await page.getByRole('textbox', { name: 'Enter Checkpoint Name' }).fill('checkpoint1');

    // Step 7: Add table column with Constant String
    await page.getByRole('button', { name: 'Add Table Column' }).click();
    await page.locator('#checkpoint_type').click();
    await page.getByRole('option', { name: 'Constant String' }).click();
    await page.getByRole('textbox', { name: 'Enter Header Name' }).fill(headerName);
    await page.getByRole('textbox', { name: 'Enter String Name' }).fill('random');
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // Step 8: Final Create click
    await page.getByRole('button', { name: 'Create' }).click();

    // Step 9: Verify success alert
    await expect(page.getByRole('alert')).toHaveText(checklistData.successMessage);
    console.log('✅ Checklist created successfully');
  });

  // -------------------------------
  // 🧪 Test 02 - Verify & Toggle Checklist
  // -------------------------------
  test('02 - Should verify created Checklist and toggle its status', async ({ page }) => {
    console.log('🔹 [TEST START] Verify and Toggle Checklist');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Checklist');

    // Step 1: Search for the created checklist
    console.log(`🔹 Filtering by Name: ${checklistData.name}`);
    await filterAndSearch(page, 'Name', checklistData.name);
    await page.waitForTimeout(2000);

    // Step 2: Validate visibility
    await expect(page.getByRole('cell', { name: checklistData.name })).toBeVisible();

    // Step 3: Toggle Active/Inactive
    console.log('🔹 Toggling checklist status');
    await toggleAndCheck(page, 'Checklist has been deactivated', 'Inactive');
    await toggleAndCheck(page, 'Checklist has been activated', 'Active');

    console.log('✅ Checklist verified and toggled successfully');
  });

  // -------------------------------
  // 🧪 Test 03 - Filter & Download Checklist
  // -------------------------------
  test('03 - Should filter Checklist and download search results', async ({ page }) => {
    console.log('🔹 [TEST START] Filter & Download Checklist');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Checklist');

    // Step 1: Apply filter and trigger download
    console.log(`🔹 Filtering by Name: ${checklistData.name}`);
    await filterAndDownload(page, 'Name', checklistData.name);

    console.log('✅ Filter and download completed');
  });

  // -------------------------------
  // 🧪 Test 04 - Edit Checklist
  // -------------------------------
  test('04 - Should edit an existing Checklist successfully', async ({ page }) => {
    console.log('🔹 [TEST START] Edit Checklist');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Checklist');

    // Step 1: Find and click edit icon for the created checklist
    console.log(`✏️ Editing Checklist: ${checklistData.name}`);
    await page
      .getByRole('row', { name: new RegExp(`^Clone ${checklistData.name}.*`) })
      .getByRole('button')
      .nth(2)
      .click();

    // Step 2: Update checklist name
    console.log(`🔹 Updating Name to: ${newName}`);
    await page.getByRole('textbox', { name: 'Checklist Name' }).fill(newName);
    await page.getByRole('button', { name: 'Update' }).click();

    // Step 3: Verify update success message
    await expect(page.getByRole('alert')).toHaveText('Checklist updated successfully');
    console.log('✅ Checklist updated successfully');
  });

  // -------------------------------
  // 🧪 Test 05 - Delete Checklist
  // -------------------------------
  test('05 - Should delete Checklist successfully', async ({ page }) => {
    console.log('🔹 [TEST START] Delete Checklist');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Checklist');

    // Step 1: Search for checklist to delete
    console.log(`🔹 Filtering for deletion: ${checklistData.name}`);
    await filterAndSearch(page, 'Name', checklistData.name);
    await page.waitForTimeout(2000);

    // Step 2: Perform delete
    console.log(`🗑 Deleting Checklist: ${checklistData.name}`);
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    // Step 3: Verify success message
    await expect(page.getByRole('alert')).toHaveText('Checklist deleted successfully');
    console.log('✅ Checklist deleted successfully');
  });
});

// -----------------------------------------
// 🧪 Separate Test Suite: Checklist Validations
// -----------------------------------------
test.describe('⚠️ Checklist Validations', () => {
  test('Validation - Should show messages for empty fields on new Checklist creation', async ({ page }) => {
    console.log('🔹 [TEST START] Validate empty Checklist fields');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Checklist');

    // Step 1: Go to "New Checklist" tab
    await page.getByRole('tab', { name: 'New Checklist' }).click();

    // Step 2: Try creating without filling data
    await page.getByRole('button', { name: 'Create' }).click();

    // Step 3: Check for validation messages
    console.log('🔹 Checking validation messages...');
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('At least one checkpoint is required')).toBeVisible();

    console.log('✅ Validation messages displayed correctly');
  });
});
