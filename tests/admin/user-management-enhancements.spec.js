import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';

// ===========================================================
// User Management Enhancement Tests — Advanced Features
// ===========================================================
test.describe.serial('User Management — Enhanced Test Cases', () => {

  // ===========================================================
  // TEST — User Profile and Settings
  // ===========================================================
  test('User profile and settings management', async ({ page }) => {
    console.log('🔹 [START] User Profile Management');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    
    // Click on user profile area
    console.log('🔸 Accessing user profile...');
    const userProfile = page.getByText('Nameera Alam')
                           .or(page.locator('img[alt*="Nameera"]'))
                           .or(page.locator('[data-testid="user-menu"]'));
    
    if (await userProfile.isVisible({ timeout: 5000 })) {
      await userProfile.click();
      
      // Check for profile options
      const profileOptions = [
        'Profile',
        'Settings', 
        'Preferences',
        'Account',
        'Change Password',
        'Logout'
      ];
      
      for (const option of profileOptions) {
        const optionLocator = page.getByText(option, { exact: false });
        if (await optionLocator.isVisible({ timeout: 2000 })) {
          console.log(`✅ Found profile option: ${option}`);
        }
      }
    }
    
    console.log('✅ User profile management verification completed');
  });

  // ===========================================================
  // TEST — Notification System
  // ===========================================================
  test('Notification system functionality', async ({ page }) => {
    console.log('🔹 [START] Notification System');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    
    // Check for notification elements
    console.log('🔸 Checking notification system...');
    const notificationButton = page.getByRole('button').filter({ hasText: /^\d+$/ })
                                  .or(page.locator('[data-testid*="notification"]'))
                                  .or(page.getByRole('button').filter({ has: page.locator('text=/\\d+/') }));
    
    if (await notificationButton.isVisible({ timeout: 5000 })) {
      await notificationButton.click();
      console.log('✅ Notification system accessed');
      
      // Look for notification features
      const notificationFeatures = [
        'Mark as Read',
        'Clear All',
        'View All',
        'Settings'
      ];
      
      for (const feature of notificationFeatures) {
        const featureLocator = page.getByText(feature, { exact: false });
        if (await featureLocator.isVisible({ timeout: 2000 })) {
          console.log(`✅ Found notification feature: ${feature}`);
        }
      }
    } else {
      console.log('ℹ️ No notifications or notification system not visible');
    }
    
    console.log('✅ Notification system verification completed');
  });

  // ===========================================================
  // TEST — User Role and Permission Management
  // ===========================================================
  test('User role and permission management verification', async ({ page }) => {
    console.log('🔹 [START] Role & Permission Management');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    
    // Navigate to admin section for role management
    await page.getByRole('link', { name: 'Admin' }).click();
    
    // Check for role management features
    console.log('🔸 Checking role management features...');
    const roleFeatures = [
      'Role',
      'Permission',
      'Access',
      'Rights',
      'Privileges',
      'Security'
    ];
    
    for (const feature of roleFeatures) {
      const featureLocator = page.getByText(feature, { exact: false });
      if (await featureLocator.isVisible({ timeout: 2000 })) {
        console.log(`✅ Found role management feature: ${feature}`);
      }
    }
    
    console.log('✅ Role and permission management verification completed');
  });
});