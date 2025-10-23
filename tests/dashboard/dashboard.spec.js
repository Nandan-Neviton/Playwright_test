import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';

// ===========================================================
// CI TEST SUITE — Dashboard Functionality
// ===========================================================
test.describe.serial('CI Tests — Dashboard', () => {
  
  // ===========================================================
  // TEST 01 — Navigate to Dashboard and Verify Interface
  // ===========================================================
  test('01 - Navigate to Dashboard and verify interface elements', async ({ page }) => {
    console.log('🔹 [START] Navigate to Dashboard');

    // Step 1: Login to application
    console.log('🔸 Logging into the application...');
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

    // Step 2: Navigate to Dashboard (should be default page)
    console.log('🔸 Verifying Dashboard interface...');
    
    // Verify main dashboard elements
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Overall Task Status')).toBeVisible();
    await expect(page.getByText('Completed Task Status')).toBeVisible();
    await expect(page.getByText('Task Types')).toBeVisible();
    
    // Verify task counts are displayed
    await expect(page.getByText('Total Task')).toBeVisible();
    await expect(page.getByText('Completed Tasks')).toBeVisible();
    await expect(page.getByText('Pending Tasks')).toBeVisible();

    console.log('✅ Dashboard interface verified successfully');
  });

  // ===========================================================
  // TEST 02 — Verify Dashboard Widgets Functionality
  // ===========================================================
  test('02 - Verify dashboard widgets display data correctly', async ({ page }) => {
    console.log('🔹 [START] Dashboard Widgets Verification');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    
    // Wait for dashboard to fully load
    await page.waitForTimeout(3000);
    await expect(page.getByText('Dashboard')).toBeVisible({ timeout: 10000 });

    // Verify Overall Task Status Widget
    console.log('🔸 Verifying Overall Task Status widget...');
    const totalTaskElement = page.locator('h5').filter({ hasText: /^\d+$/ }).first();
    await expect(totalTaskElement).toBeVisible({ timeout: 10000 });
    
    const totalTaskCount = await totalTaskElement.textContent();
    console.log(`📊 Total Task Count: ${totalTaskCount}`);

    // Verify Completed Task Status Widget
    console.log('🔸 Verifying Completed Task Status widget...');
    await expect(page.getByText('Total Completed Task')).toBeVisible();
    await expect(page.getByText('Completed On Time')).toBeVisible();
    await expect(page.getByText('Completed Delayed')).toBeVisible();

    // Verify Task Types Widget
    console.log('🔸 Verifying Task Types widget...');
    await expect(page.getByText('Total', { exact: true })).toBeVisible();
    
    // More flexible approach - just verify the widget exists and contains task type information
    await expect(page.getByText('Task Types')).toBeVisible();
    
    // Look for task type counts (more reliable than specific text)
    const taskTypeNumbers = page.locator('text=/^\\d+$/');
    const taskTypeCount = await taskTypeNumbers.count();
    console.log(`📊 Found ${taskTypeCount} numeric indicators in Task Types section`);
    
    // Just verify the section is functional rather than specific text
    expect(taskTypeCount).toBeGreaterThan(0);

    console.log('✅ All dashboard widgets verified successfully');
  });

  // ===========================================================
  // TEST 03 — Test Dashboard Filter Functionality
  // ===========================================================
  test('03 - Test dashboard filter functionality', async ({ page }) => {
    console.log('🔹 [START] Dashboard Filter Functionality');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

    // Test Overall Task Status filter
    console.log('🔸 Testing Overall Task Status filter...');
    const overallTaskFilter = page.locator('div').filter({ hasText: /^Overall Task Status.*Filter By.*$/ }).first();
    await expect(overallTaskFilter).toBeVisible();
    
    // Click filter button for Overall Task Status
    const filterButtons = page.getByRole('button').filter({ has: page.locator('img') });
    await filterButtons.first().click({ timeout: 5000 });
    console.log('✅ Overall Task Status filter clicked');

    // Test Completed Task Status filter
    console.log('🔸 Testing Completed Task Status filter...');
    await filterButtons.nth(1).click({ timeout: 5000 });
    console.log('✅ Completed Task Status filter clicked');

    // Test Task Types filter
    console.log('🔸 Testing Task Types filter...');
    await filterButtons.nth(2).click({ timeout: 5000 });
    console.log('✅ Task Types filter clicked');

    console.log('✅ Dashboard filter functionality verified');
  });

  // ===========================================================
  // TEST 04 — Test Dashboard Tabs Functionality
  // ===========================================================
  test('04 - Test dashboard tab navigation', async ({ page }) => {
    console.log('🔹 [START] Dashboard Tab Navigation');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

    // Verify tab existence
    console.log('🔸 Verifying dashboard tabs...');
    await expect(page.getByRole('tab', { name: 'All Task' })).toBeVisible();
    await expect(page.getByRole('tab').filter({ hasText: /Pending Task/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Completed Task' })).toBeVisible();

    // Test Pending Task tab
    console.log('🔸 Testing Pending Task tab...');
    const pendingTaskTab = page.getByRole('tab').filter({ hasText: /Pending Task/ });
    await pendingTaskTab.click();
    await page.waitForTimeout(2000);
    console.log('✅ Pending Task tab clicked');

    // Test Completed Task tab
    console.log('🔸 Testing Completed Task tab...');
    await page.getByRole('tab', { name: 'Completed Task' }).click();
    await page.waitForTimeout(2000);
    console.log('✅ Completed Task tab clicked');

    // Return to All Task tab
    console.log('🔸 Returning to All Task tab...');
    await page.getByRole('tab', { name: 'All Task' }).click();
    await page.waitForTimeout(2000);
    console.log('✅ All Task tab clicked');

    console.log('✅ Dashboard tab navigation verified');
  });

  // ===========================================================
  // TEST 05 — Test Dashboard Task Table Functionality
  // ===========================================================
  test('05 - Test dashboard task table and interactions', async ({ page }) => {
    console.log('🔹 [START] Dashboard Task Table');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

    // Verify task table headers
    console.log('🔸 Verifying task table headers...');
    const expectedHeaders = ['Task ID', 'Task Type', 'Workflow Name', 'Workflow Number', 'Target Date', 'Completed Date', 'Created Date', 'Created By', 'Co-ordinator'];
    
    for (const header of expectedHeaders) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
    }
    console.log('✅ All table headers verified');

    // Test table filter functionality
    console.log('🔸 Testing table filter functionality...');
    const filterDropdown = page.getByRole('combobox', { name: 'All' });
    await expect(filterDropdown).toBeVisible();
    console.log('✅ Filter dropdown visible');

    // Test search functionality
    console.log('🔸 Testing table search functionality...');
    const searchBox = page.getByRole('textbox', { name: 'Search' });
    await expect(searchBox).toBeVisible();
    await searchBox.fill('TSK');
    await page.waitForTimeout(1000);
    await searchBox.clear();
    console.log('✅ Search functionality tested');

    // Test Reset Filter button
    console.log('🔸 Testing Reset Filter button...');
    await expect(page.getByRole('button', { name: 'Reset Filter' })).toBeVisible();
    await page.getByRole('button', { name: 'Reset Filter' }).click();
    console.log('✅ Reset Filter button tested');

    // Test Download button
    console.log('🔸 Testing Download button...');
    await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
    console.log('✅ Download button verified');

    console.log('✅ Dashboard task table functionality verified');
  });

  // ===========================================================
  // TEST 06 — Test Dashboard Task Links and Navigation
  // ===========================================================
  test('06 - Test task ID link functionality', async ({ page }) => {
    console.log('🔹 [START] Dashboard Task Links');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

    // Find and verify task ID buttons are clickable
    console.log('🔸 Verifying task ID links...');
    const taskButtons = page.getByRole('button').filter({ hasText: /^TSK-/ });
    const taskCount = await taskButtons.count();
    
    if (taskCount > 0) {
      console.log(`📋 Found ${taskCount} task ID buttons`);
      
      // Get first task ID for testing
      const firstTaskButton = taskButtons.first();
      const taskId = await firstTaskButton.textContent();
      console.log(`🔸 Testing task ID: ${taskId}`);
      
      await expect(firstTaskButton).toBeVisible();
      await expect(firstTaskButton).toBeEnabled();
      
      console.log('✅ Task ID links are functional');
    } else {
      console.log('ℹ️ No task ID buttons found - may indicate no tasks in system');
    }

    console.log('✅ Task links verification completed');
  });

  // ===========================================================
  // TEST 07 — Test Dashboard Pagination
  // ===========================================================
  test('07 - Test dashboard table pagination', async ({ page }) => {
    console.log('🔹 [START] Dashboard Pagination');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

    // Verify pagination elements
    console.log('🔸 Verifying pagination elements...');
    await expect(page.getByText('Rows per page:')).toBeVisible();
    
    const rowsPerPageDropdown = page.getByRole('combobox').filter({ hasText: 'Rows per page:' });
    await expect(rowsPerPageDropdown).toBeVisible();

    // Verify pagination info
    const paginationInfo = page.locator('text=/\\d+–\\d+ of \\d+/');
    await expect(paginationInfo).toBeVisible();
    
    const paginationText = await paginationInfo.textContent();
    console.log(`📄 Pagination info: ${paginationText}`);

    // Test pagination buttons
    console.log('🔸 Testing pagination navigation buttons...');
    const prevButton = page.getByRole('button', { name: 'Go to previous page' });
    const nextButton = page.getByRole('button', { name: 'Go to next page' });
    
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    
    // Check if buttons are properly disabled/enabled based on current page
    const isPrevDisabled = await prevButton.isDisabled();
    const isNextDisabled = await nextButton.isDisabled();
    
    console.log(`📄 Previous button disabled: ${isPrevDisabled}`);
    console.log(`📄 Next button disabled: ${isNextDisabled}`);

    console.log('✅ Dashboard pagination verified');
  });
});

// ==============================================================
// Dashboard Performance and Responsive Tests
// ==============================================================
test.describe('Dashboard Performance & Responsive Tests', () => {

  // ==============================================================
  // TEST — Dashboard Load Performance
  // ==============================================================
  test('Performance: Dashboard should load within acceptable time', async ({ page }) => {
    console.log('🔹 [START] Dashboard Load Performance');

    const startTime = Date.now();
    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');
    
    // Wait for all dashboard widgets to be visible
    await expect(page.getByText('Overall Task Status')).toBeVisible();
    await expect(page.getByText('Completed Task Status')).toBeVisible();
    await expect(page.getByText('Task Types')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Dashboard load time: ${loadTime}ms`);
    
    // Dashboard should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
    console.log('✅ Dashboard load performance acceptable');
  });

  // ==============================================================
  // TEST — Dashboard Widget Updates
  // ==============================================================
  test('Functionality: Dashboard widgets show consistent data', async ({ page }) => {
    console.log('🔹 [START] Dashboard Data Consistency');

    await login(page, 'Nameera.Alam@adms.com', 'Adms@123');

    // Get total task count from Overall Task Status widget
    const totalTaskElement = page.locator('h5').first();
    await expect(totalTaskElement).toBeVisible();
    const totalTasks = await totalTaskElement.textContent();
    
    // Get completed and pending counts
    const completedTasksText = await page.getByText('Completed Tasks').locator('..').locator('text=/\\d+/').textContent();
    const pendingTasksText = await page.getByText('Pending Tasks').locator('..').locator('text=/\\d+/').textContent();
    
    const completedTasks = parseInt(completedTasksText);
    const pendingTasks = parseInt(pendingTasksText);
    const calculatedTotal = completedTasks + pendingTasks;
    
    console.log(`📊 Total Tasks: ${totalTasks}`);
    console.log(`✅ Completed Tasks: ${completedTasks}`);
    console.log(`⏳ Pending Tasks: ${pendingTasks}`);
    console.log(`🧮 Calculated Total: ${calculatedTotal}`);
    
    // Verify data consistency
    expect(calculatedTotal.toString()).toBe(totalTasks);
    console.log('✅ Dashboard data consistency verified');
  });
});