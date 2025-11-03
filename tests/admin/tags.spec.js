// import { test, expect } from '@playwright/test';
// import { faker } from '@faker-js/faker';
// import { goToModule, filterAndDownload, toggleAndCheck, filterAndSearch } from '../utils/commonActions.js';

// // Test suite for Admin - Tag Management
// test.describe.serial('Admin - Tag Management', () => {
//     // Shared test data
//     const tagData = {
//         name: `${faker.commerce.department()}_${Date.now()}_${faker.string.alphanumeric(4)}`, // âœ… Unique tag name
//         description: faker.commerce.productDescription(),
//         code: faker.string.alphanumeric(5).toUpperCase(), // âœ… Ensures unique code too
//         successMessage: 'Tag created successfully',
//     };

//     // Store the generated unique name for later use (e.g., delete action)
//     const newName = tagData.name;
//     console.log('ðŸ“Œ Test Data Initialized:', tagData);
//     console.log('ðŸ“Œ New Name for Delete Test:', newName);

//     // ---------- TEST 1: Create a New Tag ----------
//     test('should create a new tag successfully', async ({ page }) => {
//         console.log('➡️ Starting test: Create a New Tag');
//         // Login and navigate to admin section
//         await page.goto('https://sqa.note-iq.com/');
//         await page.getByRole('textbox', { name: 'Enter email address' }).fill('swetha.kulkarni@neviton.com');
//         await page.getByRole('textbox', { name: 'Enter password' }).fill('Jaishriram@2025');
//         await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
        
//         // Wait for login completion and dashboard load
//         await page.waitForLoadState('networkidle');
        
//         // Click Configure button to access admin section
//         await page.getByRole('button', { name: 'Configure' }).click();
//         console.log('✅ Logged in successfully');
        
//         // Wait for admin section to load
//         await page.waitForLoadState('networkidle');
//         await goToModule(page, 'Tags');
//         console.log('✅ Navigated to Tags module');

//         // Fill in the new Tag details
//         console.log('🔍 Filling in Tag details...');
//         await page.getByRole('tab', { name: 'New Tag' }).click();
        
//         // Wait for form to be ready
//         await expect(page.getByRole('textbox', { name: 'Tag Name' })).toBeVisible();
        
//         await page.getByRole('textbox', { name: 'Tag Name' }).fill(tagData.name);
//         await page.getByRole('textbox', { name: 'Tag Code' }).fill(tagData.code);
//         await page.getByRole('textbox', { name: 'Tag Description' }).fill(tagData.description);

//         await page.getByRole('button', { name: 'Create' }).click();
//         console.log('ðŸ“¤ Submitted Tag creation form');

//         // Verify success alert message
//         await expect(page.getByRole('alert')).toHaveText(tagData.successMessage);
//         console.log('âœ… Tag created successfully with message:', tagData.successMessage);
//     });

//     // ---------- TEST 2: Verify and Toggle Tag Status ----------
//     test('should verify existing tag and toggle its status', async ({ page }) => {
//         console.log('➡️ Starting test: Verify and Toggle Tag Status');
//         // Login and navigate to admin section
//         await page.goto('https://sqa.note-iq.com/');
//         await page.getByRole('textbox', { name: 'Enter email address' }).fill('swetha.kulkarni@neviton.com');
//         await page.getByRole('textbox', { name: 'Enter password' }).fill('Jaishriram@2025');
//         await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
        
//         // Wait for login completion
//         await page.waitForLoadState('networkidle');
        
//         // Click Configure button to access admin section
//         await page.getByRole('button', { name: 'Configure' }).click();
        
//         // Wait for admin section to load
//         await page.waitForLoadState('networkidle');
//         await goToModule(page, 'Tags');

//         console.log('ðŸ” Looking for the most recently created tag to toggle...');
        
//         // Wait for the table to load
//         await expect(page.locator('[role="grid"]')).toBeVisible();
        
//         // Find the first tag in the table (most recently created should be at the top)
//         const firstTagRow = page.locator('[role="row"]').nth(1); // Skip header row
//         await expect(firstTagRow).toBeVisible();
        
//         // Get the tag name and code from the first row to use for toggling
//         const tagNameCell = firstTagRow.locator('[role="cell"]').nth(1); // Tag Name column
//         const tagCodeCell = firstTagRow.locator('[role="cell"]').nth(2); // Tag Code column
        
//         const selectedTagName = await tagNameCell.textContent();
//         const selectedTagCode = await tagCodeCell.textContent();
        
//         console.log(`ðŸ“‹ Using existing tag for toggle test: ${selectedTagName} (${selectedTagCode})`);
        
//         // Verify the tag is visible
//         await expect(tagNameCell).toBeVisible();
//         await expect(tagCodeCell).toBeVisible();
        
//         // Now test the toggle functionality using the first row
//         console.log('ðŸ”„ Testing toggle functionality...');
        
//         // Find the toggle checkbox in the first row
//         const toggleCheckbox = firstTagRow.locator('input[type="checkbox"]').last();
//         await expect(toggleCheckbox).toBeVisible();
        
//         // Check current state and toggle
//         const isCurrentlyChecked = await toggleCheckbox.isChecked();
//         console.log(`ðŸ“Š Current toggle state: ${isCurrentlyChecked ? 'Active' : 'Inactive'}`);
        
//         // Perform toggle action
//         await toggleCheckbox.click();
        
//         // Wait for state change to complete
//         await page.waitForLoadState('networkidle');
        
//         // Verify toggle state changed
//         const newState = await toggleCheckbox.isChecked();
//         console.log(`ðŸ“Š New toggle state: ${newState ? 'Active' : 'Inactive'}`);
        
//         expect(newState).not.toBe(isCurrentlyChecked);
//         console.log('âœ… Tag status toggled successfully');
        
//         // Toggle back to original state
//         await toggleCheckbox.click();
        
//         // Wait for state change to complete
//         await page.waitForLoadState('networkidle');
        
//         const finalState = await toggleCheckbox.isChecked();
//         expect(finalState).toBe(isCurrentlyChecked);
//         console.log('âœ… Tag status restored to original state');
//     });

//     // ---------- TEST 3: Filter and Download Tag Data ----------
//     test('should filter tags and download the data', async ({ page }) => {
//         console.log('➡️ Starting test: Filter and Download Tag Data');
//         // Login and navigate to admin section
//         await page.goto('https://sqa.note-iq.com/');
//         await page.getByRole('textbox', { name: 'Enter email address' }).fill('swetha.kulkarni@neviton.com');
//         await page.getByRole('textbox', { name: 'Enter password' }).fill('Jaishriram@2025');
//         await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
        
//         // Wait for login completion
//         await page.waitForLoadState('networkidle');
        
//         // Click Configure button to access admin section
//         await page.getByRole('button', { name: 'Configure' }).click();
        
//         // Wait for admin section to load
//         await page.waitForLoadState('networkidle');
//         await goToModule(page, 'Tags');

//         // Wait for table to load and get the first tag's code for filtering
//         await expect(page.locator('[role="grid"]')).toBeVisible();
        
//         const firstTagRow = page.locator('[role="row"]').nth(1);
//         const firstTagCode = await firstTagRow.locator('[role="cell"]').nth(2).textContent();
        
//         console.log(`ðŸ” Filtering by existing Tag Code: ${firstTagCode}`);
//         await filterAndDownload(page, 'Tag Code', firstTagCode.trim());
//         console.log('âœ… Tag data downloaded successfully');
//     });

//     // ---------- TEST 4: Edit Action ----------
//     test('Edit action button working', async ({ page }) => {
//         console.log('➡️ Starting test: Edit Tag');
//         // Login and navigate to admin section
//         await page.goto('https://sqa.note-iq.com/');
//         await page.getByRole('textbox', { name: 'Enter email address' }).fill('swetha.kulkarni@neviton.com');
//         await page.getByRole('textbox', { name: 'Enter password' }).fill('Jaishriram@2025');
//         await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
        
//         // Wait for login completion
//         await page.waitForLoadState('networkidle');
        
//         // Click Configure button to access admin section
//         await page.getByRole('button', { name: 'Configure' }).click();
        
//         // Wait for admin section to load
//         await page.waitForLoadState('networkidle');
//         await goToModule(page, 'Tags');

//         // Wait for table and select first tag for editing
//         await expect(page.locator('[role="grid"]')).toBeVisible();
        
//         const firstTagRow = page.locator('[role="row"]').nth(1);
//         const originalTagName = await firstTagRow.locator('[role="cell"]').nth(1).textContent();
        
//         console.log(`âœï¸ Editing Tag: ${originalTagName}`);
        
//         // Click edit button (second button in the action column)
//         await firstTagRow.locator('button').nth(1).click();
        
//         // Wait for edit form to load
//         await expect(page.getByRole('textbox', { name: 'Tag Name' })).toBeVisible();

//         // Generate a new name for the edit
//         const editedName = `${originalTagName}_Edited_${Date.now()}`;
//         await page.getByRole('textbox', { name: 'Tag Name' }).fill(editedName);
//         await page.getByRole('button', { name: 'Update' }).isVisible();
//         await page.getByRole('button', { name: 'Update' }).click();

//         await expect(page.getByRole('alert')).toHaveText('Tag updated successfully');
//         console.log('âœ… Tag updated successfully');
//     });

//     // ---------- TEST 5: Delete Action ----------
//     test('should delete a tag successfully', async ({ page }) => {
//         console.log('➡️ Starting test: Delete Tag');
//         // Login and navigate to admin section
//         await page.goto('https://sqa.note-iq.com/');
//         await page.getByRole('textbox', { name: 'Enter email address' }).fill('swetha.kulkarni@neviton.com');
//         await page.getByRole('textbox', { name: 'Enter password' }).fill('Jaishriram@2025');
//         await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
        
//         // Wait for login completion
//         await page.waitForLoadState('networkidle');
        
//         // Click Configure button to access admin section
//         await page.getByRole('button', { name: 'Configure' }).click();
        
//         // Wait for admin section to load
//         await page.waitForLoadState('networkidle');
//         await goToModule(page, 'Tags');

//         // Wait for table and select the last tag for deletion (to avoid deleting recently created ones)
//         await expect(page.locator('[role="grid"]')).toBeVisible();
        
//         const allRows = page.locator('[role="row"]');
//         const rowCount = await allRows.count();
        
//         // Select the last tag (excluding header)
//         const lastTagRow = allRows.nth(rowCount - 1);
//         const tagToDelete = await lastTagRow.locator('[role="cell"]').nth(1).textContent();
        
//         console.log(`ðŸ—‘ï¸ Deleting Tag: ${tagToDelete}`);
//         await expect(lastTagRow).toBeVisible();

//         // Click delete button (third button in the action column)
//         await lastTagRow.locator('button').nth(2).click();
        
//         // Wait for confirmation dialog to appear
//         await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
        
//         // Confirm deletion
//         await page.getByRole('button', { name: 'Delete' }).click();

//         await expect(page.getByRole('alert')).toHaveText('Tag deleted successfully');
//         console.log('âœ… Tag deleted successfully');
//     });
// });

// // Test suite for Admin - Tag Validations
// test.describe('Admin - Tag Validations', () => {
//     test.beforeEach(async ({ page }) => {
//         console.log('➡️ Running beforeEach hook for Tag Validations');
//         // Login and navigate to admin section
//         await page.goto('https://sqa.note-iq.com/');
//         await page.getByRole('textbox', { name: 'Enter email address' }).fill('swetha.kulkarni@neviton.com');
//         await page.getByRole('textbox', { name: 'Enter password' }).fill('Jaishriram@2025');
//         await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
        
//         // Wait for login completion
//         await page.waitForLoadState('networkidle');
        
//         // Click Configure button to access admin section
//         await page.getByRole('button', { name: 'Configure' }).click();
        
//         // Wait for admin section to load
//         await page.waitForLoadState('networkidle');
//         await goToModule(page, 'Tags');
//         console.log('✅ Logged in and navigated to Tags module');
//     });

//     // ---------- TEST 6: Validation for Missing Required Fields ----------
//     test('should validate required fields when creating a tag', async ({ page }) => {
//         console.log('âž¡ï¸ Starting test: Validate Required Fields');
//         await page.getByRole('tab', { name: 'New Tag' }).click();
//         await page.getByRole('button', { name: 'Create' }).click();
//         console.log('ðŸ“¤ Submitted empty Tag creation form');

//         await expect(page.getByText('Name is required')).toBeVisible();
//         await expect(page.getByText('Tag Code is required')).toBeVisible();
//         console.log('âœ… Validation messages verified for missing fields');
//     });
//     test('tag code should at most contain 5 characters', async ({ page }) => {
//         console.log('âž¡ï¸ Starting test: Validate Tag Code Length');
//         await page.getByRole('tab', { name: 'New Tag' }).click();
//         await page.getByRole('textbox', { name: 'Tag Code' }).fill('thisismorethan5chars');
//         await page.getByRole('button', { name: 'Create' }).click();
//         console.log('ðŸ“¤ Submitted Tag creation form with long Tag Code');
//         await page.getByRole('button', { name: 'Create' }).click();
        
//         await expect(page.getByText('Tag Code must be at most 5 characters')).toBeVisible();
//         console.log('âœ… Validation message verified for Tag Code length');
    
//     });
// });

