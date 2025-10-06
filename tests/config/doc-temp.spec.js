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

// =======================
// Test Suite: Document Types
// =======================
test.describe.serial('CI Tests — Admin: Document Types', () => {
    // -----------------------
    // Test Data (Randomized for CI runs)
    // -----------------------
    const docData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        prefixCode: faker.number.int({ min: 10, max: 100 }).toString(),
        numeringSystem: 'Musi',
        initialVersion: faker.number.int({ min: 0, max: 10 }).toString(),
        docFormat: 'Word Document (DOCX)',
        successMessage: 'Document Type created successfully',
    };

    const updatedName = faker.commerce.department().slice(0, 4);

    // -----------------------
    // 01 - Create Document Type
    // -----------------------
    test('01 - Create Document Type', async ({ page }) => {
        console.log('🚀 [START] Creating new Document Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Document Type/ Template Type');

        await page.getByRole('tab', { name: 'New Document Type/Template' }).click();

        await page.getByRole('textbox', { name: 'Name' }).fill(docData.name);
        await page.getByRole('textbox', { name: 'Prefix code' }).fill(docData.prefixCode);
        await page.getByRole('textbox', { name: 'Description' }).fill(docData.description);
        await page.locator('#doc-type-numbering-system').click();
        await page.getByRole('option', { name: docData.numeringSystem }).click();
        await page.getByPlaceholder('Enter Version').fill(docData.initialVersion);
        await clickRandomButton(page, [{ options: { name: 'External Document' } },
        { options: { name: 'Default Format' } },]);
        await page.getByRole('tabpanel', { name: 'Document Type Template Type' }).getByLabel('', { exact: true }).click();
        await page.getByRole('option', { name: docData.docFormat }).click();
        await clickRandomButton(page, [{ options: { name: 'Active', exact: true } },
        { options: { name: 'Inactive' } },]);
        await clickRandomButton(page, [{ options: { name: 'Yes' } },
        { options: { name: 'No', } },]);
        await clickRandomButton(page, [{ options: { name: 'Yes', index: 1 } },
        { options: { name: 'No', index: 1 } },]);
        await clickRandomButton(page, [{ options: { name: 'Yes', index: 2 } },
        { options: { name: 'No', index: 2 } },]);

        await page.getByRole('radio', { name: 'Auto' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByRole('combobox', { name: 'Select System Data Field' }).click()
        const checkboxes = page.locator('role=checkbox');
        const count = await checkboxes.count();
        if (count === 0) {
            console.log('>>> No checkboxes found in combobox');
            return;
        }
        const selectMultiple = Math.random() < 0.5; // 50% chance
        const numberToSelect = selectMultiple ? Math.floor(Math.random() * count) + 1 : 1;
        console.log(`>>> Will select ${numberToSelect} checkbox(es)`);
        const selectedIndexes = new Set();
        while (selectedIndexes.size < numberToSelect) {
            selectedIndexes.add(Math.floor(Math.random() * count));
        }
        for (const i of selectedIndexes) {
            const cb = checkboxes.nth(i);
            await cb.scrollIntoViewIfNeeded();
            await cb.click();
            console.log(`>>> Selected checkbox #${i + 1}`);
        }
        await page.mouse.click(0, 0);
        await page.getByRole('button', { name: 'Add' }).click();
        await page.getByRole('combobox', { name: 'Select Parent Reporsitory' }).click();
        await page.getByRole('option', { name: 'NEVRepo' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByRole('combobox', { name: 'Workflow Type' }).click();

        const checkboxes1 = page.getByRole('checkbox');
        const count1 = await checkboxes1.count();
        if (count === 0) {
            console.log('>>> No checkboxes found in combobox');
            return;
        }
        const selectMultiple1 = Math.random() < 0.5;
        const numberToSelect1 = selectMultiple1 ? Math.floor(Math.random() * count1) + 1 : 1;
        console.log(`>>> Will select ${numberToSelect1} checkbox(es)`);
        const selectedIndexes1 = new Set();
        while (selectedIndexes1.size < numberToSelect1) {
            selectedIndexes1.add(Math.floor(Math.random() * count1));
        }
        for (const i of selectedIndexes1) {
            const checkbox1 = checkboxes1.nth(i);
            await checkbox1.click({ force: true });
            console.log(`>>> Selected checkbox #${i + 1}`);
        }
        await page.mouse.click(0, 0);

        await page.getByRole('button', { name: 'Add' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByRole('button', { name: 'YES' }).first().click()
        await clickRandomButton(page, [{ options: { name: 'Months' } }]);
        await page.getByRole('textbox', { name: 'Months', exact: true }).fill('10');
        await clickRandomButton(page, [{ options: { name: 'Weeks' } },]);

        await page.getByRole('textbox', { name: 'Weeks' }).fill('10');
        await page.locator('input[name="reminderRecurrence"]').fill('10');
        await page.getByRole('button', { name: 'NO' }).nth(1).click()

        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByRole('tabpanel', { name: 'Notifcation Activity*' }).getByLabel('').click();
        await page.getByRole('option', { name: 'Document/Template Created' }).click();
        await page.getByRole('button', { name: 'Add System Users' }).first().click()
        const checkboxes2 = page.locator('role=checkbox');
        const count2 = await checkboxes2.count();
        if (count === 0) {
            console.log('>>> No checkboxes found in combobox');
            return;
        }
        const selectMultiple2 = Math.random() < 0.5; // 50% chance
        const numberToSelect2 = selectMultiple2 ? Math.floor(Math.random() * count2) + 1 : 1;
        console.log(`>>> Will select ${numberToSelect2} checkbox(es)`);
        const selectedIndexes2 = new Set();
        while (selectedIndexes2.size < numberToSelect2) {
            selectedIndexes2.add(Math.floor(Math.random() * count2));
        }
        for (const i of selectedIndexes2) {
            const cb = checkboxes2.nth(i);
            await cb.scrollIntoViewIfNeeded();
            await cb.click();
            console.log(`>>> Selected checkbox #${i + 1}`);
        }
        await page.mouse.click(0, 0);

        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.getByRole('button', { name: 'Create', exact: true }).click()
        await expect(page.getByRole('alert')).toHaveText('Document Type created successfully');
        console.log('✅ Document Type created successfully');
    });

    // -----------------------
    // 02 - Verify Document Type and Toggle Status
    // -----------------------
    test('02 - Verify Document Type and Toggle Status', async ({ page }) => {
        console.log('🔹 Test Start: Verify Document Type and Toggle Status');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Document Type/ Template Type');

        console.log(`🔹 Filtering by Name: ${docData.name}`);
        await filterAndSearch(page, 'Name', docData.name);
        await page.waitForTimeout(2000);

        const inactiveCell = page.getByRole('cell', { name: 'Inactive' });
        const count = await inactiveCell.count();
        if (count === 0) {
            console.log('✅ No "Inactive" entries found — nothing to toggle.');
            return;
        }
        else{
            await toggleAndCheck(page, 'Document Type has been activated', 'Active');
        }
        await expect(page.getByRole('cell', { name: docData.name })).toBeVisible();
    });

    // -----------------------
    // 03 - Filter and Download Document Type
    // -----------------------
    test('03 - Filter and Download Document Type', async ({ page }) => {
        console.log('🔹 Test Start: Filter and Download Document Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Document Type/ Template Type');

        console.log(`🔹 Filtering by Name: ${docData.name}`);
        await filterAndDownload(page, 'Name', docData.name);

        console.log('✅ Filter and download completed');
    });

    // -----------------------
    // 04 - Edit Document Type
    // -----------------------
    test('04 - Edit Document Type', async ({ page }) => {
        console.log('🔹 Test Start: Edit Document Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Document Type/ Template Type');

        console.log(`✏️ Editing Document Type: ${docData.name}`);
        await filterAndSearch(page, 'Name', docData.name);
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Edit' }).click();

        console.log(`🔹 Updating Name to: ${updatedName}`);
        await page.getByRole('textbox', { name: 'Name' }).fill(updatedName);
        await page.getByRole('button', { name: 'Update' }).click();

        await expect(page.getByRole('alert')).toHaveText('Document Type updated successfully');
        console.log('✅ Document Type updated successfully');
    });

    // -----------------------
    // 05 - Delete Document Type
    // -----------------------
    test('05 - Delete Document Type', async ({ page }) => {
        console.log('🔹 Test Start: Delete Document Type');

        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToConfigSection(page);
        await goToModule(page, 'Document Type/ Template Type');

        console.log(`🔹 Filtering for deletion: ${docData.name}`);
        await filterAndSearch(page, 'Name', docData.name);
        await page.waitForTimeout(2000);

        console.log(`🗑 Deleting Document Type: ${docData.name}`);
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByRole('alert')).toHaveText('Document Type deleted successfully');
        console.log('✅ Document Type deleted successfully');
    });
});
