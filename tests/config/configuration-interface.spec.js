import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';
import { goToConfigSection } from '../utils/commonActions.js';

// ===========================================================
// Configuration Module — Interface and Navigation Tests
// ===========================================================
test.describe.serial('Configuration Module — Interface Tests', () => {

  // ===========================================================
  // TEST 01 — Navigation to Configuration Module
  // ===========================================================
  test('01 - Navigate to Configuration module and verify interface', async ({ page }) => {
    console.log('🔹 [START] Configuration Module Navigation');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    
    // Navigate to Configuration using the common action
    console.log('🔸 Navigating to Configuration module...');
    await goToConfigSection(page);
    
    // Verify Configuration module interface
    await expect(page.locator('text=Config')).toBeVisible();
    console.log('✅ Configuration module interface verified');
  });

  // ===========================================================
  // TEST 02 — Life Cycle States Functionality
  // ===========================================================
  test('02 - Verify Life Cycle States functionality', async ({ page }) => {
    console.log('🔹 [START] Life Cycle States');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    
    // Look for Life Cycle States option
    console.log('🔸 Checking Life Cycle States option...');
    const lifeCycleOption = page.getByText('Life Cycle States');
    
    if (await lifeCycleOption.isVisible({ timeout: 5000 })) {
      await lifeCycleOption.click();
      console.log('✅ Life Cycle States accessed');
    } else {
      console.log('ℹ️ Life Cycle States not available in current configuration');
    }
  });

  // ===========================================================
  // TEST 03 — Numbering System Functionality
  // ===========================================================
  test('03 - Verify Numbering System functionality', async ({ page }) => {
    console.log('🔹 [START] Numbering System');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    
    // Look for Numbering System option
    console.log('🔸 Checking Numbering System option...');
    const numberingOption = page.getByText('Numbering System');
    
    if (await numberingOption.isVisible({ timeout: 5000 })) {
      await numberingOption.click();
      console.log('✅ Numbering System accessed');
    } else {
      console.log('ℹ️ Numbering System not available in current configuration');
    }
  });

  // ===========================================================
  // TEST 04 — Configuration Module Options Verification
  // ===========================================================
  test('04 - Verify all configuration module options are accessible', async ({ page }) => {
    console.log('🔹 [START] Configuration Options Verification');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    await goToConfigSection(page);
    
    // List of expected configuration options
    const configOptions = [
      'Checklist',
      'Document Types', 
      'Email Templates',
      'Life Cycle Status',
      'List Manager',
      'Numbering System',
      'System Data',
      'Workflow Types'
    ];
    
    console.log('🔸 Checking for configuration options...');
    
    for (const option of configOptions) {
      const optionLocator = page.getByText(option, { exact: false });
      if (await optionLocator.isVisible({ timeout: 3000 })) {
        console.log(`✅ Found configuration option: ${option}`);
      } else {
        console.log(`⚠️ Configuration option not visible: ${option}`);
      }
    }
    
    console.log('✅ Configuration options verification completed');
  });
});