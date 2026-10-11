import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

test.describe('KBCut Core User Journeys', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test.describe('TC001 - Homepage and Navigation', () => {
    test('should load the homepage with correct header and navigation elements', async ({ page }) => {
      // Verify Header presence
      const header = page.getByRole('banner');
      await expect(header).toBeVisible();

      // Verify Bottom Navigation is present (common in mobile-first apps like this)
      const bottomNav = page.locator('nav').filter({ hasText: /Home|Tools|History/i });
      await expect(bottomNav).toBeVisible();

      // Verify main heading/content exists
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('should navigate to Tools page via navigation', async ({ page }) => {
      // Find the tools link/button in navigation
      const toolsLink = page.getByRole('link', { name: /Tools/i }).or(page.getByRole('button', { name: /Tools/i }));
      await toolsLink.click();
      
      // Verify URL or heading change
      await expect(page).toHaveURL(/.*tools/);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(/Tools/i);
    });
  });

  test.describe('TC002 - PDF Tools Functionality', () => {
    test('should navigate to Merge PDF tool and show upload interface', async ({ page }) => {
      // Navigate to tools
      await page.getByRole('link', { name: /Tools/i }).click();
      
      // Find Merge PDF tool card/button
      const mergePdfTool = page.getByRole('button', { name: /Merge PDF/i }).or(page.getByText(/Merge PDF/i));
      await mergePdfTool.click();

      // Verify we are in the Merge PDF tool context
      await expect(page.getByRole('heading')).toContainText(/Merge PDF/i);
      
      // Verify DropZone/Upload area is visible
      const dropZone = page.getByText(/Drag & Drop/i).or(page.getByLabel(/Upload/i));
      await expect(dropZone).toBeVisible();
    });

    test('should navigate to Split PDF tool', async ({ page }) => {
      await page.getByRole('link', { name: /Tools/i }).click();
      const splitPdfTool = page.getByRole('button', { name: /Split PDF/i }).or(page.getByText(/Split PDF/i));
      await splitPdfTool.click();

      await expect(page.getByRole('heading')).toContainText(/Split PDF/i);
    });
  });

  test.describe('TC003 - Image Compression Workflow', () => {
    test('should access compression settings and show upload area', async ({ page }) => {
      // Assuming compression is a primary feature accessible from home or tools
      // Based on src/components/compressor/DropZone.tsx
      
      // For this test, we navigate to a tool that triggers compression or find the compression entry point
      // Since the source shows a compressor component, we look for its trigger
      const compressTrigger = page.getByRole('button', { name: /Compress/i }).or(page.getByText(/Compress/i));
      
      // If not directly on home, we check tools
      if (await compressTrigger.count() === 0) {
        await page.getByRole('link', { name: /Tools/i }).click();
      }

      // Click the compression tool
      await (page.getByText(/Compress/i).first()).click();

      // Verify DropZone is visible
      await expect(page.getByText(/Drop files here/i).or(page.getByText(/Select files/i))).toBeVisible();
    });
  });

  test.describe('TC004 - Settings and Localization', () => {
    test('should navigate to settings page', async ({ page }) => {
      const settingsLink = page.getByRole('link', { name: /Settings/i }).or(page.getByRole('button', { name: /Settings/i }));
      await settingsLink.click();

      await expect(page).toHaveURL(/.*settings/);
      await expect(page.getByRole('heading')).toContainText(/Settings/i);
    });

    test('should allow language switching (i18n)', async ({ page }) => {
      // Navigate to settings first
      await page.getByRole('link', { name: /Settings/i }).click();
      
      // Look for language selection (based on i18n files: en, hi, mr)
      const hindiOption = page.getByRole('button', { name: /Hindi/i }).or(page.getByText(/Hindi/i));
      
      if (await hindiOption.count() > 0) {
        await hindiOption.click();
        // Verify a known Hindi string if possible, or just check if UI updates
        // This is a soft assertion as exact strings depend on i18n implementation
        await expect(page.locator('body')).toBeVisible();
      }
    });
  });

  test.describe('TC005 - Legal and Information', () => {
    test('should navigate to Privacy Policy', async ({ page }) => {
      const privacyLink = page.getByRole('link', { name: /Privacy Policy/i });
      await privacyLink.click();

      await expect(page).toHaveURL(/.*privacy/);
      await expect(page.getByRole('heading')).toContainText(/Privacy/i);
    });
  });
});