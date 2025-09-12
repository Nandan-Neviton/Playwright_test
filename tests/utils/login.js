import { test , expect } from '@playwright/test';

// central login function
// export async function login(page, email, password) {
//   await page.goto('https://uat.note-iq.com/');
//   await page.getByRole('textbox', { name: 'Enter email address' }).fill(email);
//   await page.getByRole('textbox', { name: 'Enter password' }).fill(password);
//   await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
//   await page.waitForURL('https://uat.note-iq.com/dashboard');
// }

// // Example test
// test('user login', async ({ page }) => {
//   await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
//   await expect(page).toHaveURL('https://uat.note-iq.com/dashboard');
// });


export async function login(page, email, password) {
  await page.goto('https://uat.note-iq.com/');
  await page.getByRole('textbox', { name: 'Enter email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Enter password' }).fill(password);
  await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
  await page.waitForURL('https://uat.note-iq.com/dashboard');
}