import { test } from 'allure-playwright';
import { goToModule } from '../utils/commonActions';
import { login } from '../utils/login';

test('should create a new department successfully', async ({ page }) => {
        await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
        await goToAdminSection(page);
        await goToModule(page, 'Department');
        await page.pause()
        await page.getByRole('link', { name: 'Site' }).click();
        await page.getByRole('tab', { name: 'New Site' }).click();
        await page.getByRole('textbox', { name: 'Enter Site Name' }).click();
        await page.getByRole('textbox', { name: 'Enter Site Name' }).fill('test');
})