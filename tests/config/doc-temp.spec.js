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
// Test Suite: Workflow Types
// =======================
test.describe.serial('CI Tests — Admin: Workflow Types', () => {
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
    };

    const updatedName = faker.commerce.department().slice(0, 4);

    // -----------------------
    // 01 - Create
    // -----------------------
    test('01 - Create Workflow Type', async ({ page }) => {
        console.log('🚀 [START] Creating new Workflow Type');

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

        await page.pause()
    })
})