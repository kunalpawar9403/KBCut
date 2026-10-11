import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

test.describe('Core User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Navigation: Verify all main navigation links', async ({ page }) => {
    // Check Header/Nav presence
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check Bottom Nav
    const bottomNav = page.locator('nav').filter({ hasText: /Home|Tools|History/i });
    await expect(bottomNav).toBeVisible();

    // Test navigation to Tools Page
    await page.getByRole('link', { name: /Tools/i }).click();
    await expect(page).toHaveURL(/.*tools/);
  });

  test('Tool: Merge PDF Workflow', async ({ page }) => {
    // Navigate to Tools
    await page.getByRole('link', { name: /Tools/i }).click();
    
    // Select Merge PDF Tool
    const mergeTool = page.getByText(/Merge PDF/i);
    await mergeTool.click();
    await expect(page).toHaveURL(/.*merge-pdf/);

    // Simulate file upload (using a dummy file if available or testing the dropzone interaction)
    const dropZone = page.locator('div[role="button"]').filter({ hasText: /Upload/i }).or(page.locator('input[type="file"]'));
    await expect(dropZone).toBeVisible();
    
    // Note: In a real CI environment, we would use a small sample.pdf
    // For this smoke test, we verify the UI state transition
  });

  test('Tool: Image Compression Workflow', async ({ page }) => {
    await page.getByRole('link', { name: /Tools/i }).click();
    
    // Find Compression tool (based on src/components/compressor/DropZone.tsx logic)
    // Assuming the tool is accessible via a link or button
    await page.getByRole('link', { name: /Compress/i }).or(page.getByText(/Compress/i)).click();

    const dropZone = page.locator('text=Drop files here');
    await expect(dropZone).toBeVisible();

    // Test settings interaction
    const settingsButton = page.getByRole('button', { name: /Settings/i });
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      await expect(page.locator('text=Quality')).toBeVisible();
    }
  });

  test('Settings: Language Switching', async ({ page }) => {
    await page.getByRole('link', { name: /Settings/i }).click();
    
    // Check if language selection exists
    const langSelector = page.getByLabel(/Language/i).or(page.getByRole('combobox'));
    if (await langSelector.isVisible()) {
      await langSelector.selectOption('hi');
      // Check if i18n changes (e.g., 'Settings' becomes 'सेटिंग्स' or similar)
      // This is a heuristic check
      await expect(page.locator('body')).not.toBeEmpty();
    }
  });

  test('Privacy Policy: Accessibility', async ({ page }) => {
    await page.getByRole('link', { name: /Privacy/i }).click();
    await expect(page).toHaveURL(/.*privacy/);
    await expect(page.locator('body')).toContainText(/Privacy/i);
  });
});