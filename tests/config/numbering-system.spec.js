import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, goToConfigSection, filterAndDownload, filterAndSearch, toggleAndCheck } from '../utils/commonActions.js';

test.describe.serial('CI Tests — Admin Numbering System Management', () => {
  // ---------- Test Data Setup ----------
  const numberData = {
    category: faker.commerce.department(), // Randomly generated category
    name: faker.commerce.productName(), // Random numbering system name
    value: [], // Will store selected field type values
    successMessage: 'Numbering System has been created', // Expected success message after creation
    randomDigit: Math.floor(Math.random() * 9) + 1, // Random number between 1–9
    randomDigit2: Math.floor(Math.random() * 9) + 1, // Another random number between 1–9
    description: faker.commerce.productDescription(), // Random description
  };

  // New name to be used in edit test
  const newName = faker.commerce.department().slice(0, 4);

  // ==============================================================
  // TEST 01 — Create a New Numbering System
  // ==============================================================
  test('01 - Create Numbering System', async ({ page }) => {
    console.log('🔹 [START] Create Numbering System');

    // Step 1: Login and navigate to module
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Numbering System');

    // Step 2: Fill basic numbering system details
    console.log(`✏️ Filling details for numbering system: ${numberData.name}`);
    await page.getByRole('tab', { name: 'New Numbering System' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill(numberData.name);
    await page.getByRole('textbox', { name: 'Maximum Digit' }).fill(numberData.randomDigit.toString());
    await page.getByRole('textbox', { name: 'Starting Value' }).fill(numberData.randomDigit2.toString());
    await page.locator('#num_sys_description').fill(numberData.description);

    // Step 3: Add Field Type
    console.log('🔹 Adding Field Type...');
    await page.getByRole('button', { name: 'Add Field Type' }).click();
    await page.getByRole('combobox', { name: 'Search Field Type' }).click();

    // Step 4: Select random field type from dropdown
    const buOptions = page.locator('ul[role="listbox"] li');
    await buOptions.first().waitFor({ state: 'visible' });
    const buCount = await buOptions.count();

    if (buCount === 0) throw new Error('❌ No Field Types available for selection');

    const randomIndex = faker.number.int({ min: 0, max: buCount - 1 });
    const option = buOptions.nth(randomIndex);
    const label = (await option.textContent())?.trim();

    if (!label) throw new Error('❌ Unable to read selected Field Type text');

    numberData.value = [label];
    console.log(`🔸 Selected Field Type: ${label}`);
    await option.click();

    // Step 5: Handle special cases for Field Type selection
    if (label === 'Constant String') {
      console.log('⚡ Handling Constant String field type...');
      await page.getByRole('textbox', { name: 'Enter Constant String' }).fill('random');
      await page.getByRole('button', { name: 'Add' }).click();
    } else if (label === 'System Data Field Types' || label === 'Year') {
      console.log(`⚡ Handling dependent dropdown for ${label}`);
      await page
        .locator('#year-format, #sub_field_type_value')
        .first()
        .click()
        .then(() => page.locator('ul[role="listbox"] li').first().click());
      await page.getByRole('button', { name: 'Add' }).click();
    } else {
      await page.getByRole('button', { name: 'Add' }).click();
    }

    // Step 6: Generate numbering system
    console.log(`🎯 Final selected value(s): ${numberData.value.join(', ')}`);
    await page.getByRole('button', { name: 'Generate' }).click();

    // Step 7: Verify success message
    await expect(page.getByRole('alert')).toHaveText(numberData.successMessage);
    console.log('✅ Numbering System created successfully');
  });

  // ==============================================================
  // TEST 02 — Verify and Toggle Numbering System Status
  // ==============================================================
  test('02 - Verify Numbering System and Toggle Status', async ({ page }) => {
    console.log('🔹 [START] Verify and Toggle Numbering System Status');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Numbering System');

    // Search for the created numbering system
    await filterAndSearch(page, 'Name', numberData.name);
    await page.waitForTimeout(2000);

    // Verify record presence
    console.log('🔹 Verifying created numbering system details...');
    await expect(page.getByRole('cell', { name: numberData.name })).toBeVisible();
    await expect(page.getByRole('cell', { name: numberData.description })).toBeVisible();

    // Toggle active/inactive status
    console.log('🔹 Toggling numbering system status...');
    await toggleAndCheck(page, 'Numbering System has been deactivated', 'Inactive');
    await toggleAndCheck(page, 'Numbering System has been activated', 'Active');

    console.log('✅ Status toggle verified successfully');
  });

  // ==============================================================
  // TEST 03 — Filter and Download Numbering System List
  // ==============================================================
  test('03 - Filter Numbering System and Download', async ({ page }) => {
    console.log('🔹 [START] Filter and Download Numbering System');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Numbering System');

    // Filter and download
    await filterAndDownload(page, 'Name', numberData.name);
    console.log('✅ Filter and download operation successful');
  });

  // ==============================================================
  // TEST 04 — Edit an Existing Numbering System
  // ==============================================================
  test('04 - Edit Numbering System', async ({ page }) => {
    console.log('🔹 [START] Edit Numbering System');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Numbering System');

    console.log(`✏️ Editing numbering system: ${numberData.name}`);

    // Open edit modal for the specific record
    await page
      .getByRole('row', { name: new RegExp(`^${numberData.name}.*`) })
      .getByRole('button')
      .nth(1)
      .click();

    // Update name and submit
    await page.getByRole('textbox', { name: 'Name' }).fill(newName);
    await page.getByRole('button', { name: 'Update' }).isVisible();
    await page.getByRole('button', { name: 'Update' }).click();

    // Verify update success message
    await expect(page.getByRole('alert')).toHaveText('Numbering System has been updated');
    console.log('✅ Numbering System updated successfully');
  });

  // ==============================================================
  // TEST 05 — Delete an Existing Numbering System
  // ==============================================================
  test('05 - Delete Numbering System', async ({ page }) => {
    console.log('🔹 [START] Delete Numbering System');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Numbering System');

    // Search for record before deletion
    await filterAndSearch(page, 'Name', newName);
    await page.waitForTimeout(2000);

    console.log(`🗑 Deleting numbering system: ${newName}`);

    // Delete confirmation
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    // Verify deletion success message
    await expect(page.getByRole('alert')).toHaveText('Numbering System has been deleted');
    console.log('✅ Numbering System deleted successfully');
  });
});

// ==============================================================
test.describe('Numbering System Validations', () => {
  // TEST: Verify validation messages when fields are empty
  test('Validation: Empty Fields During Numbering System Creation', async ({ page }) => {
    console.log('🔹 [START] Validation Test for Empty Fields');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Numbering System');

    // Attempt to generate without filling fields
    await page.getByRole('tab', { name: 'New Numbering System' }).click();
    await page.getByRole('button', { name: 'Generate' }).click();

    // Verify expected validation messages
    console.log('🔹 Checking validation messages...');
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Maximum Digit is required')).toBeVisible();
    await expect(page.getByText('Starting Value is required')).toBeVisible();
    await expect(page.getByText('At least one Field Type is required')).toBeVisible();

    console.log('✅ Validation messages verified successfully');
  });
});
