// Test suite for Admin Email Template functionality using Playwright
// This file contains end-to-end tests to create, verify, toggle, filter, download, and delete email templates.
// It also includes validation tests for required fields on the creation form.

import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, goToConfigSection, goToAdminSection, filterAndSearch } from '../utils/commonActions.js';

// Describe block runs tests serially to avoid test interference when manipulating shared data
test.describe.serial('CI Tests — Admin Email Template', () => {
    // Test data setup using faker to generate realistic, unique values
    const emailData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        subject: faker.company.catchPhrase(),
        successMessage: `Email template deleted`,
        notifOptions: 'User',
        activityType: 'User Disabled Failed Login',
        body: faker.lorem.paragraphs(1),
    };
    // newName used for potential renaming in edit flows (currently unused)
    const newName = faker.commerce.department().slice(0, 4);

    // ============================
    // Test 01 - Create Email Template
    // ============================
    test('01 - Should create a new Email Template successfully', async ({ page }) => {
        // Logging markers are used in the test for step-by-step debugging
        console.log('🔹 [START] Test 01: Create Email Template');

        // Step 1: Authenticate as an admin user
        console.log('>>> Step 1: Logging in as Admin...');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

        // Step 2: Navigate to Configuration section of the application
        console.log('>>> Step 2: Navigating to Configuration Section...');
        await goToConfigSection(page);

        // Step 3: Open the Email Template module via navigation helpers
        console.log('>>> Step 3: Opening Email Template Module...');
        await goToModule(page, 'Email-Template');

        // Step 4: Ensure New Email Template tab is active
        console.log('>>> Step 4: Clicking on "New Email Template" tab...');
        await page.getByRole('tab', { name: 'New Email Template' }).click();

        // Step 5: Fill the Notification Title field with generated name
        console.log(`>>> Step 5: Filling Notification Title: ${emailData.name}`);
        await page.getByRole('textbox', { name: 'Notification Title' }).fill(emailData.name);

        // Step 6: Fill the Notification Description field with generated description
        console.log(`>>> Step 6: Filling Notification Description: ${emailData.description}`);
        await page.getByRole('textbox', { name: 'Notification Description' }).fill(emailData.description);

        // Step 7: Select Notification Type from dropdown (interaction sometimes flaky as noted)
        // The code clicks the dropdown and selects an option by visible name
        console.log(`>>> Step 7: Selecting Notification Type: ${emailData.notifOptions}`);
        await page.locator('#notification_type').click();
        await page.getByRole('option', { name: emailData.notifOptions }).click();

        // Step 8: Select Activity Type from dropdown
        console.log(`>>> Step 8: Selecting Activity Type: ${emailData.activityType}`);
        await page.locator('#notification_activity_type').click();
        await page.getByRole('option', { name: emailData.activityType }).click();

        // Step 9: Fill the Subject field
        console.log(`>>> Step 9: Filling Notification Subject: ${emailData.subject}`);
        await page.getByRole('textbox', { name: 'Notification Subject' }).fill(emailData.subject);

        // Step 10: Open the Add System Users dialog/dropdown to select recipients
        console.log('>>> Step 10: Adding System Users...');
        await page.getByRole('button', { name: 'Add System Users' }).first().click();

        // Step 11: Randomly select up to 3 checkboxes from the System Users list if any exist
        // This block handles cases where there are zero checkboxes (no users available)
        console.log('>>> Step 11: Selecting random checkboxes from System Users list...');
        const checkboxes = page.getByRole('checkbox');
        const count = await checkboxes.count();
        if (count === 0) {
            // Graceful handling: no users to select
            console.log('>>> No checkboxes found, skipping selection');
        } else {
            // Select up to 3 unique random checkboxes
            const numberToSelect = Math.min(count, 3);
            console.log(`>>> Found ${count} checkboxes, selecting ${numberToSelect}`);
            const selectedIndexes = new Set();
            while (selectedIndexes.size < numberToSelect) {
                selectedIndexes.add(Math.floor(Math.random() * count));
            }
            for (const i of selectedIndexes) {
                const cb = checkboxes.nth(i);
                // Ensure checkbox is in view before clicking
                await cb.scrollIntoViewIfNeeded();
                await cb.click();
                console.log(`>>> Selected checkbox #${i + 1}`);
            }
            // Clicking outside to close dropdown or modal
            await page.mouse.click(0, 0); // Close dropdown
        }

        // Step 12: Randomly choose between Plain Text or HTML email format
        console.log('>>> Step 12: Selecting email format (Plain Text / HTML)...');
        const options = ['Plain Text', 'HTML'];
        const randomChoice = options[Math.floor(Math.random() * options.length)];
        console.log(`>>> Selected format: ${randomChoice}`);
        await page.getByRole('radio', { name: randomChoice }).click();

        // Step 13: Fill the Notification Body. Handles either a regular textbox or a rich text editor role.
        console.log('>>> Step 13: Filling Notification Body...');
        const bodyField = page.getByRole('textbox', { name: 'Notification Body' }).or(page.getByRole('textbox', { name: 'rdw-editor' }));
        await bodyField.click();
        await bodyField.fill(emailData.body);

        // Step 14: Submit the form to create the Email Template
        console.log('>>> Step 14: Clicking "Create" to save Email Template...');
        await page.getByRole('button', { name: 'Create' }).click();

        // Step 15: Validate that a success message appears after creation
        console.log('>>> Step 15: Verifying success message...');
        await expect(page.getByText('Email template successfully')).toBeVisible();

        console.log('✅ [END] Test 01: Email Template created successfully');
    });

    // ============================
    // Test 02 - Verify and Toggle Email Template Status
    // ============================
    test('02 - Should verify created Email Template and toggle its status', async ({ page }) => {
        // This test verifies that the previously created template appears in the list and toggles its status
        console.log('🔹 [START] Test 02: Verify and Toggle Email Template Status');

        // Step 1: Login
        console.log('>>> Step 1: Logging in as Admin...');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

        // Step 2: Go to Configuration
        console.log('>>> Step 2: Navigating to Configuration Section...');
        await goToConfigSection(page);

        // Step 3: Open Email Template module
        console.log('>>> Step 3: Opening Email Template Module...');
        await goToModule(page, 'Email-Template');

        // Step 4: Filter/search by the Title to find the created template
        console.log(`>>> Step 4: Searching for Email Template by name: ${emailData.name}`);
        await filterAndSearch(page, 'Title', emailData.name);
        await page.waitForTimeout(2000);

        // Step 5: Ensure the template appears in the results table
        console.log('>>> Step 5: Verifying that Email Template is visible in table...');
        await expect(page.getByRole('cell', { name: emailData.name })).toBeVisible();

        // Step 6: Toggle the template status (Inactive -> Active and back) using helper toggleAndCheck
        // Note: toggleAndCheck function is expected to be available in scope; if not, tests will error.
        console.log('>>> Step 6: Toggling template status (Inactive -> Active)...');
        await toggleAndCheck(page, 'Email Template has been', 'Inactive');
        await toggleAndCheck(page, 'Email Template has been', 'Active');

        console.log('✅ [END] Test 02: Email Template verified and status toggled successfully');
    });

    // ============================
    // Test 03 - Filter and Download Email Template
    // ============================
    test('03 - Should filter Email Template and download results', async ({ page }) => {
        // This test verifies filtering by Name and triggers a download of the result set
        console.log('🔹 [START] Test 03: Filter and Download Email Template');

        // Step 1: Login
        console.log('>>> Step 1: Logging in as Admin...');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

        // Step 2: Navigate to Configuration
        console.log('>>> Step 2: Navigating to Configuration Section...');
        await goToConfigSection(page);

        // Step 3: Open the Email Template module
        console.log('>>> Step 3: Opening Email Template Module...');
        await goToModule(page, 'Email-Template');

        // Step 4: Apply filter and download using shared helper
        console.log(`>>> Step 4: Filtering results by Template Name: ${emailData.name}`);
        await filterAndDownload(page, 'Name', emailData.name);

        console.log('✅ [END] Test 03: Filter and download of Email Template completed successfully');
    });

    // Edit module is not working in the application
    // test('04 - Should edit an existing Email Template', async ({ page }) => {
    //   console.log('🔹 [START] Test 04: Edit Email Template');
    //   ...
    // });

    // ============================
    // Test 04 - Delete Existing Email Template
    // ============================
    test('04 - Should delete an existing Email Template successfully', async ({ page }) => {
        // This test deletes the created email template and verifies the deletion message
        console.log('🔹 [START] Test 04: Delete Email Template');

        // Step 1: Login
        console.log('>>> Step 1: Logging in as Admin...');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

        // Step 2: Navigate to Configuration
        console.log('>>> Step 2: Navigating to Configuration Section...');
        await goToConfigSection(page);

        // Step 3: Open Email Template module
        console.log('>>> Step 3: Opening Email Template Module...');
        await goToModule(page, 'Email-Template');

        // Step 4: Filter by Title to locate the template and wait for results
        console.log(`>>> Step 4: Filtering template by Title: ${emailData.name}`);
        await filterAndSearch(page, 'Title', emailData.name);
        await page.waitForTimeout(2000);

        // Step 5: Perform delete action: click Delete twice (confirmation flow)
        console.log('>>> Step 5: Deleting the Email Template...');
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();

        // Step 6: Verify the alert text matches expected success message
        console.log('>>> Step 6: Verifying deletion success message...');
        await expect(page.getByRole('alert')).toHaveText(emailData.successMessage);

        console.log('✅ [END] Test 04: Email Template deleted successfully');
    });
});

// ============================
// Validation Tests
// ============================
// These tests validate required field error messages when attempting to create an Email Template
test.describe('Email Template Validations', () => {
    test('Validation - Should display proper errors when creating Email Template with empty fields', async ({ page }) => {
        console.log('🔹 [START] Validation Test: Empty Fields on Email Template Creation');

        // Step 1: Login
        console.log('>>> Step 1: Logging in as Admin...');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

        // Step 2: Go to Configuration
        console.log('>>> Step 2: Navigating to Configuration Section...');
        await goToConfigSection(page);

        // Step 3: Open Email Template module
        console.log('>>> Step 3: Opening Email Template Module...');
        await goToModule(page, 'Email-Template');

        // Step 4: Attempt to create without filling fields to trigger validation
        console.log('>>> Step 4: Clicking "New Email Template" and trying to Create without filling fields...');
        await page.getByRole('tab', { name: 'New Email Template' }).click();
        await page.getByRole('button', { name: 'Create' }).click();

        // Step 5: Assert that expected validation messages are visible for each required field
        console.log('>>> Step 5: Verifying validation error messages...');
        await expect(page.getByText('Notification Title is required')).toBeVisible();
        await expect(page.getByText('Notification Description is')).toBeVisible();
        await expect(page.getByText('Notification Type is required')).toBeVisible();
        await expect(page.getByText('Activity Type is required')).toBeVisible();
        await expect(page.getByText('Subject is required')).toBeVisible();
        await expect(page.getByText('Please provide a valid mail')).toBeVisible();
        await expect(page.getByText('Notification body is required')).toBeVisible();

        console.log('✅ [END] Validation Test: All required field validation messages displayed correctly');
    });
});
