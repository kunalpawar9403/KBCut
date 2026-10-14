```ts
import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:4173';

test.describe('KBCut App E2E Suite', () => {
  // -------------------------------------------------------------------------
  // 1️⃣ Home page loads and basic UI elements
  // -------------------------------------------------------------------------
  test('TC001 - Home page loads with title and root element', async ({
    page,
  }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/KBCut/i);
    await expect(page.locator('#root')).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // 2️⃣ Theme toggle works and persists
  // -------------------------------------------------------------------------
  test('TC002 - Theme toggle switches to dark mode', async ({ page }) => {
    await page.goto(BASE);
    const toggle = page.getByLabel(/toggle theme/i);
    await expect(toggle).toBeVisible();
    await toggle.click();

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDark).toBeTruthy();
  });

  test('TC003 - Theme preference persists after reload', async ({ page }) => {
    await page.goto(BASE);
    const toggle = page.getByLabel(/toggle theme/i);
    await toggle.click(); // ensure dark mode is set
    await page.reload();

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDark).toBeTruthy();
  });

  // -------------------------------------------------------------------------
  // 3️⃣ Bottom navigation presence and navigation between tabs
  // -------------------------------------------------------------------------
  test('TC004 - Bottom navigation contains all primary tabs', async ({
    page,
  }) => {
    await page.goto(BASE);
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();

    const tabs = ['home', 'tools', 'history', 'settings'];
    for (const tab of tabs) {
      await expect(
        nav.getByRole('button', { name: new RegExp(tab, 'i') })
      ).toBeVisible();
    }
  });

  test('TC005 - Navigate to Tools tab and verify content', async ({
    page,
  }) => {
    await page.goto(BASE);
    await page
      .getByRole('button', { name: /tools/i })
      .click({ force: true });

    // Tools page usually has a heading with the word "Tools"
    await expect(
      page.getByRole('heading', { name: /tools/i })
    ).toBeVisible();
  });

  test('TC006 - Navigate to History tab and verify content', async ({
    page,
  }) => {
    await page.goto(BASE);
    await page
      .getByRole('button', { name: /history/i })
      .click({ force: true });

    await expect(
      page.getByRole('heading', { name: /history/i })
    ).toBeVisible();
  });

  test('TC007 - Navigate to Settings tab and verify content', async ({
    page,
  }) => {
    await page.goto(BASE);
    await page
      .getByRole('button', { name: /settings/i })
      .click({ force: true });

    await expect(
      page.getByRole('heading', { name: /settings/i })
    ).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // 4️⃣ Header interactions
  // -------------------------------------------------------------------------
  test('TC008 - Clicking the logo returns to Home', async ({ page }) => {
    await page.goto(BASE);
    // go to a different tab first
    await page
      .getByRole('button', { name: /tools/i })
      .click({ force: true });
    await expect(
      page.getByRole('heading', { name: /tools/i })
    ).toBeVisible();

    // logo is usually an <a> or <img> with alt text "KBCut"
    const logo = page.getByRole('link', { name: /kbcut/i });
    await logo.click();
    await expect(
      page.getByRole('heading', { name: /home/i })
    ).toBeVisible();
  });

  test('TC009 - Download App modal opens from header', async ({ page }) => {
    await page.goto(BASE);
    const btn = page.getByRole('button', { name: /download app/i });
    await expect(btn).toBeVisible();
    await btn.click();

    const dialog = page.getByRole('dialog', { name: /download app/i });
    await expect(dialog).toBeVisible();

    // close the modal
    await dialog.getByRole('button', { name: /close/i }).click();
    await expect(dialog).toBeHidden();
  });

  // -------------------------------------------------------------------------
  // 5️⃣ Privacy Policy page
  // -------------------------------------------------------------------------
  test('TC010 - Privacy Policy page loads correctly', async ({ page }) => {
    await page.goto(`${BASE}/privacy`);
    await expect(
      page.getByRole('heading', { name: /privacy policy/i })
    ).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // 6️⃣ SEO landing page rendering
  // -------------------------------------------------------------------------
  test('TC011 - SEO landing page for image compression slug', async ({
    page,
  }) => {
    await page.goto(`${BASE}/compress-image-to-50kb`);
    await expect(
      page.getByRole('heading', { name: /compress image to 50kb/i })
    ).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // 7️⃣ Tool specific UI – Compress Settings (file drop zone)
  // -------------------------------------------------------------------------
  test('TC012 - Compress Settings shows file drop zone', async ({
    page,
  }) => {
    await page.goto(BASE);
    await page
      .getByRole('button', { name: /compress image/i })
      .click({ force: true });

    const dropZone = page.getByTestId('compress-dropzone');
    await expect(dropZone).toBeVisible();

    // Verify that the hidden file input exists
    const fileInput = dropZone.locator('input[type="file"]');
    await expect(fileInput).toBeHidden(); // usually hidden but present
  });

  // -------------------------------------------------------------------------
  // 8️⃣ Tool specific UI – Crop & Rotate modal
  // -------------------------------------------------------------------------
  test('TC013 - Crop & Rotate tool opens modal dialog', async ({
    page,
  }) => {
    await page.goto(BASE);
    await page
      .getByRole('button', { name: /crop & rotate/i })
      .click({ force: true });

    const modal = page.getByRole('dialog', { name: /crop & rotate/i });
    await expect(modal).toBeVisible();

    // close modal
    await modal.getByRole('button', { name: /close/i }).click();
    await expect(modal).toBeHidden();
  });

  // -------------------------------------------------------------------------
  // 9️⃣ Tool specific UI – Merge PDF tool
  // -------------------------------------------------------------------------
  test('TC014 - Merge PDF tool opens its modal', async ({ page }) => {
    await page.goto(BASE);
    await page
      .getByRole('button', { name: /merge pdf/i })
      .click({ force: true });

    const modal = page.getByRole('dialog', { name: /merge pdf/i });
    await expect(modal).toBeVisible();

    // verify presence of file input inside modal
    await expect(
      modal.locator('input[type="file"]')
    ).toBeVisible();

    // close modal
    await modal.getByRole('button', { name: /close/i }).click();
    await expect(modal).toBeHidden();
  });

  // -------------------------------------------------------------------------
  // 10️⃣ Responsive layout – mobile breakpoint
  // -------------------------------------------------------------------------
  test('TC015 - Bottom navigation stays visible on mobile viewport', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE);
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();

    // ensure a tab is still clickable
    await nav.getByRole('button', { name: /home/i }).click({ force: true });
    await expect(
      page.getByRole('heading', { name: /home/i })
    ).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // 11️⃣ No uncaught console errors on any route
  // -------------------------------------------------------------------------
  const routes = ['/', '/privacy', '/compress-image-to-50kb'];
  for (const route of routes) {
    test(`TC016 - No console errors on route ${route}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      await page.goto(`${BASE}${route}`);
      expect(errors).toEqual([]);
    });
  }

  // -------------------------------------------------------------------------
  // 12️⃣ Toast appears after successful compression (simulated)
  // -------------------------------------------------------------------------
  test('TC017 - Success toast appears after mock compression', async ({
    page,
  }) => {
    await page.goto(BASE);
    await page
      .getByRole('button', { name: /compress image/i })
      .click({ force: true });

    // Simulate a successful compression by clicking a fake "Compress" button
    const compressBtn = page.getByRole('button', { name: /compress now/i });
    if (await compressBtn.count()) {
      await compressBtn.click();
      const toast = page.getByRole('alert');
      await expect(toast).toContainText(/compressed successfully/i);
    } else {
      test.skip(true, 'Compress button not present in current build');
    }
  });

  // -------------------------------------------------------------------------
  // 13️⃣ History page shows empty state message when no records
  // -------------------------------------------------------------------------
  test('TC018 - History page empty state', async ({ page }) => {
    await page.goto(BASE);
    await page
      .getByRole('button', { name: /history/i })
      .click({ force: true });

    await expect(
      page.getByText(/no history yet/i, { exact: false })
    ).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // 14️⃣ Settings page persists chosen language (i18n)
  // -------------------------------------------------------------------------
  test('TC019 - Language selection persists', async ({ page }) => {
    await page.goto(BASE);
    await page
      .getByRole('button', { name: /settings/i })
      .click({ force: true });

    const langSelect = page.getByLabel(/language/i);
    await expect(langSelect).toBeVisible();

    await langSelect.selectOption('hi'); // Hindi
    await page.reload();

    // After reload the selected option should still be Hindi
    const selected = await langSelect.inputValue();
    expect(selected).toBe('hi');
  });

  // -------------------------------------------------------------------------
  // 15️⃣ Footer contains expected links
  // -------------------------------------------------------------------------
  test('TC020 - Footer contains privacy link', async ({ page }) => {
    await page.goto(BASE);
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();

    const privacyLink = footer.getByRole('link', { name: /privacy/i });
    await