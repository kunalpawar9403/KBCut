import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

test.describe('KBCut Core User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  });

  test('Navigation: Verify all main navigation links', async ({ page }) => {
    // Check Header presence
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check Navigation bar (scoped to avoid strict mode violations)
    const desktopNav = page.getByRole('navigation', { name: 'Main navigation' });
    const mobileNav = page.getByLabel('Mobile bottom navigation');

    if (await desktopNav.isVisible()) {
      await expect(desktopNav).toBeVisible();
    } else {
      await expect(mobileNav).toBeVisible();
    }

    // Navigate to Tools tab via header or bottom nav button
    const toolsBtn = page.locator('nav button, nav [role="button"]').filter({ hasText: /Tools/i }).first();
    await expect(toolsBtn).toBeVisible();
    await toolsBtn.click();

    // Verify Tools section loaded
    await expect(page.getByText(/Exam Utilities|All Tools/i).first()).toBeVisible();
  });

  test('Tool: Merge PDF functionality flow', async ({ page }) => {
    // Switch to Tools tab
    const toolsBtn = page.locator('nav button').filter({ hasText: /Tools/i }).first();
    if (await toolsBtn.isVisible()) {
      await toolsBtn.click();
    }

    // Click on the Merge PDF tool card
    const mergeCard = page.locator('div, button').filter({ hasText: /Merge/i }).first();
    await expect(mergeCard).toBeVisible();
    await mergeCard.click();

    // Verify tool opened
    await expect(page.getByText(/Back to All Tools|Merge.*PDF/i).first()).toBeVisible();
  });

  test('Tool: Image Compression flow', async ({ page }) => {
    // Ensure on Home tab where compressor lives
    const homeBtn = page.locator('nav button').filter({ hasText: /Home/i }).first();
    if (await homeBtn.isVisible()) {
      await homeBtn.click();
    }

    // Check compressor dropzone / upload trigger presence
    const dropZoneOrUpload = page.locator('text=/Select|Upload|Drop|Photo/i').first();
    await expect(dropZoneOrUpload).toBeVisible();
  });

  test('Settings: Language switching', async ({ page }) => {
    // Navigate to Settings tab
    const settingsBtn = page.locator('nav button').filter({ hasText: /Settings/i }).first();
    if (await settingsBtn.isVisible()) {
      await settingsBtn.click();
      
      // Verify language options in Settings page
      const langOption = page.locator('button').filter({ hasText: /English|मराठी/i }).first();
      await expect(langOption).toBeVisible();
    } else {
      // Fallback: verify header language dropdown
      const langSelect = page.locator('select[aria-label="Language"]');
      await expect(langSelect).toBeVisible();
    }
  });

  test('Privacy Policy: Accessibility', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const privacyBtn = page.locator('footer button').filter({ hasText: /Privacy Policy/i }).first();
    if (await privacyBtn.isVisible()) {
      await privacyBtn.click();
      await expect(page.getByText(/Privacy Policy/i).first()).toBeVisible();
    } else {
      await page.goto(BASE_URL + '/privacy');
      await expect(page.locator('body')).not.toBeEmpty();
    }
  });
});
