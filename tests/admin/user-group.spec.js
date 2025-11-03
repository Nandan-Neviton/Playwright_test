// // tests/admin/userGroupManagement.spec.js
// import { test, expect } from '@playwright/test';
// import { faker } from '@faker-js/faker';
// import { goToModule, toggleAndCheck, filterAndDownload, filterAndSearch } from '../utils/commonActions.js';

// // ---------------- USER GROUP MANAGEMENT TESTS ----------------
// test.describe.serial('Admin - User Group Management', () => {
//     // Shared test data
//     const userData = {
//         name: `${faker.commerce.department()}_${Date.now()}_${faker.string.alphanumeric(4)}`, // unique group name
//         description: faker.commerce.productDescription(),
//         successMessage: 'User Group created successfully',
//     };
//     let updatedGroupName = `${userData.name}_Updated`;

//     // Run login + navigation before each test
//     test.beforeEach(async ({ page }) => {
//         console.log('➡️ Running beforeEach hook for User Group Management');
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
//         await goToModule(page, 'User Group');
//         console.log('✅ Logged in and navigated to User Group module');
//     });

//     // ---------- TEST 1: Create ----------
//     test('should create a new user group successfully', async ({ page }) => {
//         console.log('🔍 Creating new User Group:', userData);

//         await page.getByRole('tab', { name: 'New User Group' }).click();
        
//         // Wait for form to be ready
//         await expect(page.getByRole('textbox', { name: 'Enter Group Name' })).toBeVisible();
        
//         await page.getByRole('textbox', { name: 'Enter Group Name' }).fill(userData.name);
//         await page.getByRole('textbox', { name: 'Enter Description' }).fill(userData.description);

//         // Add users to the group
//         await page.getByRole('button', { name: 'Add Users' }).click();
        
//         // Wait for user selection modal to load
//         await page.waitForLoadState('networkidle');
        
//         const userCheckboxes = page.locator('input[type="checkbox"]');
//         const userCount = await userCheckboxes.count();

//         if (userCount === 0) {
//             console.log('âš ï¸ No user checkboxes found after clicking Add Users');
//         } else {
//             const usersToSelect = faker.number.int({ min: 1, max: userCount });
//             const selectedUserIndexes = faker.helpers.arrayElements(
//                 [...Array(userCount).keys()],
//                 usersToSelect
//             );
//             for (const idx of selectedUserIndexes) {
//                 const checkbox = userCheckboxes.nth(idx);
//                 await expect(checkbox).toBeVisible();
//                 await checkbox.check();
//             }
//             console.log(`âœ… Selected ${usersToSelect} users for the group`);
//         }
//         await page.getByRole('button', { name: 'Add Users' }).click();

//         // Create the group
//         await page.getByRole('button', { name: 'Create' }).click();

//         await expect(page.getByRole('alert')).toHaveText(userData.successMessage);
//         console.log('âœ… User Group created successfully:', userData.name);
//     });

//     // ---------- TEST 2: Verify + Toggle ----------
//     test('should verify created user group and toggle status', async ({ page }) => {
//         console.log(`ðŸ” Searching for User Group: ${userData.name}`);
//         await filterAndSearch(page, 'Name', userData.name);

//         await toggleAndCheck(page, 'User Group has been deactivated', 'Inactive');
//         console.log('âœ… User Group deactivated');

//         await toggleAndCheck(page, 'User Group has been activated', 'Active');
//         console.log('âœ… User Group re-activated');
//     });

//     // ---------- TEST 3: Filter + Download ----------
//     test('should filter and download user group data', async ({ page }) => {
//         console.log(`ðŸ“¥ Filtering + Downloading User Group: ${userData.name}`);
//         await filterAndDownload(page, 'Name', userData.name);
//         console.log('âœ… User Group data downloaded successfully');
//     });

//     // ---------- TEST 4: Edit ----------
//     test('should edit a user group successfully', async ({ page }) => {
//         console.log('âœï¸ Testing User Group Edit functionality...');
        
//         // Wait for the table to load and find the first user group to edit
//         await expect(page.locator('[role="grid"]')).toBeVisible();
        
//         const firstUserGroupRow = page.locator('[role="row"]').nth(1); // Skip header row
//         await expect(firstUserGroupRow).toBeVisible();
        
//         // Get the current user group name for reference
//         const currentUserGroupName = await firstUserGroupRow.locator('[role="cell"]').nth(1).textContent();
//         console.log(`ðŸ“ Editing existing User Group: ${currentUserGroupName}`);
        
//         // Click edit button (second button in the action column)
//         await firstUserGroupRow.locator('button').nth(1).click();
        
//         // Wait for edit form to load
//         await expect(page.getByRole('textbox', { name: 'Enter Group Name' })).toBeVisible();

//         // Generate a new name for the edit
//         const editedGroupName = `${currentUserGroupName}_Edited_${Date.now()}`;
//         await page.getByRole('textbox', { name: 'Enter Group Name' }).fill(editedGroupName);
//         await page.getByRole('button', { name: 'Update' }).isVisible();
//         await page.getByRole('button', { name: 'Update' }).click();

//         await expect(page.getByRole('alert')).toHaveText('User Group updated successfully');
//         console.log('âœ… User Group updated successfully to:', editedGroupName);
//     });

//     // ---------- TEST 5: Delete ----------
//     test('should delete a user group successfully', async ({ page }) => {
//         console.log(`ðŸ—‘ï¸ Deleting User Group: ${updatedGroupName}`);

//         const row = page.getByRole('row', { name: new RegExp(`^(${updatedGroupName}|${userData.name}).*`) });
//         await expect(row).toBeVisible();

//         await row.getByRole('button').nth(2).click();
//         await page.getByRole('button', { name: 'Delete' }).click();

//         await expect(page.getByRole('alert')).toHaveText('User Group deleted successfully');
//         console.log('âœ… User Group deleted successfully');
//     });
// });

// // ---------------- USER GROUP VALIDATION TESTS ----------------
// test.describe('Admin - User Group Validations', () => {
//     test.beforeEach(async ({ page }) => {
//         console.log('➡️ Running beforeEach hook for User Group Validations');
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
//         await goToModule(page, 'User Group');
//         console.log('✅ Logged in and navigated to User Group module');
//     });

//     // ---------- TEST 6: Required Fields ----------
//     test('should validate required fields when creating a user group', async ({ page }) => {
//         console.log('âš ï¸ Validating required fields');

//         await page.getByRole('tab', { name: 'New User Group' }).click();
//         await page.getByRole('button', { name: 'Create' }).click();

//         await expect(page.getByText('Name is required')).toBeVisible();
//         console.log('âœ… Validation message verified for missing group name');
//     });
// });

