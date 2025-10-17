// playwright/tests/workflowDataFieldTypes.spec.js

import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, goToConfigSection, filterAndDownload, filterAndSearch, toggleAndCheck } from '../utils/commonActions.js';

// =======================
// Test Suite: Workflow Types (Admin Configuration)
// =======================
test.describe.serial('CI Tests — Admin: Workflow Types', () => {
  // -----------------------
  // Test Data Setup — using Faker to create unique random data
  // -----------------------
  const workflowData = {
    name: faker.commerce.productName(), // Random workflow type name
    description: faker.commerce.productDescription(), // Random description text
    prefix: faker.string.alpha(3).toUpperCase(), // Random 3-letter uppercase prefix
    serialNumberStart: faker.number.int({ min: 100, max: 999 }).toString(), // Starting serial number
    userCount: faker.number.int({ min: 1, max: 10 }).toString(), // Random user count
    slaDays: faker.number.int({ min: 1, max: 30 }).toString(), // SLA days
    actionType: 'Retire', // Static for consistency
    releaseCondition: 'Delay', // Static release condition
    incrementType: 'Minor', // Static increment type
    role: 'Admin', // Assigned workflow role
    department1: 'Automotive', // First department
    department2: 'QA_ACT', // Second department
    checklist: 'Sleek Ceramic Shoes', // Example checklist (can be dynamic)
    lifecycleState: '@NA_Approve', // Lifecycle state name
    printTemplate: 'Template 1', // Print template
  };

  const updatedName = faker.commerce.department().slice(0, 4); // Used in edit test

  // ==============================================================
  // 01 - CREATE Workflow Type
  // ==============================================================
  test('01 - Create Workflow Type', async ({ page }) => {
    console.log('🚀 [START] Creating new Workflow Type');

    // Login and navigate to Workflow Type module
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Workflow Type');

    // Fill Workflow Type creation form
    console.log('📝 Filling Workflow Type creation form...');
    await page.getByRole('tab', { name: 'New Workflow Type' }).click();
    await page.getByRole('textbox', { name: 'Workflow Type Name' }).fill(workflowData.name);
    await page.getByRole('textbox', { name: 'Enter Description' }).fill(workflowData.description);
    await page.getByRole('textbox', { name: 'Enter Prefix' }).fill(workflowData.prefix);
    await page.locator('#workflow_type_sn_start').fill(workflowData.serialNumberStart);
    await page.locator('#workflow_type_sn_length').fill('6');

    // Select values from dropdowns
    console.log('🔽 Selecting dropdown values...');
    await page.locator('#workflow_Action_type').click();
    await page.getByRole('option', { name: workflowData.actionType }).click();

    await page.locator('#add_lifecycle_print_template').click();
    await page.getByRole('option', { name: '@NA_PrintTemplate' }).click();

    await page.locator('#workflow_type_release_conditions').click();
    await page.getByRole('option', { name: workflowData.releaseCondition }).click();

    // Select increment type and toggle workflow flags
    await page.getByRole('combobox', { name: 'Major' }).click();
    await page.getByRole('option', { name: 'Major' }).click();
    await page.getByPlaceholder('Enter Days').fill('5');
    await page.getByText('SerialParallel').click();
    await page.getByText('YesNo').click();

    // Add Lifecycle State mapping
    console.log('🔗 Adding lifecycle configuration...');
    await page.getByRole('button', { name: 'Add Lifecycle State' }).click();

    // Select lifecycle details
    await page.locator('#add_lifecycle_state').click();
    await page.getByRole('option', { name: workflowData.lifecycleState }).click();

    await page.locator('#add_lifecycle_role').click();
    await page.getByRole('option', { name: workflowData.role }).click();

    await page.locator('#add_lifecycle_department').first().click();
    await page.getByRole('option', { name: workflowData.department1 }).click();

    await page.locator('#add_lifecycle_department').nth(1).click();
    await page.getByRole('option', { name: workflowData.department2 }).click();

    await page.locator('#add_lifecycle_checklist').click();
    await page.getByRole('option', { name: workflowData.checklist }).click();

    // Enter numeric values for user count and SLA days
    await page.locator('input[name="userCount"]').fill(workflowData.userCount);
    await page.locator('input[name="slaDays"]').fill(workflowData.slaDays);

    // Select increment type from dropdown
    await page.locator('#add_lifecycle_increment_type').click();
    await page.getByRole('option', { name: workflowData.incrementType }).click();

    // Submit the new workflow type
    console.log('💾 Submitting Workflow Type creation...');
    await page.getByRole('button', { name: 'Map' }).click();
    await page.getByRole('button', { name: 'Create' }).click();

    console.log('✅ [SUCCESS] Workflow Type created:', workflowData);
  });

  // ==============================================================
  // 02 - VERIFY and TOGGLE Workflow Type
  // ==============================================================
  test('02 - Verify & Toggle Workflow Type', async ({ page }) => {
    console.log('🔍 [START] Verifying and toggling Workflow Type');

    // Login and navigate again
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Workflow Type');

    // Search for the workflow type using filter
    await filterAndSearch(page, 'Name', workflowData.name);
    await page.waitForTimeout(2000);

    // Verify visibility of created data
    await expect(page.getByRole('cell', { name: workflowData.name })).toBeVisible();
    await expect(page.getByRole('cell', { name: workflowData.description })).toBeVisible();

    // Toggle status between Active and Inactive
    console.log('🔁 Toggling status...');
    await toggleAndCheck(page, 'Workflow Type has been deactivated', 'Inactive');
    await toggleAndCheck(page, 'Workflow Type has been activated', 'Active');

    console.log('✅ [SUCCESS] Verified and toggled Workflow Type');
  });

  // ==============================================================
  // 03 - FILTER and DOWNLOAD Workflow Type
  // ==============================================================
  test('03 - Filter & Download Workflow Type', async ({ page }) => {
    console.log('📂 [START] Filtering and downloading Workflow Type');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Workflow Type');

    // Apply filter and download list
    await filterAndDownload(page, 'Name', workflowData.name);

    console.log('✅ [SUCCESS] Filter and download completed');
  });

  // ==============================================================
  // 04 - EDIT Workflow Type
  // ==============================================================
  test('04 - Edit Workflow Type', async ({ page }) => {
    console.log('✏️ [START] Editing Workflow Type');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Workflow Type');

    // Locate the row containing the workflow name and click edit button
    await page
      .getByRole('row', { name: new RegExp(`^${workflowData.name}.*`) })
      .getByRole('button')
      .nth(1)
      .click();

    // Update the name and save
    await page.getByRole('textbox', { name: 'Name' }).fill(updatedName);
    await page.waitForTimeout(3000); // Small delay for UI stabilization
    await page.getByRole('button', { name: 'Update' }).isVisible();
    await page.getByRole('button', { name: 'Update' }).click();

    // Validate update success message
    await expect(page.getByRole('alert')).toHaveText('Workflow Type updated successfully');
    console.log(`✅ [SUCCESS] Workflow Type updated to: ${updatedName}`);
  });

  // ==============================================================
  // 05 - DELETE Workflow Type
  // ==============================================================
  test('05 - Delete Workflow Type', async ({ page }) => {
    console.log('🗑 [START] Deleting Workflow Type');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Workflow Type');

    // Filter and delete created workflow
    await filterAndSearch(page, 'Name', workflowData.name);
    await page.waitForTimeout(2000);

    // Confirm deletion twice (modal confirmation)
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByRole('alert')).toHaveText('Workflow Type deleted successfully');
    console.log(`✅ [SUCCESS] Workflow Type deleted: ${workflowData.name}`);
  });
});

// =======================
// NEGATIVE TESTS — Validation Checks
// =======================
test.describe('CI Tests — Validations: Workflow Types', () => {
  // ==============================================================
  // Validation: Ensure mandatory field errors are displayed
  // ==============================================================
  test('Validation: Empty field submission should show error messages', async ({ page }) => {
    console.log('⚠️ [START] Validating required field errors on empty form submission');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    await goToModule(page, 'Workflow Type');

    // Attempt to create workflow without filling any data
    await page.getByRole('tab', { name: 'New Workflow Type' }).click();
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify all mandatory validation messages
    console.log('🔎 Checking validation error messages...');
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Prefix is required')).toBeVisible();
    await expect(page.getByText('WF-Serial Number Start Value is required')).toBeVisible();
    await expect(page.getByText('WF-Serial Number Length Value is required')).toBeVisible();
    await expect(page.getByText('Please select Workflow Action Type')).toBeVisible();
    await expect(page.getByText('Please select Workflow Release Condition')).toBeVisible();
    await expect(page.getByText('Please select At least one Lifecycle State')).toBeVisible();

    console.log('✅ [SUCCESS] Validation errors displayed correctly');
  });
});
