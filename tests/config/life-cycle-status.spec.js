import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, goToConfigSection, filterAndDownload, filterAndSearch, toggleAndCheck } from '../utils/commonActions.js';

// =====================================
// 🧩 Test Suite: Admin - Life Cycle States
// =====================================
test.describe.serial('CI Tests — Admin: Life Cycle States', () => {
  // ----------------------------
  // 🔧 Test Data Setup
  // ----------------------------
  const lifeData = {
    name: faker.commerce.productName(), // Random state name
    description: faker.commerce.productDescription(), // Random description
    successMessage: 'Life Cycle States created successfully', // Expected success toast message
  };
  const newName = faker.commerce.department().slice(0, 4); // Random name for edit verification

  // =====================================================
  // ✅ TEST 01 — Create Life Cycle States Successfully
  // =====================================================
  test('01 - Create Life Cycle States successfully', async ({ page }) => {
    console.log('🚀 [TEST START] Create Life Cycle State');

    // Step 1: Login
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

    // Step 2: Navigate to Configuration → Life Cycle States
    await goToConfigSection(page);
    await goToModule(page, 'Life Cycle States');

    // Step 3: Open "New Life Cycle States" tab
    await page.getByRole('tab', { name: 'New Life Cycle States' }).click();

    // Step 4: Fill form details
    console.log(`📝 Entering details: ${lifeData.name}`);
    await page.getByRole('textbox', { name: 'Enter Name' }).fill(lifeData.name);
    await page.locator('#life_cycle_state_description').fill(lifeData.description);

    // Step 5: Submit form
    await page.getByRole('button', { name: 'Create' }).click();

    // Step 6: Verify success alert
    await expect(page.getByRole('alert')).toContainText(lifeData.successMessage);
    console.log('✅ Life Cycle State created successfully');
  });

  // =====================================================
  // ✅ TEST 02 — Verify Created State and Toggle Status
  // =====================================================
  test('02 - Verify created Life Cycle State and toggle status', async ({ page }) => {
    console.log('🚀 [TEST START] Verify Life Cycle State and Toggle Status');

    // Step 1: Login and navigate to module
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Life Cycle States');

    // Step 2: Search created state
    console.log(`🔍 Searching for state: ${lifeData.name}`);
    await filterAndSearch(page, 'Name', lifeData.name);

    // Step 3: Validate visibility
    await expect(page.getByRole('cell', { name: lifeData.name })).toBeVisible();
    console.log('✅ Life Cycle State found in table');

    // Step 4: Toggle active/inactive
    console.log('🔁 Toggling state status...');
    await toggleAndCheck(page, 'Life Cycle States has been deactivated', 'Inactive');
    await toggleAndCheck(page, 'Life Cycle States has been activated', 'Active');
    console.log('✅ Life Cycle State status toggled successfully');
  });

  // =====================================================
  // ✅ TEST 03 — Filter and Download Results
  // =====================================================
  test('03 - Filter Life Cycle States and download results', async ({ page }) => {
    console.log('🚀 [TEST START] Filter and Download Life Cycle States');

    // Step 1: Login and navigate
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Life Cycle States');

    // Step 2: Filter by name
    console.log(`🔍 Filtering by Name: ${lifeData.name}`);
    await filterAndDownload(page, 'Name', lifeData.name);

    // Step 3: Confirm completion
    console.log('✅ Filter and download completed successfully');
  });

  // =====================================================
  // ✅ TEST 04 — Edit Life Cycle State
  // =====================================================
  test('04 - Edit Life Cycle State', async ({ page }) => {
    console.log('🚀 [TEST START] Edit Life Cycle State');

    // Step 1: Login and navigate
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Life Cycle States');

    // Step 2: Locate the created state row
    console.log(`✏️ Editing Life Cycle State: ${lifeData.name}`);
    await page
      .getByRole('row', { name: new RegExp(`^${lifeData.name}.*`) })
      .getByRole('button')
      .nth(1)
      .isVisible();

    // Step 3: Click Edit button
    await page
      .getByRole('row', { name: new RegExp(`^${lifeData.name}.*`) })
      .getByRole('button')
      .nth(1)
      .click();

    // Step 4: Update state name and save
    console.log(`🆕 Updating Name to: ${newName}`);
    await page.getByRole('textbox', { name: 'Enter Name' }).fill(newName);
    await page.getByRole('button', { name: 'Update' }).click();

    // Step 5: Verify update success message
    await expect(page.getByRole('alert')).toHaveText('Life Cycle States updated successfully');
    console.log('✅ Life Cycle State updated successfully');
  });

  // =====================================================
  // ✅ TEST 05 — Delete Life Cycle State
  // =====================================================
  test('05 - Delete Life Cycle State', async ({ page }) => {
    console.log('🚀 [TEST START] Delete Life Cycle State');

    // Step 1: Login and navigate
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Life Cycle States');

    // Step 2: Search and prepare for deletion
    console.log(`🗑 Filtering for deletion: ${lifeData.name}`);
    await filterAndSearch(page, 'Name', lifeData.name);
    await page.waitForTimeout(2000);

    // Step 3: Click delete and confirm
    console.log(`⚠️ Deleting Life Cycle State: ${lifeData.name}`);
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    // Step 4: Verify deletion success
    await expect(page.getByRole('alert')).toHaveText('Life Cycle States deleted successfully');
    console.log('✅ Life Cycle State deleted successfully');
  });
});

// =======================================
// ⚙️ Validation Suite — Form Validations
// =======================================
test.describe('Validation Tests — Life Cycle States', () => {
  // =====================================================
  // ⚠️ TEST — Empty Field Validation
  // =====================================================
  test('Validation: Empty fields on new Life Cycle State creation', async ({ page }) => {
    console.log('🚀 [TEST START] Validate Empty Field Warnings');

    // Step 1: Login and navigate
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Life Cycle States');

    // Step 2: Try creating without filling required fields
    await page.getByRole('tab', { name: 'New Life Cycle States' }).click();
    await page.getByRole('button', { name: 'Create' }).click();

    // Step 3: Validate error messages
    console.log('🔍 Checking validation messages...');
    await expect(page.getByText('Name is required')).toBeVisible();

    console.log('✅ Validation messages displayed correctly');
  });
});
