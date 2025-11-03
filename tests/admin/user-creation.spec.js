// import { test, expect } from '@playwright/test';
// import { faker } from '@faker-js/faker';
// import { login } from '../utils/login.js';

// test.describe.serial('Admin - Department creation and verification', () => {
//     const employeeName = faker.person.fullName(); // random full name
//     const randomDate = faker.date.between({ from: '2000-01-01', to: '2030-12-31' }); // random date
//     const formattedDate = `${String(randomDate.getMonth() + 1).padStart(2, '0')}/${String(randomDate.getDate()).padStart(2, '0')}/${randomDate.getFullYear()}`;
//     const sanitizedName = employeeName.replace(/\s+/g, '').toLowerCase(); // sanitized name for email
//     const userData = {
//         employeeName, // full name
//         email: `${sanitizedName}.${faker.string.alphanumeric(3).toLowerCase()}@example.com`, // email
//         employeeNumber: faker.string.numeric(6), // 6-digit employee number
//         domain: faker.internet.domainName(), // random domain
//         jobTitle: faker.person.jobTitle(),
//         userType: [],
//         authenticationType: [],
//     };

//     test('Create a new user with random data', async ({ page }) => {
//         // Log in as admin
//         await login(page);

//         // Navigate to Role Management
//         await page.locator('a:nth-child(2)').click();
//         await expect(page.getByRole('cell', { name: 'Arcolab DMS' }).first()).toBeVisible();
//         await page.getByRole('link', { name: 'User Creation' }).click();
//         await page.getByRole('tab', { name: 'New User' }).click();

//         // Fill the user creation form
//         await page.getByRole('textbox', { name: 'Enter Login ID' }).fill(userData.email);
//         await page.getByRole('textbox', { name: 'Enter Name' }).fill(employeeName);
//         await page.getByRole('textbox', { name: 'Enter Email Address' }).fill(userData.email);
//         await page.getByRole('textbox', { name: 'Enter Employee Number' }).fill(userData.employeeNumber);
//         await page.getByRole('textbox', { name: 'Enter Domain' }).fill(userData.domain);
//         await page.getByRole('textbox', { name: 'Enter Job Title' }).fill(userData.jobTitle);

//         // Select a random User Type
//         await page.locator('#user-type').click();
//         await page.waitForSelector('ul[role="listbox"] li');
//         const userTypeOptions = page.locator('ul[role="listbox"] li');
//         const utCount = await userTypeOptions.count();
//         if (utCount > 0) {
//             const utIndex = faker.number.int({ min: 0, max: utCount - 1 });
//             const option = userTypeOptions.nth(utIndex);
//             userData.userType = (await option.textContent()).trim();
//             await option.click();
//             console.log(`Selected User Type: ${userData.userType}`);
//         } else {
//             throw new Error('No User Type options found!');
//         }

//         // Select a random Authentication Type
//         await page.locator('#user-authentication-type').click();
//         await page.waitForSelector('ul[role="listbox"] li');
//         const authOptions = page.locator('ul[role="listbox"] li');
//         const authCount = await authOptions.count();
//         if (authCount > 0) {
//             const randomIndex = faker.number.int({ min: 0, max: authCount - 2 });
//             const option = authOptions.nth(randomIndex);
//             userData.authenticationType = (await option.textContent()).trim();
//             await option.click();
//             console.log(`Selected Authentication Type: ${userData.authenticationType}`);
//         } else {
//             console.warn("âš ï¸ No authentication type options available!");
//         }

//         // Randomly select Yes or No for System Admin
//         const choice = faker.helpers.arrayElement(['Yes', 'No']);
//         let button;
//         if (choice === 'Yes') {
//             button = page.getByRole('button', { name: 'Yes' }).first();
//         } else {
//             button = page.getByRole('button', { name: 'No' }).first();
//         }
//         await button.click();
//         console.log(`Randomly clicked for System Admin: ${choice}`);

//         // Randomly select Yes or No for User Expiry and enter date if Yes
//         const secondChoice = faker.helpers.arrayElement(['Yes', 'No']);
//         let secondButton;
//         if (secondChoice === 'Yes') {
//             secondButton = page.getByRole('button', { name: 'Yes' }).nth(1);
//             secondButton.click();
//             await page.getByRole('textbox', { name: 'mm/dd/yyyy' }).fill(formattedDate);
//             console.log(`Randomly entered date: ${formattedDate}`);
//         } else {
//             secondButton = page.getByRole('button', { name: 'No' }).nth(1);
//             secondButton.click();
//         }
//         console.log(`Randomly clicked for User Expiry: ${secondChoice}`);

//         await page.getByRole('button', { name: 'Add Privileges' }).click();

//         // Randomly select a site
//         await page.getByRole('combobox', { name: 'Select Site*' }).click();
//         const siteOptions = page.locator('ul[role="listbox"] li');
//         const siteCount = await siteOptions.count();
//         const randomIndex = faker.number.int({ min: 0, max: siteCount - 1 });
//         const option = siteOptions.nth(randomIndex);
//         const selectedSite = (await option.textContent())?.trim();
//         await option.click();
//         console.log(`Randomly selected site: ${selectedSite}`);

//         // Randomly select a department
//         await page.getByRole('combobox', { name: 'Select Department*' }).click();
//         const deptOptions = page.locator('ul[role="listbox"] li');
//         const deptCount = await deptOptions.count();
//         if (deptCount === 0) {
//             throw new Error('No departments available in the dropdown');
//         }
//         const deptRandomIndex = faker.number.int({ min: 0, max: deptCount - 1 });
//         const deptOption = deptOptions.nth(deptRandomIndex);
//         const selectedDept = (await deptOption.textContent())?.trim();
//         await deptOption.click();
//         console.log(`Randomly selected department: ${selectedDept}`);

//         // Randomly select roles
//         const selectRolesComboBox = page.getByRole('combobox', { name: 'Select Roles' });
//         if (await selectRolesComboBox.isVisible().catch(() => false)) {
//             await selectRolesComboBox.click();
//             const roleOptions = page.locator('ul[role="listbox"] li input[type="checkbox"]');
//             const roleCount = await roleOptions.count();
//             if (roleCount === 0) {
//                 console.log('âš ï¸ No roles available in the dropdown');
//             } else {
//                 const rolesToSelect = faker.number.int({ min: 1, max: Math.min(roleCount, 5) });
//                 const selectedRoleIndexes = faker.helpers.arrayElements(
//                     [...Array(roleCount).keys()],
//                     rolesToSelect
//                 );
//                 for (const idx of selectedRoleIndexes) {
//                     const checkbox = roleOptions.nth(idx);
//                     const label = await checkbox.locator('..').textContent();
//                     await checkbox.check();
//                     console.log(`âœ… Selected Role: ${label?.trim()}`);
//                 }
//             }
//             await page.keyboard.press('Escape');
//         } else {
//             console.log('âš ï¸ Select Roles combobox not found, skipping...');
//         }

//         // Randomly select user groups
//         await page.getByRole('combobox', { name: 'Select User Group' }).click();
//         const groupOptions = page.locator('ul[role="listbox"] li input[type="checkbox"]');
//         const groupCount = await groupOptions.count();
//         if (groupCount === 0) {
//             throw new Error('No user groups available in the dropdown');
//         }
//         const groupsToSelect = faker.number.int({ min: 1, max: Math.min(groupCount, 5) });
//         const selectedGroupIndexes = faker.helpers.arrayElements(
//             [...Array(groupCount).keys()],
//             groupsToSelect
//         );
//         for (const idx of selectedGroupIndexes) {
//             const checkbox = groupOptions.nth(idx);
//             const label = await checkbox.locator('..').textContent();
//             await checkbox.check();
//             console.log(`Selected User Group: ${label?.trim()}`);
//         }
//         await page.keyboard.press('Escape');

//         // Submit the form
//         await page.getByRole('button', { name: 'Add', exact: true }).click();
//         await page.getByRole('button', { name: 'Create' }).click();
//     });
// });

// test.describe('Admin - Verifications in User Creation', () => {
//     test.beforeEach(async ({ page }) => {
//         // Log in and navigate to User Creation
//         await login(page);
//         await page.locator('a:nth-child(2)').click();
//         await page.getByRole('link', { name: 'User Creation' }).click();
//     });

//     test('Verify error messages for missing required fields', async ({ page }) => {
//         // Check for error messages when required fields are not filled
//         await page.getByRole('tab', { name: 'New User' }).click();
        
//         await page.getByRole('textbox', { name: 'Enter Login ID' }).click();
//         await page.getByRole('textbox', { name: 'Enter Name' }).click();
//         await page.getByRole('textbox', { name: 'Enter Email Address' }).click();
//         await page.getByRole('textbox', { name: 'Enter Employee Number' }).click();
//         await page.getByRole('textbox', { name: 'Enter Domain' }).click();
//         await page.getByRole('textbox', { name: 'Enter Job Title' }).click();
//         await page.locator('#user-type').click();
//         await page.locator('#user-type').click();
//         await page.locator('#user-authentication-type').click();
//         await page.locator('div').filter({ hasText: /^Add Privileges$/ }).first().click();
//         await expect(page.getByText('Login Id is required')).toBeVisible();
//         await expect(page.getByText('User Name is required')).toBeVisible();
//         await expect(page.getByText('User Mail Id is required')).toBeVisible();
//         await expect(page.getByText('User Employee Number is required')).toBeVisible();
//         await expect(page.getByText('User Domain is required')).toBeVisible();
//         await expect(page.getByText('Job Title is required')).toBeVisible();
//         await expect(page.getByText('User Type is required')).toBeVisible();
//         await expect(page.getByText('Authentication Type is required')).toBeVisible();
//     });

//     test('Verify error messages for invalid input', async ({ page }) => {
//         // Check for error messages when invalid data is entered
//         await page.getByRole('tab', { name: 'New User' }).click();
//         await page.getByRole('textbox', { name: 'Enter Login ID' }).click();
//         await page.getByRole('textbox', { name: 'Enter Login ID' }).fill('testing');
//         await page.locator('#root div').filter({ hasText: 'OrganisationSiteDepartmentRoleUser GroupUser CreationTagsUser Logout/ReleaseEnv' }).nth(1).click();
//         await expect(page.getByText('Login Id must be a valid email')).toBeVisible();

//         await page.getByRole('textbox', { name: 'Enter Email Address' }).click();
//         await page.getByRole('textbox', { name: 'Enter Email Address' }).fill('test');
//         await page.locator('#root div').filter({ hasText: 'OrganisationSiteDepartmentRoleUser GroupUser CreationTagsUser Logout/ReleaseEnv' }).nth(1).click();
//         await expect(page.getByText('User Mail Id must be a valid email')).toBeVisible();

//         await page.getByRole('textbox', { name: 'Enter Employee Number' }).click();
//         await page.getByRole('textbox', { name: 'Enter Employee Number' }).fill('morethan10characters');
//         await page.locator('#root div').filter({ hasText: 'OrganisationSiteDepartmentRoleUser GroupUser CreationTagsUser Logout/ReleaseEnv' }).nth(1).click();
//         await expect(page.getByText('User Employee Number must be')).toBeVisible();
//     });
// });

