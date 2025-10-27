import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, goToConfigSection, filterAndDownload, filterAndSearch, toggleAndCheck } from '../utils/commonActions.js';

test.describe.serial('CI Tests — Admin System Data Field Types', () => {

  // ---------- Test Data Setup ----------
  const systemData = {
    name: faker.commerce.productName(), // Random field name for testing
    value: [], // To store the selected data field type
    successMessage: 'System Data Field Type created successfully', // Expected success message
    randomDigit: Math.floor(Math.random() * 9) + 1, // Random 1–9 digit for input fields
  };

  // New name used for edit operation
  const newName = faker.commerce.department().slice(0, 4);

  // ==============================================================
  // TEST 01 — Create a New System Data Field Type
  // ==============================================================
  test('01 - Create a new System Data Field Type', async ({ page }) => {
    console.log('🔹 [START] Create System Data Field Type');

    // Step 1: Login and navigate to System Data Field Types
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'System Data Field Types');

    // Step 2: Open "New System Data Field Types" tab
    console.log(`✏️ Creating a new System Data Field Type: ${systemData.name}`);
    await page.getByRole('tab', { name: 'New System Data Field Types' }).click();

    // Step 3: Fill the Name field
    await page.getByRole('textbox', { name: 'Name' }).fill(systemData.name);

    // Step 4: Open Data Field Type dropdown
    console.log('🔹 Opening Data Field Type dropdown');
    await page.locator('#data_field_type').click();

    const buOptions = page.locator('ul[role="listbox"] li');
    await buOptions.first().waitFor({ state: 'visible' });
    const buCount = await buOptions.count();

    if (buCount === 0) throw new Error('❌ No Data Field Type options available');

    // Step 5: Randomly select one option
    console.log('🔹 Selecting a random Data Field Type');
    const randomIndex = faker.number.int({ min: 0, max: buCount - 1 });
    const option = buOptions.nth(randomIndex);
    const label = (await option.textContent())?.trim();
    if (!label) throw new Error('❌ Failed to read Data Field Type text');

    systemData.value = [label];
    await option.click();
    console.log(`⚡ Selected Data Field Type: ${label}`);

    // Step 6: Handle special field types requiring additional input
    if (label === 'List Manager') {
      console.log('⚡ Handling "List Manager" specific input');
      await page.locator('#select_picklist').first().click();
      await page.locator('#select_picklist_name').first().click();

    } else if (label === 'String') {
      console.log('⚡ Handling "String" type with length field');
      await page.getByRole('textbox', { name: 'Define Length' }).fill(systemData.randomDigit.toString());
    }

    // Step 7: Create the new field type
    console.log(`🎯 Final Selected Value: ${systemData.value[0]}`);
    await page.getByRole('button', { name: 'Create' }).click();

    // Step 8: Verify success message
    await expect(page.getByRole('alert')).toHaveText(systemData.successMessage);
    console.log('✅ System Data Field Type created successfully');
  });

  // ==============================================================
  // TEST 02 — Verify Created Field Type and Toggle Status
  // ==============================================================
  test('02 - Verify System Data Field Type and toggle status', async ({ page }) => {
    console.log('🔹 [START] Verify and Toggle System Data Field Type');

    // Step 1: Login and navigate
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'System Data Field Types');

    // Step 2: Filter by created field name
    console.log(`🔹 Filtering by name: ${systemData.name}`);
    await filterAndSearch(page, 'Name', systemData.name);
    await page.waitForTimeout(2000);

    // Step 3: Verify created record details
    await expect(page.getByRole('cell', { name: systemData.name })).toBeVisible();
    await expect(page.getByRole('cell', { name: systemData.value })).toBeVisible();

    // Step 4: Toggle active/inactive state and verify
    console.log('🔹 Toggling System Data Field Type status...');
    await toggleAndCheck(page, 'System Data Field Type has been deactivated', 'Inactive');
    await toggleAndCheck(page, 'System Data Field Type has been activated', 'Active');

    console.log('✅ Verified and toggled System Data Field Type successfully');
  });

  // ==============================================================
  // TEST 03 — Filter and Download System Data Field Type List
  // ==============================================================
  test('03 - Filter System Data Field Types and download', async ({ page }) => {
    console.log('🔹 [START] Filter and Download System Data Field Types');

    // Step 1: Login and navigate
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'System Data Field Types');

    // Step 2: Apply filter and trigger download
    console.log(`🔹 Applying filter for: ${systemData.name}`);
    await filterAndDownload(page, 'Name', systemData.name);

    console.log('✅ Filter and download completed successfully');
  });

  // ==============================================================
  // TEST 04 — Edit an Existing System Data Field Type
  // ==============================================================
  test('04 - Edit System Data Field Type', async ({ page }) => {
    console.log('🔹 [START] Edit System Data Field Type');

    // Step 1: Login and navigate
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'System Data Field Types');

    // Step 2: Edit field type name
    console.log(`✏️ Editing System Data Field Type: ${systemData.name}`);
    await page.getByRole('row', { name: new RegExp(`^${systemData.name}.*`) })
      .getByRole('button').nth(1).click();

    console.log(`🔹 Updating name to: ${newName}`);
    await page.getByRole('textbox', { name: 'Name' }).fill(newName);

    // Step 3: Update and verify confirmation
    await page.getByRole('button', { name: 'Update' }).isVisible();
    await page.getByRole('button', { name: 'Update' }).click();

    await expect(page.getByRole('alert')).toHaveText('System Data Field Type updated successfully');
    console.log('✅ System Data Field Type updated successfully');
  });

  // ==============================================================
  // TEST 05 — Delete a System Data Field Type
  // ==============================================================
  test('05 - Delete System Data Field Type', async ({ page }) => {
    console.log('🔹 [START] Delete System Data Field Type');

    // Step 1: Login and navigate
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'System Data Field Types');

    // Step 2: Filter by record before deletion
    console.log(`🔹 Searching for: ${newName}`);
    await filterAndSearch(page, 'Name', newName);
    await page.waitForTimeout(2000);

    // Step 3: Perform delete and confirm
    console.log(`🗑 Deleting System Data Field Type: ${newName}`);
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    // Step 4: Verify success message
    await expect(page.getByRole('alert')).toHaveText('System Data Field Type deleted successfully');
    console.log('✅ System Data Field Type deleted successfully');
  });
});


// ==============================================================
test.describe('System Data Field Type Validations', () => {

  // TEST — Validate mandatory field error messages
  test('Validation: Empty field creation should show required errors', async ({ page }) => {
    console.log('🔹 [START] Validate empty System Data Field Type creation');

    // Step 1: Login and navigate
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'System Data Field Types');

    // Step 2: Try creating without filling required fields
    await page.getByRole('tab', { name: 'New System Data Field Types' }).click();
    await page.getByRole('button', { name: 'Create' }).click();

    // Step 3: Verify validation messages
    console.log('🔹 Checking field validation messages...');
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Data Field Type is required')).toBeVisible();

    console.log('✅ Validation messages displayed successfully');
  });
});
