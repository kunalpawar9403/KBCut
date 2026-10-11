import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:4173';

test.describe('Core smoke suite', () => {
  test('TC001 - Home page loads without server error', async ({ page }) => {
    const res = await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    expect(res && res.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC002 - App root renders visible content', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#root, #app, main, body').first()).toBeVisible();
    await expect.poll(async () => (await page.locator('body').innerText()).trim().length).toBeGreaterThan(0);
  });

  test('TC003 - No uncaught runtime errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForLoadState('networkidle').catch(() => {});
    expect(errors.filter((m) => !/ResizeObserver/.test(m))).toEqual([]);
  });

  test('TC004 - Unknown route does not crash the app', async ({ page }) => {
    const res = await page.goto(BASE + '/__qa_not_found__', { waitUntil: 'domcontentloaded' });
    expect(res).not.toBeNull();
    await expect(page.locator('body')).toBeVisible();
  });
});
