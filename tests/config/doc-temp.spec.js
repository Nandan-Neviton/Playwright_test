import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import {
  goToModule,
  goToConfigSection,
  filterAndDownload,
  filterAndSearch,
  toggleAndCheck,
  clickRandomButton,
} from '../utils/commonActions.js';

// ==========================================================
// 🧩 Test Suite: Admin — Document Types
// ==========================================================
test.describe.serial('CI Tests — Admin: Document Types', () => {
  // --------------------------------------------------------
  // 🔧 Test Data Setup (Randomized for CI consistency)
  // --------------------------------------------------------
  const docData = {
    name: faker.commerce.productName(), // Random Document Type Name
    description: faker.commerce.productDescription(), // Random Description
    prefixCode: faker.number.int({ min: 10, max: 100 }).toString(), // Random Prefix
    numeringSystem: 'Musi', // Static numbering system for testing
    initialVersion: faker.number.int({ min: 1, max: 10 }).toString(), // Random version number
    docFormat: 'Word Document (DOCX)', // Format selection
    successMessage: 'Document Type created successfully',
  };

  const updatedName = faker.commerce.department().slice(0, 4); // Random short update name
  console.log('🧾 Generated Test Data:', docData);

  // --------------------------------------------------------
  // 🧪 Test 01 — Create Document Type
  // --------------------------------------------------------
  test('01 - Should create new Document Type successfully', async ({ page }) => {
    console.log('🚀 [START] Creating new Document Type');

    // Step 1: Login and navigate to module
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Document Type/ Template Type');

    // Step 2: Open creation tab
    await page.getByRole('tab', { name: 'New Document Type/Template' }).click();

    // Step 3: Fill out main form fields
    console.log('🧩 Filling document type basic details...');
    await page.getByRole('textbox', { name: 'Name' }).fill(docData.name);
    await page.getByRole('textbox', { name: 'Prefix code' }).fill(docData.prefixCode);
    await page.getByRole('textbox', { name: 'Description' }).fill(docData.description);

    // Select numbering system and version
    await page.locator('#doc-type-numbering-system').click();
    await page.getByRole('option', { name: docData.numeringSystem }).click();
    await page.getByPlaceholder('Enter Version').fill(docData.initialVersion);

    // Step 4: Random button toggles for various options
    console.log('⚙️ Selecting random field toggles');
    await clickRandomButton(page, [{ options: { name: 'External Document' } }, { options: { name: 'Default Format' } }]);

    // Select document format
    await page.getByRole('tabpanel', { name: 'Document Type Template Type' }).getByLabel('', { exact: true }).click();
    await page.getByRole('option', { name: docData.docFormat }).click();

    // Select active/inactive, archive options, etc.
    await clickRandomButton(page, [{ options: { name: 'Active', exact: true } }, { options: { name: 'Inactive' } }]);
    await clickRandomButton(page, [{ options: { name: 'Yes' } }, { options: { name: 'No' } }]);
    await clickRandomButton(page, [{ options: { name: 'Yes', index: 1 } }, { options: { name: 'No', index: 1 } }]);
    await clickRandomButton(page, [{ options: { name: 'Yes', index: 2 } }, { options: { name: 'No', index: 2 } }]);

    // Step 5: Navigate to next tab
    await page.getByRole('radio', { name: 'Auto' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 6: Select random system data fields
    console.log('📊 Selecting random System Data Fields...');
    await page.getByRole('combobox', { name: 'Select System Data Field' }).click();
    await page.waitForSelector('[role="option"]');

    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    if (count === 0) {
      console.log('⚠️ No checkboxes found in combobox');
      return;
    }

    const numberToSelect = Math.min(count, 5);
    console.log(`🟢 Selecting ${numberToSelect} checkbox(es)...`);
    const selectedIndexes = new Set();
    while (selectedIndexes.size < numberToSelect) selectedIndexes.add(Math.floor(Math.random() * count));

    for (const i of selectedIndexes) {
      await checkboxes.nth(i).scrollIntoViewIfNeeded();
      await checkboxes.nth(i).click();
      console.log(`✅ Selected checkbox #${i + 1}`);
    }

    await page.mouse.click(0, 0);
    await page.getByRole('button', { name: 'Add' }).click();

    // Step 7: Select repository and workflow
    await page.getByRole('combobox', { name: 'Select Parent Reporsitory' }).click();
    await page.getByRole('option', { name: 'NEVRepo' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    console.log('🔄 Selecting Workflow Types...');
    await page.getByRole('combobox', { name: 'Workflow Type' }).click();
    await page.waitForSelector('[role="option"], [role="checkbox"]');

    const dropdown = page.locator('[role="listbox"]');
    const options = dropdown.locator('[role="option"]');
    const count1 = await options.count();
    if (count1 === 0) {
      console.log('⚠️ No workflow options found');
      return;
    }

    const numToSelect = Math.min(count1, 5);
    const indices = new Set();
    while (indices.size < numToSelect) indices.add(Math.floor(Math.random() * count1));
    for (const i of indices) {
      const opt = options.nth(i);
      await opt.scrollIntoViewIfNeeded();
      await opt.click();
      console.log(`✅ Selected workflow option #${i + 1}`);
    }
    await page.mouse.click(0, 0);
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 8: Review period configuration
    console.log('🕒 Configuring Review Period...');
    await page.getByRole('button', { name: 'YES' }).first().click();
    await clickRandomButton(page, [{ options: { name: 'Months' } }]);
    await page.getByRole('textbox', { name: 'Months', exact: true }).fill('10');
    await clickRandomButton(page, [{ options: { name: 'Weeks' } }]);
    await page.getByRole('textbox', { name: 'Weeks' }).fill('10');
    await page.locator('input[name="reminderRecurrence"]').fill('10');
    await page.getByRole('button', { name: 'NO' }).nth(1).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 9: Notification setup
    console.log('📧 Configuring Notification Activity...');
    await page.getByRole('tabpanel', { name: 'Notifcation Activity*' }).getByLabel('').click();
    await page.getByRole('option', { name: 'Document/Template Created' }).click();
    await page.getByRole('button', { name: 'Add System Users' }).first().click();
    await page.waitForTimeout(1000);

    // Wait for modal and select users randomly
    const modal = page.locator('[role="dialog"]');
    await modal.waitFor({ state: 'visible' });
    const checkboxes2 = modal.locator('input[type="checkbox"]');
    const total = await checkboxes2.count();
    if (total > 0) {
      const toSelect = Math.min(total, 2);
      const chosen = new Set();
      while (chosen.size < toSelect) chosen.add(Math.floor(Math.random() * total));
      for (const i of chosen) {
        await checkboxes2.nth(i).scrollIntoViewIfNeeded();
        await checkboxes2.nth(i).click({ force: true });
        console.log(`✅ Selected system user #${i + 1}`);
      }
    } else {
      console.log('⚠️ No system user checkboxes found');
    }

    // Final submission
    await page.mouse.click(0, 0);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByRole('alert')).toHaveText(docData.successMessage);
    console.log('✅ Document Type created successfully');
  });

  // --------------------------------------------------------
  // 🧪 Test 02 — Verify and Toggle Document Type
  // --------------------------------------------------------
  test('02 - Should verify Document Type and toggle its status', async ({ page }) => {
    console.log('🔹 [TEST START] Verify and Toggle Document Type');
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Document Type/ Template Type');

    console.log(`🔍 Filtering by Name: ${docData.name}`);
    await filterAndSearch(page, 'Name', docData.name);
    await expect(page.getByRole('cell', { name: docData.name })).toBeVisible();

    // Toggle only if inactive entries exist
    const inactiveCell = page.getByRole('cell', { name: 'Inactive' });
    const count = await inactiveCell.count();
    if (count === 0) {
      console.log('✅ All entries active — no toggle required');
    } else {
      await toggleAndCheck(page, 'Document Type has been activated', 'Active');
    }
  });

  // --------------------------------------------------------
  // 🧪 Test 03 — Filter and Download
  // --------------------------------------------------------
  test('03 - Should filter Document Type and download results', async ({ page }) => {
    console.log('🔹 [TEST START] Filter & Download Document Type');
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Document Type/ Template Type');

    await filterAndDownload(page, 'Name', docData.name);
    console.log('✅ Filter and download successful');
  });

  // --------------------------------------------------------
  // 🧪 Test 04 — Edit Document Type
  // --------------------------------------------------------
  test('04 - Should edit existing Document Type successfully', async ({ page }) => {
    console.log('✏️ [TEST START] Edit Document Type');
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Document Type/ Template Type');

    await filterAndSearch(page, 'Name', docData.name);
    await page.waitForTimeout(2000);
    console.log(`🔹 Editing document type: ${docData.name}`);
    await page.getByRole('button', { name: 'Edit' }).click();

    await page.getByRole('textbox', { name: 'Name' }).fill(updatedName);
    await page.getByRole('button', { name: 'Update' }).click();

    await expect(page.getByRole('alert')).toHaveText('Document Type updated successfully');
    console.log('✅ Document Type updated successfully');
  });

  // --------------------------------------------------------
  // 🧪 Test 05 — Delete Document Type
  // --------------------------------------------------------
  test('05 - Should delete Document Type successfully', async ({ page }) => {
    console.log('🗑 [TEST START] Delete Document Type');
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Document Type/ Template Type');

    console.log(`🔹 Searching for deletion target: ${docData.name}`);
    await filterAndSearch(page, 'Name', docData.name);
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByRole('alert')).toHaveText('Document Type deleted successfully');
    console.log('✅ Document Type deleted successfully');
  });
});

// ==========================================================
// ⚠️ Validation Tests — Document/Template Field Validations
// ==========================================================
test.describe('🧾 Document/Template Validations', () => {
  test('Validation - Should display proper error messages for empty fields and workflow validation', async ({ page }) => {
    console.log('🚦 [TEST START] Validation Checks for Empty Fields & Workflow');

    // Step 1: Login and open module
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Document Type/ Template Type');
    await page.getByRole('tab', { name: 'New Document Type/Template' }).click();

    // Step 2: Attempt to proceed without data
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill(' ');
    await page.getByRole('textbox', { name: 'Prefix code' }).fill(' ');
    await page.getByRole('textbox', { name: 'Description' }).fill(' ');

    console.log('🔍 Verifying validation error messages...');
    await expect(page.getByText('Document Type Name is required')).toBeVisible();
    await expect(page.getByText('Prefix Code must be alphanumeric')).toBeVisible();
    await expect(page.getByText('Initial version is required')).toBeVisible();
    await expect(page.getByText('Please select Document Format')).toBeVisible();

    // Step 3: Fill mandatory fields correctly
    await page.locator('#doc-type-numbering-system').click();
    await page.getByRole('option', { name: 'Musi' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('test');
    await page.getByRole('textbox', { name: 'Prefix code' }).fill('22');
    await page.getByPlaceholder('Enter Version').fill('22');
    await page.getByRole('tabpanel', { name: 'Document Type Template Type' }).getByLabel('', { exact: true }).click();
    await page.getByRole('option', { name: 'Word Document (DOCX)' }).click();

    // Step 4: Proceed to workflow section and verify validation
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Please add at least one')).toBeVisible();

    // Step 5: Add valid workflow entry
    await page.getByRole('combobox', { name: 'Workflow Type' }).click();
    await page.getByRole('option', { name: '@NA_Workflow1' }).click();
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 6: Validate Review Period Section
    await page.getByRole('button', { name: 'NO' }).nth(1).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Review Period Duration is required')).toBeVisible();
    await expect(page.getByText('Prior Reminder is required')).toBeVisible();
    await expect(page.getByText('Reminder Recurrence Schedule is required')).toBeVisible();

    // Step 7: Provide valid duration and recurrence
    await page.getByRole('textbox', { name: 'Months' }).fill('2');
    await page.getByRole('textbox', { name: 'Days' }).fill('2');
    await page.getByRole('textbox', { name: 'Monthly' }).fill('2');
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 8: Notification validation
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText('Notification Activity is required')).toBeVisible();
    await expect(
      page.getByText('Please provide a valid mail list, separated by commas, or select at least one system user.')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText('At least one record should be')).toBeVisible();
    console.log('✅ Validation messages verified successfully');
  });
});
