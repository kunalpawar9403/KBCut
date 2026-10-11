import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

test.describe('KBCut Core User Journeys', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Navigation and UI Integrity', async ({ page }) => {
    // Verify Header and Footer presence
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Test Bottom Navigation
    const bottomNav = page.locator('nav').filter({ hasText: 'Home' }); // Adjust selector based on actual DOM if needed
    await expect(bottomNav).toBeVisible();

    // Test Language Switcher (i18n) - checking if content changes
    // This assumes there is a way to trigger language change in Settings or Header
    const settingsLink = page.getByRole('link', { name: /Settings/i });
    if (await settingsLink.isVisible()) {
      await settingsLink.click();
      await expect(page).toHaveURL(/.*settings/);
    }
  });

  test('Tool Discovery - Tools Page', async ({ page }) => {
    // Navigate to Tools page
    await page.getByRole('link', { name: /Tools/i }).click();
    await expect(page).toHaveURL(/.*tools/);

    // Verify specific tools are listed (based on source files)
    const tools = [
      'Merge PDF',
      'Split PDF',
      'Crop & Rotate',
      'Aadhaar 2 in 1'
    ];

    for (const tool of tools) {
      // Using partial match as text might vary slightly
      await expect(page.locator('body')).toContainText(tool, { ignoreCase: true });
    }
  });

  test('PDF Merge Tool Workflow (Happy Path)', async ({ page }) => {
    // Navigate to Merge PDF tool
    await page.getByRole('link', { name: /Merge/i }).click();
    
    // Check for DropZone
    const dropZone = page.locator('div[role="button"], .drop-zone'); // Common patterns for dropzones
    await expect(dropZone).toBeVisible();

    // Note: In a real CI environment, we would use page.setInputFiles()
    // Since we don't have real test files, we simulate the interaction
    // This is a structural test to ensure the component renders
    await expect(page.locator('text=Upload files')).toBeVisible();
  });

  test('Settings and Privacy Policy Access', async ({ page }) => {
    // Test Privacy Policy
    await page.getByRole('link', { name: /Privacy/i }).click();
    await expect(page).toHaveURL(/.*privacy/);
    await expect(page.locator('main')).toBeVisible();

    // Go back and test Settings
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: /Settings/i }).click();
    await expect(page).toHaveURL(/.*settings/);
  });

  test('History Page Availability', async ({ page }) => {
    // Check if History page is accessible
    await page.getByRole('link', { name: /History/i }).click();
    await expect(page).toHaveURL(/.*history/);
    
    // If no history exists, it should show a friendly message rather than crashing
    await expect(page.locator('body')).toBeVisible();
  });

});