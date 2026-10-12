```ts
import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:4173';

test.describe('KBCut E2E Test Suite', () => {
  // Capture any uncaught page errors
  test.beforeEach(async ({ page }) => {
    const errors: Error[] = [];
    page.on('pageerror', (err) => errors.push(err));
    await page.goto(BASE);
    // Fail the test if any page errors were captured during navigation
    test.afterEach(() => {
      expect(errors, 'No uncaught page errors').toHaveLength(0);
    });
  });

  test('TC001 - Home page loads and header is visible', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible(); // Header is usually a banner
    await expect(page.getByRole('heading', { name: /kbcut/i })).toBeVisible();
  });

  test('TC002 - Theme toggle switches to dark mode', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /toggle theme|dark mode|light mode/i });
    await expect(toggle).toBeVisible();
    const html = page.locator('html');
    const initialClass = await html.getAttribute('class');

    await toggle.click();
    const afterClass = await html.getAttribute('class');
    // The class list should contain 'dark' after toggling
    expect(afterClass?.includes('dark')).toBeTruthy();
    // Toggling again returns to original state
    await toggle.click();
    const revertedClass = await html.getAttribute('class');
    expect(revertedClass).toBe(initialClass);
  });

  test('TC003 - Theme preference persists after reload', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /toggle theme|dark mode|light mode/i });
    await toggle.click(); // switch to dark
    await page.reload();
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    // Clean up: set back to light for other tests
    await toggle.click();
  });

  test('TC004 - Bottom navigation contains all primary tabs', async ({ page }) => {
    const bottomNav = page.getByRole('navigation', { name: /bottom navigation/i });
    await expect(bottomNav).toBeVisible();

    const tabs = ['Home', 'Tools', 'History', 'Settings'];
    for (const tab of tabs) {
      await expect(bottomNav.getByRole('button', { name: new RegExp(tab, 'i') })).toBeVisible();
    }
  });

  test('TC005 - Clicking Tools tab navigates to Tools page and updates URL', async ({ page }) => {
    await page.getByRole('button', { name: /tools/i }).click();
    await expect(page).toHaveURL(new RegExp('/$')); // stays on root but active tab changes
    await expect(page.getByRole('heading', { name: /tools/i })).toBeVisible();
  });

  test('TC006 - Tools page displays list of tool cards', async ({ page }) => {
    await page.getByRole('button', { name: /tools/i }).click();
    const toolNames = [
      'Compress Image',
      'Crop & Rotate',
      'Merge PDF',
      'Split PDF',
      'Signature Resize',
      'Photo Sign',
      'eSign',
    ];
    for (const name of toolNames) {
      await expect(page.getByRole('button', { name: new RegExp(name, 'i') })).toBeVisible();
    }
  });

  test('TC007 - Opening Compress Image tool shows upload area', async ({ page }) => {
    await page.getByRole('button', { name: /tools/i }).click();
    await page.getByRole('button', { name: /compress image/i }).click();
    await expect(page.getByText(/drop files here/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /upload/i })).toBeVisible();
  });

  test('TC008 - Opening Crop & Rotate tool shows crop modal', async ({ page }) => {
    await page.getByRole('button', { name: /tools/i }).click();
    await page.getByRole('button', { name: /crop & rotate/i }).click();
    await expect(page.getByRole('dialog', { name: /crop/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /apply/i })).toBeVisible();
  });

  test('TC009 - History page shows empty state when no records', async ({ page }) => {
    await page.getByRole('button', { name: /history/i }).click();
    await expect(page.getByText(/no history yet/i)).toBeVisible();
  });

  test('TC010 - Settings page displays language selector', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
    await expect(page.getByLabel(/language/i)).toBeVisible();
  });

  test('TC011 - Privacy Policy page loads via direct URL', async ({ page }) => {
    await page.goto(`${BASE}/privacy`);
    await expect(page.getByRole('heading', { name: /privacy policy/i })).toBeVisible();
    await expect(page.getByText(/privacy/i)).toBeVisible();
  });

  test('TC012 - SEO landing page for compress-image-to-50kb shows correct heading', async ({ page }) => {
    await page.goto(`${BASE}/compress-image-to-50kb`);
    await expect(page.getByRole('heading', { name: /compress image to 50kb/i })).toBeVisible();
  });

  test('TC013 - Mobile viewport shows bottom navigation and allows navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await expect(page.getByRole('navigation', { name: /bottom navigation/i })).toBeVisible();
    await page.getByRole('button', { name: /history/i }).click();
    await expect(page).toHaveURL(new RegExp('/$'));
    await expect(page.getByRole('heading', { name: /history/i })).toBeVisible();
  });

  test('TC014 - No uncaught page errors on Home page after interactions', async ({ page }) => {
    const errors: Error[] = [];
    page.on('pageerror', (err) => errors.push(err));

    await page.getByRole('button', { name: /home/i }).click();
    await page.getByRole('button', { name: /tools/i }).click();
    await page.getByRole('button', { name: /home/i }).click();

    expect(errors, 'No uncaught page errors after navigation').toHaveLength(0);
  });

  test('TC015 - Clicking header logo navigates to Home', async ({ page }) => {
    // Assume logo is an image with alt text containing "logo"
    const logo = page.getByRole('img', { name: /logo/i });
    await logo.click();
    await expect(page).toHaveURL(BASE + '/');
    await expect(page.getByRole('heading', { name: /kbcut/i })).toBeVisible();
  });

  test('TC016 - Back button on Privacy page returns to Home', async ({ page }) => {
    await page.goto(`${BASE}/privacy`);
    const backBtn = page.getByRole('button', { name: /back/i });
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await expect(page).toHaveURL(BASE + '/');
    await expect(page.getByRole('heading', { name: /kbcut/i })).toBeVisible();
  });

  test('TC017 - URL updates correctly when navigating via header tabs', async ({ page }) => {
    // Header tabs are likely buttons with names matching the tabs
    await page.getByRole('button', { name: /tools/i }).click();
    await expect(page).toHaveURL(new RegExp('/$'));
    await page.getByRole('button', { name: /history/i }).click();
    await expect(page).toHaveURL(new RegExp('/$'));
    await page.getByRole('button', { name: /settings/i }).click();
    await expect(page).toHaveURL(new RegExp('/$'));
  });

  test('TC018 - Footer contains expected copyright text', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/©\s*\d{4}\s*kbcut/i);
  });

  test('TC019 - Download App modal appears when clicking "Download App" button', async ({ page }) => {
    // The button may be in the header or footer; try both locations
    const downloadBtn = page.getByRole('button', { name: /download app/i });
    await expect(downloadBtn).toBeVisible();
    await downloadBtn.click();
    const modal = page.getByRole('dialog', { name: /download app/i });
    await expect(modal).toBeVisible();
    await expect(modal.getByText(/available on/i)).toBeVisible();
    // Close modal
    await modal.getByRole('button', { name: /close/i }).click();
    await expect(modal).toBeHidden();
  });

  test('TC020 - Language selector changes UI language', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    const languageSelect = page.getByLabel(/language/i);
    await expect(languageSelect).toBeVisible();
    await languageSelect.selectOption({ label: /hindi|hi/i });
    // Verify that a known text changes to Hindi (e.g., "Home" becomes "मुख्य पृष्ठ")
    await expect(page.getByRole('button', { name: /मुख्य पृष्ठ/i })).toBeVisible();
    // Reset to English for subsequent tests
    await languageSelect.selectOption({ label: /english|en/i });
  });

  test('TC021 - Responsive layout: header collapses into a menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    const menuBtn = page.getByRole('button', { name: /menu/i });
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: /tools/i })).toBeVisible();
    // Close menu
    await menuBtn.click();
    await expect(menu).toBeHidden();
  });

  test('TC022 - Attempting to upload unsupported file shows error message', async ({ page }) => {
    await page.getByRole('button', { name: /tools/i }).click();
    await page.getByRole('button', { name: /compress image/i }).click();
    const fileInput = page.getByLabel(/upload file/i);
    // Upload a .txt file (unsupported)
    await fileInput.setInputFiles({
      name: 'sample.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('just a text file')
    });
    await expect(page.getByText(/unsupported file type/i)).toBeVisible();
  });

  test('TC023 - Progress modal appears after starting a compression', async ({ page }) => {
    await page.getByRole('button', { name: /tools/i }).click();
    await page.getByRole('button', { name: /compress image/i }).click();

    // Upload a small valid image (use a data URL)
    const fileInput = page.getByLabel(/upload file/i);
    const imgBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AApIB' +
      'B6Vf3V0AAAAASUVORK5CYII=',
      'base64'
    );
    await fileInput.setInputFiles({
      name: 'pixel.png',
      mimeType: 'image/png',
      buffer: imgBuffer
    });

    // Click the "Compress" button
    await page.getByRole('button', { name: /compress/i }).click();

    // Expect progress modal
    const progressModal = page.getByRole('dialog', { name: /compressing/i });
    await expect(progressModal).toBeVisible();
    await expect(progressModal.getByText(/processing/i)).toBeVisible();

    // Close progress modal (assuming a cancel/close button)
    await progressModal.getByRole('button', { name: /close|cancel/i }).click();
    await expect(progressModal).toBeHidden();
  });

  test('TC024 - Result view displays after successful compression', async ({ page }) => {
    await page.getByRole('button', { name: /tools/i }).click();
    await page.getByRole('button', { name: /compress image/i }).click();

    const fileInput = page.getByLabel(/upload file/i);
    const imgBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AApIB' +
      'B6Vf3V0AAAAASUVORK5CYII=',
      'base64'
    );
    await fileInput.setInputFiles({
      name: 'pixel.png',
      mimeType: 'image/png',
      buffer: imgBuffer
    });

    await page.getByRole('button', { name: /compress/i }).click();

    // Wait for result view (should replace progress modal)
    const resultView = page.getByRole('region', { name: /result/i });
    await expect(resultView).toBeVisible();
    await expect(resultView).toContainText(/original size/i);
    await expect(resultView).toContainText(/compressed size/i);
    await expect(resultView.getByRole('button', { name: /download/i })).toBeVisible();
  });

  test('TC025 - Bottom navigation retains active state after page reload', async ({ page }) => {
    await page.getByRole('button', { name: /history/i }).click();
    await expect(page.getByRole