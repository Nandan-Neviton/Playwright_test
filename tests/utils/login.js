export async function login(page, baseUrl, username, password) {
    await page.goto(baseUrl);
    console.log(">>> Navigated to:", page.url());
  
    await page.getByRole('textbox', { name: /email/i }).fill(username);
    await page.getByRole('textbox', { name: /password/i }).fill(password);
    await page.getByRole('button', { name: /login/i }).click();
  
    await page.waitForURL(/dashboard|home/, { timeout: 15000 });
    console.log(">>> Logged in successfully:", await page.title());
  }
  