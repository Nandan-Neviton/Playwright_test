import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToModule, toggleAndCheck, filterAndDownload, filterAndSearch, goToAdminSection } from '../utils/commonActions.js';
import { ai } from '../../playwright.config.js';

if (ai.heal) {
  console.log('AI healing is enabled');
}
test.describe.serial('Admin - Roles creation and verification', () => {
    // Shared test data
    const roleData = {
        name: `${faker.person.jobTitle()}_${Date.now()}_${faker.string.alphanumeric(4)}`, // ✅ Unique name
        description: faker.commerce.productDescription(),
        successMessage: 'Role created successfully',
        accessLevel: '',   // Will be dynamically set
        accountType: '',   // Will be dynamically set
    };

    // Store the generated unique name for later use
    const newName = roleData.name;

    console.log('📌 Initialized Role Data:', roleData);
    console.log('📌 New Name for Edit/Delete:', newName);

    // ---------- TEST 1: Create a New Role ----------
    test('role-creation', async ({ page }) => {
        console.log('➡️ Starting test: Create a New Role');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        console.log('✅ Logged in successfully');
        await goToAdminSection(page);
        await goToModule(page, 'Role');
        console.log('✅ Navigated to Role module');

        await page.getByRole('tab', { name: 'New Role' }).click();
        console.log('📝 Filling role creation form...');

        await page.getByRole('textbox', { name: 'Enter Role Name' }).fill(roleData.name);
        await page.getByRole('textbox', { name: 'Enter Description' }).fill(roleData.description);

        // Select random Access Level
        await page.locator('#role-access-level').click();
        const accessOptions = page.locator('ul[role="listbox"] li');
        const accessCount = await accessOptions.count();
        const randomIndex = faker.number.int({ min: 0, max: accessCount - 1 });
        const option = accessOptions.nth(randomIndex);
        roleData.accessLevel = (await option.textContent())?.trim() ?? 'N/A';
        await option.click();
        console.log(`✅ Selected Access Level: ${roleData.accessLevel}`);

        // Select random Account Type
        await page.locator('#role-account-type').click();
        const accountTypeOptions = page.locator('ul[role="listbox"] li');
        const atCount = await accountTypeOptions.count();
        const atIndex = faker.number.int({ min: 0, max: atCount - 1 });
        const option1 = accountTypeOptions.nth(atIndex);
        roleData.accountType = (await option1.textContent())?.trim() ?? 'N/A';
        await option1.click();
        console.log(`✅ Selected Account Type: ${roleData.accountType}`);

        // Proceed
        await page.getByRole('button', { name: 'Next', exact: true }).click();
        console.log('➡️ Proceeding to module permissions step');

        // Predefined role modules
        const roles = [
            'Dashboard', 'Admin', 'Config', 'Workflow', 'Template', 'Document',
            'Print', 'Repository', 'Reports', 'Audit Trail', 'Advanced Search',
            'Virtual Data Room', 'Print Package Manager', 'Print Events', 'Print Event Settings'
        ];

        const numRolesToPick = faker.number.int({ min: 1, max: roles.length });
        const selectedRoles = faker.helpers.arrayElements(roles, numRolesToPick);

        for (const role of selectedRoles) {
            let roleButton;
            if (role === 'Advanced Search') {
                roleButton = page
                    .getByLabel('DashboardAdminConfigWorkflowTemplateDocumentPrintRepositoryReportsAudit')
                    .getByRole('button', { name: 'Advanced Search' });
            } else {
                roleButton = page.locator(
                    `button:has-text("${role}"), div[role="button"]:has-text("${role}")`
                ).first();
            }

            if (await roleButton.isVisible()) {
                await roleButton.click();

                const checkboxes = page.locator('input[type="checkbox"]');
                const count = await checkboxes.count();

                if (count > 0) {
                    const numToSelect = faker.number.int({ min: 1, max: count });
                    const indexes = faker.helpers.arrayElements([...Array(count).keys()], numToSelect);

                    const selectedPermissions = [];
                    for (const idx of indexes) {
                        const checkbox = checkboxes.nth(idx);
                        if (!(await checkbox.isChecked())) {
                            await checkbox.check();
                        }
                        const label = await checkbox.evaluate(node => {
                            const row = node.closest('tr');
                            const colIndex = [...row.querySelectorAll('td input[type="checkbox"]')].indexOf(node);
                            const rowName = row.querySelector('td:first-child')?.innerText.trim();
                            const colName = document.querySelectorAll('table thead th')[colIndex + 1]?.innerText.trim();
                            return `${rowName} - ${colName}`;
                        });
                        selectedPermissions.push(label);
                    }
                    console.log(`✅ Role: ${role}, Permissions: ${selectedPermissions.join(', ')}`);
                } else {
                    console.log(`⚠️ Role: ${role}, No checkboxes found`);
                }
            } else {
                console.log(`⚠️ Role button not found for ${role}`);
            }
        }

        await page.getByRole('button', { name: 'Create' }).click();
        await expect(page.getByRole('alert')).toHaveText(roleData.successMessage);
        console.log('✅ Role created successfully with message:', roleData.successMessage);
    });

    // ---------- TEST 2: Verify Created Role ----------
    test('role-verification', async ({ page }) => {
        console.log('➡️ Starting test: Verify Created Role');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Role');

        console.log(`🔍 Searching for Role by Name: ${roleData.name}`);
        await filterAndSearch(page, 'Name', roleData.name);
        await page.waitForTimeout(2000);

        await expect(page.getByRole('cell', { name: roleData.name }).last()).toBeVisible();
        console.log('✅ Role found in table:', roleData.name);

        await toggleAndCheck(page, 'Role has been deactivated', 'Inactive');
        console.log('✅ Role deactivated');

        await toggleAndCheck(page, 'Role has been activated', 'Active');
        console.log('✅ Role re-activated');
    });

    // ---------- TEST 3: Filtering + Download ----------
    test('should filter roles by name and download results', async ({ page }) => {
        console.log('➡️ Starting test: Filter & Download Role Data');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Role');

        console.log(`🔍 Filtering by Role Name: ${roleData.name}`);
        await filterAndDownload(page, 'Name', roleData.name);
        console.log('✅ Role data downloaded successfully');
    });

    // ---------- TEST 4: Edit Action ----------
    test('Edit action button working', async ({ page }) => {
        console.log('➡️ Starting test: Edit Role');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Role');

        console.log(`✏️ Editing Role: ${roleData.name}`);
        await page.getByRole('row', { name: new RegExp(`^${roleData.name}.*`) }).getByRole('button').nth(1).click();

        await page.getByRole('textbox', { name: 'Role Name' }).fill(newName);
        await page.getByRole('button', {name: 'Update'}).isVisible()
        await page.getByRole('button', { name: 'Update' }).click();

        await expect(page.getByRole('alert')).toHaveText('Role updated successfully');
        console.log('✅ Role updated successfully');
    });

    // ---------- TEST 5: Delete Action ----------
    test('Delete action button working', async ({ page }) => {
        console.log('➡️ Starting test: Delete Role');
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Role');

        const row = page.getByRole('row', { name: new RegExp(`^(${newName}|${roleData.name}).*`) });
        await expect(row).toBeVisible();
        console.log('✅ Role row is visible for deletion');

        await row.getByRole('button').nth(2).click();
        await page.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByRole('alert')).toHaveText('Role deleted successfully');
        console.log('✅ Role deleted successfully');
    });
});
