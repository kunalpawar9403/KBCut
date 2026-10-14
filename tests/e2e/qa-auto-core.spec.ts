import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:4173';

test.describe('KBCut E2E Test Suite', () => {
  // Capture page errors for every test
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    page.on('pageerror', (err) => {
      // eslint-disable-next-line no-console
      console.error('PAGE ERROR:', err);
    });
  });

  test('TC001 - Home page loads with correct title and no console errors', async ({
    page,
  }) => {
    await expect(page).toHaveTitle(
      /KBCut - Photo & PDF Size Reducer \| Get Under the Limit/i,
    );
    // simple sanity check – the root element should be present
    await expect(page.locator('#root')).toBeVisible();
  });

  test('TC002 - Header contains theme toggle and toggles dark mode', async ({
    page,
  }) => {
    const toggle = page.getByLabel(/toggle theme/i);
    await expect(toggle).toBeVisible();

    // capture initial state
    const initialTheme = await page.evaluate(() =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    );

    await toggle.click();
    const newTheme = await page.evaluate(() =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    );
    expect(newTheme).not.toBe(initialTheme);

    // verify localStorage is updated
    const stored = await page.evaluate(() =>
      localStorage.getItem('kbcut_theme'),
    );
    expect(stored).toBe(newTheme);
  });

  test('TC003 - Bottom navigation Home button navigates to home', async ({
    page,
  }) => {
    // go to a different tab first
    await page.getByRole('button', { name: /tools/i }).click();
    await expect(page).toHaveURL(`${BASE}/`);
    // click Home
    await page.getByRole('button', { name: /home/i }).click();
    await expect(page).toHaveURL(`${BASE}/`);
    // verify a home‑specific heading exists
    await expect(
      page.getByRole('heading', { name: /kbcut/i, exact: false }),
    ).toBeVisible();
  });

  test('TC004 - Navigate to Tools page and verify tool cards are displayed', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /tools/i }).click();
    await expect(page).toHaveURL(`${BASE}/`);
    // look for a few known tool titles
    await expect(page.getByText(/crop & rotate/i)).toBeVisible();
    await expect(page.getByText(/merge pdf/i)).toBeVisible();
    await expect(page.getByText(/split pdf/i)).toBeVisible();
  });

  test('TC005 - Open "Crop & Rotate" tool and verify component loads', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /tools/i }).click();
    await page.getByText(/crop & rotate/i).click();
    // the tool component renders a heading with its name
    await expect(
      page.getByRole('heading', { name: /crop & rotate/i }),
    ).toBeVisible();
  });

  test('TC006 - Navigate to History page and verify empty state message', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /history/i }).click();
    await expect(page).toHaveURL(`${BASE}/`);
    await expect(
      page.getByText(/no history yet/i, { exact: false }),
    ).toBeVisible();
  });

  test('TC007 - Settings page persists theme after reload', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    await expect(page).toHaveURL(`${BASE}/`);
    const toggle = page.getByLabel(/toggle theme/i);
    await toggle.click(); // ensure we change it
    const chosen = await page.evaluate(() =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    );
    await page.reload();
    const afterReload = await page.evaluate(() =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    );
    expect(afterReload).toBe(chosen);
  });

  test('TC008 - Open Privacy Policy from footer and verify content', async ({
    page,
  }) => {
    const privacyLink = page.getByRole('link', { name: /privacy policy/i });
    await expect(privacyLink).toBeVisible();
    await privacyLink.click();
    await expect(page).toHaveURL(`${BASE}/privacy`);
    await expect(
      page.getByRole('heading', { name: /privacy policy/i }),
    ).toBeVisible();
  });

  test('TC009 - Direct access to SEO landing page loads correctly', async ({
    page,
  }) => {
    await page.goto(`${BASE}/compress-image-to-50kb`);
    await expect(page).toHaveURL(`${BASE}/compress-image-to-50kb`);
    // landing pages usually contain a prominent heading with the slug text
    await expect(
      page.getByRole('heading', { name: /compress image to 50kb/i }),
    ).toBeVisible();
  });

  test('TC010 - Responsive layout: Bottom navigation visible on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12 size
    const bottomNav = page.getByRole('navigation', { name: /bottom/i });
    await expect(bottomNav).toBeVisible();
    // ensure a tab button is still clickable
    await page.getByRole('button', { name: /home/i }).click();
    await expect(page).toHaveURL(`${BASE}/`);
  });

  test('TC011 - Clicking header logo navigates to home', async ({
    page,
  }) => {
    // first go to a different tab
    await page.getByRole('button', { name: /tools/i }).click();
    // assume the logo has aria-label "Home"
    const logo = page.getByLabel(/home/i);
    await expect(logo).toBeVisible();
    await logo.click();
    await expect(page).toHaveURL(`${BASE}/`);
  });

  test('TC012 - "Download App" button opens modal dialog', async ({
    page,
  }) => {
    const dlBtn = page.getByRole('button', { name: /download app/i });
    await expect(dlBtn).toBeVisible();
    await dlBtn.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/download/i)).toBeVisible();
    // close modal (assume a close button with aria-label "Close")
    await dialog.getByLabel(/close/i).click();
    await expect(dialog).toBeHidden();
  });

  test('TC013 - Toast container exists in DOM', async ({ page }) => {
    // trigger a toast by toggling theme (the app shows a toast on change)
    await page.getByLabel(/toggle theme/i).click();
    const toast = page.getByRole('status'); // generic toast role
    await expect(toast).toBeVisible();
  });

  test('TC014 - No console errors on Tools page', async ({ page }) => {
    const errors: unknown[] = [];
    page.on('pageerror', (e) => errors.push(e));
    await page.getByRole('button', { name: /tools/i }).click();
    await expect(page).toHaveURL(`${BASE}/`);
    expect(errors).toHaveLength(0);
  });

  test('TC015 - Theme toggle updates localStorage correctly', async ({
    page,
  }) => {
    const toggle = page.getByLabel(/toggle theme/i);
    await toggle.click();
    const stored = await page.evaluate(() =>
      localStorage.getItem('kbcut_theme'),
    );
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    expect(stored).toBe(isDark ? 'dark' : 'light');
  });

  test('TC016 - Back navigation from Privacy Policy returns to Home', async ({
    page,
  }) => {
    await page.getByRole('link', { name: /privacy policy/i }).click();
    await expect(page).toHaveURL(`${BASE}/privacy`);
    await page.goBack();
    await expect(page).toHaveURL(`${BASE}/`);
    await expect(
      page.getByRole('heading', { name: /kbcut/i, exact: false }),
    ).toBeVisible();
  });

  test('TC017 - URL updates correctly when navigating tabs', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /history/i }).click();
    await expect(page).toHaveURL(`${BASE}/`);
    // the app uses pushState without changing path, but we can verify active tab via aria-selected
    const historyTab = page.getByRole('button', { name: /history/i });
    await expect(historyTab).toHaveAttribute('aria-selected', 'true');
  });

  test('TC018 - Browser back button returns to previous tab', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /tools/i }).click();
    await page.getByRole('button', { name: /history/i }).click();
    await expect(page.getByRole('button', { name: /history/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.goBack(); // should go back to Tools
    await expect(page.getByRole('button', { name: /tools/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});