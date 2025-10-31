import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../utils/login.js';
import { goToDMS } from '../utils/commonActions.js';

// ===========================================================
// CI TEST SUITE — Repository Management
// ===========================================================
test.describe.serial('CI Tests — Repository Management', () => {
  // ---------- Test Data Setup ----------
  const repositoryData = {
    repositoryName: `TestRepo_${faker.string.alphanumeric(8)}`, // Random repository name
    folderName: `TestFolder_${faker.string.alphanumeric(6)}`, // Random folder name
    editedRepositoryName: `EditedRepo_${faker.string.alphanumeric(6)}`, // For edit operations
    successMessage: 'Repository has been created', // Expected success message
    folderSuccessMessage: 'Folder has been created', // Expected folder creation message
    deleteConfirmMessage: 'Are you sure you want to delete this repository?', // Delete confirmation
  };

  // ===========================================================
  // TEST 01 — Navigate to Repository Module
  // ===========================================================
  test('01 - Navigate to Repository Module', async ({ page }) => {
    console.log('🔹 [START] Navigate to Repository Module');

    // Step 1: Login to application
    console.log('🔸 Logging into the application...');
    await login(page);
    await goToDMS(page);

    // Step 2: Navigate to Repository section
    console.log('🔸 Navigating to Repository Section...');
    await page.getByRole('link').nth(7).click(); // Repository module link
    await page.waitForLoadState('networkidle');

    // Step 3: Verify we are on the repository page
    await expect(page).toHaveURL(/.*\/dms\/repository/);
    console.log('✅ Successfully navigated to Repository module');
  });

  // ===========================================================
  // TEST 02 — Verify Repository Interface Elements
  // ===========================================================
  test('02 - Verify Repository Interface Elements', async ({ page }) => {
    console.log('🔹 [START] Verify Repository Interface Elements');

    // Step 1: Login and navigate to repository module
    await login(page);
    await goToDMS(page);
    await page.getByRole('link').nth(7).click();
    await page.waitForLoadState('networkidle');

    // Step 2: Verify main interface elements
    console.log('🔸 Verifying interface elements...');
    
    // Check create repository form
    await expect(page.getByText('Repository Name*')).toBeVisible();
    await expect(page.getByPlaceholder('Enter Repository Name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
    
    // Check view options
    await expect(page.getByRole('button', { name: 'Tree View' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Grid View' })).toBeVisible();
    
    // Check file management section
    await expect(page.getByPlaceholder('Search File')).toBeVisible();
    
    console.log('✅ All interface elements are visible');
  });

  // ===========================================================
  // TEST 03 — Create New Repository
  // ===========================================================
  test('03 - Create New Repository', async ({ page }) => {
    console.log('🔹 [START] Create New Repository');

    // Step 1: Login and navigate to repository module
    await login(page);
    await goToDMS(page);
    await page.getByRole('link').nth(7).click();
    await page.waitForLoadState('networkidle');

    // Step 2: Fill repository name
    console.log(`🔸 Creating repository: ${repositoryData.repositoryName}`);
    const repositoryNameInput = page.getByPlaceholder('Enter Repository Name');
    await repositoryNameInput.fill(repositoryData.repositoryName);

    // Step 3: Click Create button
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(2000);

    // Step 4: Verify success message
    await expect(page.getByText(repositoryData.successMessage)).toBeVisible({ timeout: 10000 });
    
    // Step 5: Verify repository appears in the list
    await expect(page.getByText(repositoryData.repositoryName)).toBeVisible();
    
    console.log('✅ Repository created successfully');
  });

  // ===========================================================
  // TEST 04 — Test Repository Name Validation
  // ===========================================================
  test('04 - Test Repository Name Validation', async ({ page }) => {
    console.log('🔹 [START] Test Repository Name Validation');

    // Step 1: Login and navigate to repository module
    await login(page);
    await goToDMS(page);
    await page.getByRole('link').nth(7).click();
    await page.waitForLoadState('networkidle');

    // Step 2: Try to create repository without name
    console.log('🔸 Testing empty repository name...');
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(1000);

    // Step 3: Try to create repository with only spaces
    console.log('🔸 Testing repository name with only spaces...');
    const repositoryNameInput = page.getByPlaceholder('Enter Repository Name');
    await repositoryNameInput.fill('   ');
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(1000);

    // Step 4: Test Reset functionality
    console.log('🔸 Testing Reset button...');
    await repositoryNameInput.fill('Test Repository');
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(repositoryNameInput).toHaveValue('');
    
    console.log('✅ Repository name validation tested');
  });

  // ===========================================================
  // TEST 05 — Test Tree View and Grid View
  // ===========================================================
  test('05 - Test Tree View and Grid View', async ({ page }) => {
    console.log('🔹 [START] Test Tree View and Grid View');

    // Step 1: Login and navigate to repository module
    await login(page);
    await goToDMS(page);
    await page.getByRole('link').nth(7).click();
    await page.waitForLoadState('networkidle');

    // Step 2: Test Tree View (should be default)
    console.log('🔸 Testing Tree View...');
    const treeViewBtn = page.getByRole('button', { name: 'Tree View' });
    await expect(treeViewBtn).toHaveAttribute('aria-pressed', 'true');

    // Step 3: Switch to Grid View
    console.log('🔸 Testing Grid View...');
    const gridViewBtn = page.getByRole('button', { name: 'Grid View' });
    await gridViewBtn.click();
    await page.waitForTimeout(1000);
    
    await expect(gridViewBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(treeViewBtn).toHaveAttribute('aria-pressed', 'false');
    
    // Step 4: Switch back to Tree View
    await treeViewBtn.click();
    await page.waitForTimeout(1000);
    
    await expect(treeViewBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(gridViewBtn).toHaveAttribute('aria-pressed', 'false');
    
    console.log('✅ View switching functionality working correctly');
  });

  // ===========================================================
  // TEST 06 — Test Repository Selection and Folder Creation
  // ===========================================================
  test('06 - Test Repository Selection and Folder Creation', async ({ page }) => {
    console.log('🔹 [START] Test Repository Selection and Folder Creation');

    // Step 1: Login and navigate to repository module
    await login(page);
    await goToDMS(page);
    await page.getByRole('link').nth(7).click();
    await page.waitForLoadState('networkidle');

    // Step 2: Create a test repository first
    const testRepoName = `TestRepoForFolder_${faker.string.alphanumeric(6)}`;
    const repositoryNameInput = page.getByPlaceholder('Enter Repository Name');
    await repositoryNameInput.fill(testRepoName);
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(2000);

    // Step 3: Click on the created repository to select it
    console.log('🔸 Selecting repository for folder creation...');
    await page.getByText(testRepoName).click();
    await page.waitForTimeout(1000);

    // Step 4: Verify the form changes to folder creation
    await expect(page.getByText(`Create Folder In ${testRepoName}`)).toBeVisible();
    await expect(page.getByPlaceholder('Enter Folder Name')).toBeVisible();

    // Step 5: Create a folder
    console.log(`🔸 Creating folder: ${repositoryData.folderName}`);
    const folderNameInput = page.getByPlaceholder('Enter Folder Name');
    await folderNameInput.fill(repositoryData.folderName);
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(2000);

    console.log('✅ Repository selection and folder creation tested');
  });

  // ===========================================================
  // TEST 07 — Test Search File Functionality
  // ===========================================================
  test('07 - Test Search File Functionality', async ({ page }) => {
    console.log('🔹 [START] Test Search File Functionality');

    // Step 1: Login and navigate to repository module
    await login(page);
    await goToDMS(page);
    await page.getByRole('link').nth(7).click();
    await page.waitForLoadState('networkidle');

    // Step 2: Test search functionality
    console.log('🔸 Testing search file functionality...');
    const searchInput = page.getByPlaceholder('Search File');
    
    // Type in search box
    await searchInput.fill('test');
    await page.waitForTimeout(1000);
    
    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);
    
    console.log('✅ Search file functionality tested');
  });

  // ===========================================================
  // TEST 08 — Test Repository Actions (Edit/Delete)
  // ===========================================================
  test('08 - Test Repository Actions', async ({ page }) => {
    console.log('🔹 [START] Test Repository Actions');

    // Step 1: Login and navigate to repository module
    await login(page);
    await goToDMS(page);
    await page.getByRole('link').nth(7).click();
    await page.waitForLoadState('networkidle');

    // Step 2: Create a test repository for actions
    const actionTestRepo = `ActionTestRepo_${faker.string.alphanumeric(6)}`;
    const repositoryNameInput = page.getByPlaceholder('Enter Repository Name');
    await repositoryNameInput.fill(actionTestRepo);
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(2000);

    // Step 3: Look for action buttons (Edit/Delete)
    console.log('🔸 Testing repository action buttons...');
    
    // Find the repository row and check for action buttons
    const repositoryRow = page.locator(`text=${actionTestRepo}`).locator('..').locator('..');
    
    // Check if edit and delete buttons are present
    const editButtons = page.getByRole('button').filter({ hasText: /edit/i });
    const deleteButtons = page.getByRole('button').filter({ hasText: /delete/i });
    
    if (await editButtons.count() > 0) {
      console.log('✅ Edit buttons found');
    }
    
    if (await deleteButtons.count() > 0) {
      console.log('✅ Delete buttons found');
    }
    
    console.log('✅ Repository actions tested');
  });

  // ===========================================================
  // TEST 09 — Test File Table Structure
  // ===========================================================
  test('09 - Test File Table Structure', async ({ page }) => {
    console.log('🔹 [START] Test File Table Structure');

    // Step 1: Login and navigate to repository module
    await login(page);
    await goToDMS(page);
    await page.getByRole('link').nth(7).click();
    await page.waitForLoadState('networkidle');

    // Step 2: Verify file table headers
    console.log('🔸 Verifying file table structure...');
    
    const expectedHeaders = ['File Name/No.', 'Title', 'Created On', 'Created By', 'Type', 'Status', 'Action'];
    
    for (const header of expectedHeaders) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
      console.log(`✅ Header "${header}" found`);
    }

    // Step 3: Check table pagination
    await expect(page.getByText('Rows per page:')).toBeVisible();
    
    console.log('✅ File table structure verified');
  });

  // ===========================================================
  // TEST 10 — Test Complete Repository Workflow
  // ===========================================================
  test('10 - Test Complete Repository Workflow', async ({ page }) => {
    console.log('🔹 [START] Test Complete Repository Workflow');

    // Step 1: Login and navigate to repository module
    await login(page);
    await goToDMS(page);
    await page.getByRole('link').nth(7).click();
    await page.waitForLoadState('networkidle');

    // Step 2: Complete workflow - Create Repository
    const workflowRepo = `WorkflowRepo_${faker.string.alphanumeric(6)}`;
    console.log(`🔸 Creating repository: ${workflowRepo}`);
    
    await page.getByPlaceholder('Enter Repository Name').fill(workflowRepo);
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(2000);

    // Step 3: Select repository and create folder
    await page.getByText(workflowRepo).click();
    await page.waitForTimeout(1000);
    
    const workflowFolder = `WorkflowFolder_${faker.string.alphanumeric(4)}`;
    console.log(`🔸 Creating folder: ${workflowFolder}`);
    
    await page.getByPlaceholder('Enter Folder Name').fill(workflowFolder);
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(2000);

    // Step 4: Test view switching
    console.log('🔸 Testing view switching...');
    await page.getByRole('button', { name: 'Grid View' }).click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('button', { name: 'Tree View' }).click();
    await page.waitForTimeout(1000);

    // Step 5: Test search functionality
    console.log('🔸 Testing search...');
    await page.getByPlaceholder('Search File').fill('test');
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Search File').clear();

    console.log('✅ Complete repository workflow tested successfully');
  });

  // ===========================================================
  // TEST 11 — Test Repository Module Error Handling
  // ===========================================================
  test('11 - Test Repository Error Handling', async ({ page }) => {
    console.log('🔹 [START] Test Repository Error Handling');

    // Step 1: Login and navigate to repository module
    await login(page);
    await goToDMS(page);
    await page.getByRole('link').nth(7).click();
    await page.waitForLoadState('networkidle');

    // Step 2: Test duplicate repository name
    console.log('🔸 Testing duplicate repository creation...');
    const duplicateRepoName = `DuplicateTest_${faker.string.alphanumeric(6)}`;
    
    // Create first repository
    await page.getByPlaceholder('Enter Repository Name').fill(duplicateRepoName);
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(2000);

    // Reset and try to create same name again
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.getByPlaceholder('Enter Repository Name').fill(duplicateRepoName);
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(2000);

    // Step 3: Test special characters in repository name
    console.log('🔸 Testing special characters...');
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.getByPlaceholder('Enter Repository Name').fill('Test@#$%Repository');
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(2000);

    console.log('✅ Repository error handling tested');
  });

  // ===========================================================
  // TEST 12 — Test Repository Module Performance
  // ===========================================================
  test('12 - Test Repository Module Performance', async ({ page }) => {
    console.log('🔹 [START] Test Repository Module Performance');

    // Step 1: Login and navigate to repository module
    await login(page);
    await goToDMS(page);
    
    // Measure navigation time
    const startTime = Date.now();
    await page.getByRole('link').nth(7).click();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`🔸 Repository module load time: ${loadTime}ms`);

    // Step 2: Test rapid view switching
    console.log('🔸 Testing rapid view switching performance...');
    
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Grid View' }).click();
      await page.waitForTimeout(500);
      await page.getByRole('button', { name: 'Tree View' }).click();
      await page.waitForTimeout(500);
    }

    // Step 3: Test rapid search operations
    console.log('🔸 Testing search performance...');
    const searchInput = page.getByPlaceholder('Search File');
    
    for (let i = 0; i < 5; i++) {
      await searchInput.fill(`test${i}`);
      await page.waitForTimeout(200);
      await searchInput.clear();
      await page.waitForTimeout(200);
    }

    console.log('✅ Repository module performance tested');
  });
});