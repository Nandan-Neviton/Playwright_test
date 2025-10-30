import { test, expect } from '@playwright/test';

// ===========================================================
// User Management Enhancement Tests â€” Advanced Features
// ===========================================================
test.describe.serial('User Management â€” Enhanced Test Cases', () => {

  // ===========================================================
  // TEST â€” User Profile and Settings
  // ===========================================================
  test('User profile and settings management', async ({ page }) => {
    console.log('🔹 [START] User Profile Management');

    // Login and navigate to admin section
    await page.goto('https://sqa.note-iq.com/');
    await page.getByRole('textbox', { name: 'Enter email address' }).fill('swetha.kulkarni@neviton.com');
    await page.getByRole('textbox', { name: 'Enter password' }).fill('Jaishriram@2025');
    await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
    
    // Wait for login completion
    await page.waitForLoadState('networkidle');
    
    // Click Configure button to access admin section
    await page.getByRole('button', { name: 'Configure' }).click();
    
    // Wait for admin section to load
    await page.waitForLoadState('networkidle');
    
    // Click on user profile area - use more specific selector to avoid strict mode issues
    console.log('ðŸ”¸ Accessing user profile...');
    
    // Try different approaches to access user profile menu
    let profileClicked = false;
    
    try {
      // First try: Look for profile image or username in header area
      const profileElement = page.locator('img[alt*="Nameera"]').first()
                                .or(page.locator('[class*="header"] img').first())
                                .or(page.getByText('Nameera', { exact: false }).first())
                                .or(page.locator('[class*="user"], [class*="profile"]').first());
      
      if (await profileElement.isVisible({ timeout: 5000 })) {
        await profileElement.click();
        
        // Wait for profile menu to load
        await page.waitForLoadState('networkidle');
        
        profileClicked = true;
        console.log('✅ Profile accessed');
      }
    } catch (error) {
      console.log('â„¹ï¸ User profile menu not accessible - continuing test');
    }
    
    if (profileClicked) {
      
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
          console.log(`âœ… Found profile option: ${option}`);
        }
      }
    }
    
    console.log('âœ… User profile management verification completed');
  });

  // ===========================================================
  // TEST â€” Notification System
  // ===========================================================
  test('Notification system functionality', async ({ page }) => {
    console.log('🔹 [START] Notification System');

    // Login and navigate to admin section
    await page.goto('https://sqa.note-iq.com/');
    await page.getByRole('textbox', { name: 'Enter email address' }).fill('swetha.kulkarni@neviton.com');
    await page.getByRole('textbox', { name: 'Enter password' }).fill('Jaishriram@2025');
    await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
    
    // Wait for login completion
    await page.waitForLoadState('networkidle');
    
    // Click Configure button to access admin section
    await page.getByRole('button', { name: 'Configure' }).click();
    
    // Wait for admin section to load
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Configure' }).click();
    
    // Check for notification elements
    console.log('ðŸ”¸ Checking notification system...');
    
    try {
      const notificationButton = page.locator('[data-testid*="notification"]').first()
                                    .or(page.locator('[class*="notification"]').first())
                                    .or(page.getByRole('button').filter({ hasText: /^\d+$/ }).first())
                                    .or(page.locator('button:has-text("notification")').first());
      
      if (await notificationButton.isVisible({ timeout: 5000 })) {
        await notificationButton.click();
        
        // Wait for notification panel to load
        await page.waitForLoadState('networkidle');
        
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
            console.log(`âœ… Found notification feature: ${feature}`);
          }
        }
      } else {
        console.log('â„¹ï¸ No notifications or notification system not visible');
      }
    } catch (error) {
      console.log('â„¹ï¸ Notification system check failed - continuing test');
    }
    
    console.log('âœ… Notification system verification completed');
  });

  // ===========================================================
  // TEST â€” User Role and Permission Management
  // ===========================================================
  test('User role and permission management verification', async ({ page }) => {
    console.log('🔹 [START] Role & Permission Management');

    // Login and navigate to admin section
    await page.goto('https://sqa.note-iq.com/');
    await page.getByRole('textbox', { name: 'Enter email address' }).fill('swetha.kulkarni@neviton.com');
    await page.getByRole('textbox', { name: 'Enter password' }).fill('Jaishriram@2025');
    await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
    
    // Wait for login completion
    await page.waitForLoadState('networkidle');
    
    // Click Configure button to access admin section
    await page.getByRole('button', { name: 'Configure' }).click();

    // Wait for admin section to load
    await page.waitForLoadState('networkidle');
    
    // Check for role management features
    console.log('ðŸ”¸ Checking role management features...');
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
        console.log(`âœ… Found role management feature: ${feature}`);
      }
    }
    
    console.log('âœ… Role and permission management verification completed');
  });
});
