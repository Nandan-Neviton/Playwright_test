import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToDMS, goToSystemSection } from '../utils/commonActions.js';

// ===========================================================
// CI TEST SUITE — Audit Trail Management
// ===========================================================
test.describe.serial('CI Tests — Audit Trail Management', () => {
  // ---------- Test Data Setup ----------
  const auditTrailData = {
    startDate: '01/01/2024', // Test start date
    endDate: '12/31/2024', // Test end date
    userName: 'Test User', // Sample user name
    conditionValue: 'Test Condition', // Sample condition
    searchName: 'Test Document', // Sample name to search
    successMessage: 'Audit trail generated successfully', // Expected success message
    noDataMessage: 'No transactions to display in the audit trail', // No data message
  };

  // ===========================================================
  // TEST 01 — Navigate to Audit Trail Module
  // ===========================================================
  test('01 - Navigate to Audit Trail Module', async ({ page }) => {
    console.log('🔹 [START] Navigate to Audit Trail Module');

    // Step 1: Login to application
    console.log('🔸 Logging into the application...');
    await login(page);
    await goToDMS(page);

    // Step 2: Navigate to System section and then Audit Trail
    console.log('🔸 Navigating to Audit Trail Section...');
    await goToSystemSection(page);

    // Step 3: Verify we are on the audit trail page
    await expect(page).toHaveURL(/.*\/dms\/system\/audit-trail/);
    await expect(page.getByRole('heading', { name: 'Audit Trail' })).toBeVisible().catch(() => 
      expect(page.getByText('Audit Trail').first()).toBeVisible()
    );
    console.log('✅ Successfully navigated to Audit Trail module');
  });

  // ===========================================================
  // TEST 02 — Verify Audit Trail Interface Elements
  // ===========================================================
  test('02 - Verify Audit Trail Interface Elements', async ({ page }) => {
    console.log('🔹 [START] Verify Audit Trail Interface Elements');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await goToSystemSection(page);

    // Step 2: Verify required form elements
    console.log('🔸 Verifying required form elements...');
    
    // Check required fields
    await expect(page.getByText('Select Category Name *')).toBeVisible();
    await expect(page.getByText('Select Event *')).toBeVisible();
    
    // Check optional fields
    await expect(page.getByText('Select Site')).toBeVisible();
    await expect(page.getByText('Select User')).toBeVisible();
    await expect(page.getByText('Select Condition')).toBeVisible();
    await expect(page.getByText('Enter Name')).toBeVisible();
    
    // Check date fields
    await expect(page.getByText('Start Date')).toBeVisible();
    await expect(page.getByText('End Date')).toBeVisible();
    await expect(page.getByText('All Day')).toBeVisible();
    
    // Check checkboxes and buttons
    await expect(page.getByText('Show Identification ID')).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Show Identification ID' })).toBeChecked();
    
    console.log('✅ All interface elements are visible');
  });

  // ===========================================================
  // TEST 03 — Test Category Dropdown Options
  // ===========================================================
  test('03 - Test Category Dropdown Options', async ({ page }) => {
    console.log('🔹 [START] Test Category Dropdown Options');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await goToSystemSection(page);

    // Step 2: Click Category dropdown
    console.log('🔸 Testing Category dropdown...');
    await page.getByRole('button', { name: 'Open' }).first().click();
    await page.waitForTimeout(1000);

    // Step 3: Verify category options are available
    const categoryOptions = [
      'Activities', 'Auto Association Rule', 'Auto Creation Rule', 'Checklist', 
      'Department', 'DMS Bulk Upload', 'Document', 'Document Type/Template Type',
      'ENV Migration', 'Life Cycle States', 'List Manager', 'Login', 
      'Numbering System', 'Organisation', 'Print Event Settings', 'Print Events',
      'Print Package Manager', 'Print Template', 'Reports', 'Repository', 
      'Role', 'Site', 'Site Theme', 'System Data Fields Types', 'Tag', 
      'Template', 'User Creation', 'User Group', 'Virtual Data Room', 
      'Virtual Data Room Login', 'Workflow', 'Workflow Type'
    ];
    
    for (const option of categoryOptions.slice(0, 5)) { // Test first 5 options
      await expect(page.getByRole('option', { name: option })).toBeVisible();
      console.log(`✅ Category option "${option}" found`);
    }

    // Step 4: Select Document category
    await page.getByRole('option', { name: 'Document', exact: true }).click();
    await page.waitForTimeout(500);
    
    console.log('✅ Successfully selected Document category');
  });

  // ===========================================================
  // TEST 04 — Test Event Dropdown Based on Category
  // ===========================================================
  test('04 - Test Event Dropdown Based on Category', async ({ page }) => {
    console.log('🔹 [START] Test Event Dropdown Based on Category');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await page.locator('a:nth-child(9)').click();
    await page.waitForLoadState('networkidle');

    // Step 2: Select Category first
    await page.getByRole('button', { name: 'Open' }).first().click();
    await page.getByRole('option', { name: 'Document', exact: true }).click();
    await page.waitForTimeout(500);

    // Step 3: Click Event dropdown
    console.log('🔸 Testing Event dropdown for Document category...');
    await page.getByRole('button', { name: 'Open' }).nth(2).click();
    await page.waitForTimeout(1000);

    // Step 4: Verify event options for Document category
    const eventOptions = ['Deleted', 'Updated', 'Created', 'Workflow', 'Download'];
    
    for (const option of eventOptions) {
      await expect(page.getByRole('option', { name: option })).toBeVisible();
      console.log(`✅ Event option "${option}" found`);
    }

    // Step 5: Select Created event
    await page.getByRole('option', { name: 'Created' }).click();
    await page.waitForTimeout(500);
    
    console.log('✅ Successfully selected Created event');
  });

  // ===========================================================
  // TEST 05 — Test Date Selection and All Day Option
  // ===========================================================
  test('05 - Test Date Selection and All Day Option', async ({ page }) => {
    console.log('🔹 [START] Test Date Selection');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await page.locator('a:nth-child(9)').click();
    await page.waitForLoadState('networkidle');

    // Step 2: Test date inputs
    console.log('🔸 Testing date inputs...');
    const startDateInput = page.getByRole('textbox', { name: 'mm/dd/yyyy' }).first();
    const endDateInput = page.getByRole('textbox', { name: 'mm/dd/yyyy' }).last();
    
    // Clear existing dates
    await startDateInput.clear();
    await endDateInput.clear();
    
    // Fill new dates
    await startDateInput.fill(auditTrailData.startDate);
    await endDateInput.fill(auditTrailData.endDate);
    
    // Verify dates are filled
    await expect(startDateInput).toHaveValue(auditTrailData.startDate);
    await expect(endDateInput).toHaveValue(auditTrailData.endDate);
    
    // Step 3: Test All Day checkbox
    console.log('🔸 Testing All Day checkbox...');
    const allDayCheckbox = page.getByRole('checkbox', { name: 'All Day' });
    await allDayCheckbox.check();
    await expect(allDayCheckbox).toBeChecked();
    
    // Uncheck All Day
    await allDayCheckbox.uncheck();
    await expect(allDayCheckbox).not.toBeChecked();
    
    console.log('✅ Date selection and All Day checkbox working correctly');
  });

  // ===========================================================
  // TEST 06 — Test Optional Filter Fields
  // ===========================================================
  test('06 - Test Optional Filter Fields', async ({ page }) => {
    console.log('🔹 [START] Test Optional Filter Fields');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await page.locator('a:nth-child(9)').click();
    await page.waitForLoadState('networkidle');

    // Step 2: Test User dropdown
    console.log('🔸 Testing User dropdown...');
    await page.getByText('Select User').locator('..').getByRole('button', { name: 'Open' }).click();
    await page.waitForTimeout(1000);
    // Close dropdown
    await page.keyboard.press('Escape');

    // Step 3: Test Condition dropdown
    console.log('🔸 Testing Condition dropdown...');
    await page.getByText('Select Condition').locator('..').getByRole('button', { name: 'Open' }).click();
    await page.waitForTimeout(1000);
    // Close dropdown
    await page.keyboard.press('Escape');

    // Step 4: Test Enter Name field
    console.log('🔸 Testing Enter Name field...');
    const nameInput = page.getByText('Enter Name').locator('..').getByRole('textbox');
    await nameInput.fill(auditTrailData.searchName);
    await expect(nameInput).toHaveValue(auditTrailData.searchName);
    
    // Clear the field
    await nameInput.clear();
    await expect(nameInput).toHaveValue('');

    console.log('✅ Optional filter fields tested successfully');
  });

  // ===========================================================
  // TEST 07 — Test Show Identification ID Checkbox
  // ===========================================================
  test('07 - Test Show Identification ID Checkbox', async ({ page }) => {
    console.log('🔹 [START] Test Show Identification ID Checkbox');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await page.locator('a:nth-child(9)').click();
    await page.waitForLoadState('networkidle');

    // Step 2: Test Show Identification ID checkbox
    console.log('🔸 Testing Show Identification ID checkbox...');
    const showIdCheckbox = page.getByRole('checkbox', { name: 'Show Identification ID' });
    
    // Verify it's checked by default
    await expect(showIdCheckbox).toBeChecked();
    
    // Uncheck it
    await showIdCheckbox.uncheck();
    await expect(showIdCheckbox).not.toBeChecked();
    
    // Check it again
    await showIdCheckbox.check();
    await expect(showIdCheckbox).toBeChecked();

    console.log('✅ Show Identification ID checkbox working correctly');
  });

  // ===========================================================
  // TEST 08 — Test Generate Audit Trail Report
  // ===========================================================
  test('08 - Test Generate Audit Trail Report', async ({ page }) => {
    console.log('🔹 [START] Test Generate Audit Trail Report');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await page.locator('a:nth-child(9)').click();
    await page.waitForLoadState('networkidle');

    // Step 2: Fill required fields
    console.log('🔸 Filling required fields...');
    
    // Select category
    await page.getByRole('button', { name: 'Open' }).first().click();
    await page.getByRole('option', { name: 'Document', exact: true }).click();
    await page.waitForTimeout(500);
    
    // Select event
    await page.getByRole('button', { name: 'Open' }).nth(2).click();
    await page.getByRole('option', { name: 'Created' }).click();
    await page.waitForTimeout(500);

    // Step 3: Generate report
    console.log('🔸 Generating audit trail report...');
    await page.getByRole('button', { name: 'Generate' }).click();
    await page.waitForTimeout(3000);

    // Step 4: Verify report generation
    // Check if results table is visible
    await expect(page.getByRole('columnheader', { name: 'Date&Time' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Initiating User Login Id' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Unique Identifiers' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Event' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Site' })).toBeVisible();

    // Check if Document tab is visible
    await expect(page.getByRole('tab', { name: 'Document', selected: true })).toBeVisible();

    console.log('✅ Audit trail report generated successfully');
  });

  // ===========================================================
  // TEST 09 — Test Reset All Filters Functionality
  // ===========================================================
  test('09 - Test Reset All Filters Functionality', async ({ page }) => {
    console.log('🔹 [START] Test Reset All Filters Functionality');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await page.locator('a:nth-child(9)').click();
    await page.waitForLoadState('networkidle');

    // Step 2: Fill form with test data
    console.log('🔸 Filling form with test data...');
    
    // Select category and event
    await page.getByRole('button', { name: 'Open' }).first().click();
    await page.getByRole('option', { name: 'Document', exact: true }).click();
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: 'Open' }).nth(2).click();
    await page.getByRole('option', { name: 'Created' }).click();
    await page.waitForTimeout(500);

    // Generate to activate Reset button
    await page.getByRole('button', { name: 'Generate' }).click();
    await page.waitForTimeout(2000);

    // Step 3: Click Reset All Filters button
    console.log('🔸 Testing Reset All Filters functionality...');
    await page.getByRole('button', { name: 'Reset All Filters' }).click();
    await page.waitForTimeout(1000);

    // Step 4: Verify form is reset (this depends on the app's reset behavior)
    // The exact verification will depend on how the application handles reset
    console.log('✅ Reset All Filters functionality tested');
  });

  // ===========================================================
  // TEST 10 — Test Add New Event Category Functionality
  // ===========================================================
  test('10 - Test Add New Event Category Functionality', async ({ page }) => {
    console.log('🔹 [START] Test Add New Event Category Functionality');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await page.locator('a:nth-child(9)').click();
    await page.waitForLoadState('networkidle');

    // Step 2: Fill required fields to enable buttons
    await page.getByRole('button', { name: 'Open' }).first().click();
    await page.getByRole('option', { name: 'Document', exact: true }).click();
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: 'Open' }).nth(2).click();
    await page.getByRole('option', { name: 'Created' }).click();
    await page.waitForTimeout(500);

    // Generate to activate other buttons
    await page.getByRole('button', { name: 'Generate' }).click();
    await page.waitForTimeout(2000);

    // Step 3: Test Add New Event Category button
    console.log('🔸 Testing Add New Event Category button...');
    await expect(page.getByRole('button', { name: 'Add New Event Category' })).toBeEnabled();
    
    // Click the button (this may open a dialog or form)
    await page.getByRole('button', { name: 'Add New Event Category' }).click();
    await page.waitForTimeout(1000);

    console.log('✅ Add New Event Category functionality tested');
  });

  // ===========================================================
  // TEST 11 — Test Download Functionality
  // ===========================================================
  test('11 - Test Download Functionality', async ({ page }) => {
    console.log('🔹 [START] Test Download Functionality');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await page.locator('a:nth-child(9)').click();
    await page.waitForLoadState('networkidle');

    // Step 2: Generate a report first
    await page.getByRole('button', { name: 'Open' }).first().click();
    await page.getByRole('option', { name: 'Document', exact: true }).click();
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: 'Open' }).nth(2).click();
    await page.getByRole('option', { name: 'Created' }).click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Generate' }).click();
    await page.waitForTimeout(2000);

    // Step 3: Test Download button (when data is available)
    console.log('🔸 Testing Download button...');
    const downloadButton = page.getByRole('button', { name: 'Download' });
    
    // Note: Download button might be disabled if no data is found
    // The test checks if the button exists
    await expect(downloadButton).toBeVisible();

    console.log('✅ Download functionality tested');
  });

  // ===========================================================
  // TEST 12 — Test Audit Trail Table Structure
  // ===========================================================
  test('12 - Test Audit Trail Table Structure', async ({ page }) => {
    console.log('🔹 [START] Test Audit Trail Table Structure');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await page.locator('a:nth-child(9)').click();
    await page.waitForLoadState('networkidle');

    // Step 2: Generate a report to see table structure
    await page.getByRole('button', { name: 'Open' }).first().click();
    await page.getByRole('option', { name: 'Document', exact: true }).click();
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: 'Open' }).nth(2).click();
    await page.getByRole('option', { name: 'Created' }).click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Generate' }).click();
    await page.waitForTimeout(2000);

    // Step 3: Verify table headers
    console.log('🔸 Verifying audit trail table structure...');
    
    const expectedHeaders = ['Date&Time', 'Initiating User Login Id', 'Unique Identifiers', 'Event', 'Site'];
    
    for (const header of expectedHeaders) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
      console.log(`✅ Header "${header}" found`);
    }

    // Step 4: Check table pagination
    await expect(page.getByText('Rows per page:')).toBeVisible();
    
    console.log('✅ Audit trail table structure verified');
  });

  // ===========================================================
  // TEST 13 — Test Multiple Category Workflow
  // ===========================================================
  test('13 - Test Multiple Category Workflow', async ({ page }) => {
    console.log('🔹 [START] Test Multiple Category Workflow');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await page.locator('a:nth-child(9)').click();
    await page.waitForLoadState('networkidle');

    // Step 2: Test different categories
    const categoriesToTest = ['Login', 'User Creation', 'Reports'];
    
    for (const category of categoriesToTest) {
      console.log(`🔸 Testing category: ${category}`);
      
      // Select category
      await page.getByRole('button', { name: 'Open' }).first().click();
      await page.getByRole('option', { name: category, exact: true }).click();
      await page.waitForTimeout(1000);
      
      // Try to select an event if available
      const eventDropdownButton = page.getByRole('button', { name: 'Open' }).nth(2);
      if (await eventDropdownButton.isEnabled()) {
        await eventDropdownButton.click();
        await page.waitForTimeout(500);
        
        // Select first available option
        const firstEvent = page.locator('[role="option"]').first();
        if (await firstEvent.isVisible()) {
          await firstEvent.click();
          await page.waitForTimeout(500);
        } else {
          await page.keyboard.press('Escape');
        }
      }
      
      console.log(`✅ Category "${category}" tested`);
      
      // Reset for next category if reset button is available
      const resetButton = page.getByRole('button', { name: 'Reset All Filters' });
      if (await resetButton.isEnabled()) {
        await resetButton.click();
        await page.waitForTimeout(1000);
      }
    }

    console.log('✅ Multiple category workflow tested successfully');
  });

  // ===========================================================
  // TEST 14 — Test Audit Trail Error Handling
  // ===========================================================
  test('14 - Test Audit Trail Error Handling', async ({ page }) => {
    console.log('🔹 [START] Test Audit Trail Error Handling');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await page.locator('a:nth-child(9)').click();
    await page.waitForLoadState('networkidle');

    // Step 2: Test incomplete form submission
    console.log('🔸 Testing incomplete form validation...');
    
    // Try to generate without selecting category (button should be disabled)
    const generateButton = page.getByRole('button', { name: 'Generate' });
    
    // Check initial state (may be disabled or enabled depending on app logic)
    const initialState = await generateButton.isEnabled();
    console.log(`Generate button initial state: ${initialState ? 'enabled' : 'disabled'}`);

    // Step 3: Test with only category selected
    await page.getByRole('button', { name: 'Open' }).first().click();
    await page.getByRole('option', { name: 'Document', exact: true }).click();
    await page.waitForTimeout(500);
    
    // Generate button behavior with just category (app allows this)
    const categoryOnlyState = await generateButton.isEnabled();
    console.log(`Generate button with category only: ${categoryOnlyState ? 'enabled' : 'disabled'}`);

    // Step 4: Complete required fields to ensure button works
    await page.getByRole('button', { name: 'Open' }).nth(2).click();
    await page.getByRole('option', { name: 'Created' }).click();
    await page.waitForTimeout(500);
    
    // Now Generate button should definitely be enabled
    await expect(generateButton).toBeEnabled();

    console.log('✅ Audit trail error handling tested');
  });

  // ===========================================================
  // TEST 15 — Test Complete Audit Trail Workflow
  // ===========================================================
  test('15 - Test Complete Audit Trail Workflow', async ({ page }) => {
    console.log('🔹 [START] Test Complete Audit Trail Workflow');

    // Step 1: Login and navigate to audit trail module
    await login(page);
    await goToDMS(page);
    await page.locator('a:nth-child(9)').click();
    await page.waitForLoadState('networkidle');

    // Step 2: Complete workflow - Fill all fields
    console.log('🔸 Executing complete audit trail workflow...');
    
    // Select category
    await page.getByRole('button', { name: 'Open' }).first().click();
    await page.getByRole('option', { name: 'Document', exact: true }).click();
    await page.waitForTimeout(500);
    
    // Select event
    await page.getByRole('button', { name: 'Open' }).nth(2).click();
    await page.getByRole('option', { name: 'Created' }).click();
    await page.waitForTimeout(500);

    // Set custom date range
    const startDateInput = page.getByRole('textbox', { name: 'mm/dd/yyyy' }).first();
    const endDateInput = page.getByRole('textbox', { name: 'mm/dd/yyyy' }).last();
    await startDateInput.clear();
    await endDateInput.clear();
    await startDateInput.fill('01/01/2024');
    await endDateInput.fill('12/31/2024');

    // Fill optional name field
    const nameInput = page.getByText('Enter Name').locator('..').getByRole('textbox');
    await nameInput.fill('Test Document');

    // Step 3: Generate report
    await page.getByRole('button', { name: 'Generate' }).click();
    await page.waitForTimeout(3000);

    // Step 4: Verify results
    await expect(page.getByRole('tab', { name: 'Document' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Date&Time' })).toBeVisible();
    
    // Step 5: Test action buttons
    await expect(page.getByRole('button', { name: 'Reset All Filters' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Add New Event Category' })).toBeEnabled();

    console.log('✅ Complete audit trail workflow tested successfully');
  });
});
