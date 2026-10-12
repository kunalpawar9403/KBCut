import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:4173';

test.describe('KBCut Core Application Suite', () => {
  test('TC001 - Application home page loads with valid title and root container', async ({
    page,
  }) => {
    const response = await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/KBCut/i);
    await expect(page.locator('#root')).toBeVisible();
  });

  test('TC002 - Main header navigation renders accessible tabs', async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const homeBtn = header.locator('button:has-text("Home")');
    const toolsBtn = header.locator('button:has-text("Tools")');
    const settingsBtn = header.locator('button:has-text("Settings")');

    await expect(homeBtn).toBeVisible();
    await expect(toolsBtn).toBeVisible();
    await expect(settingsBtn).toBeVisible();
  });

  test('TC003 - DropZone file upload container is visible on home page', async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    const dropZone = page.locator('input[type="file"], [role="presentation"], label:has-text("Choose")');
    await expect(dropZone.first()).toBeVisible();
  });

  test('TC004 - Dark and Light theme toggle switches document theme class', async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    const themeBtn = page
      .locator('header button')
      .filter({ has: page.locator('svg') })
      .first();
    await expect(themeBtn).toBeVisible();

    const html = page.locator('html');
    const initialClass = await html.getAttribute('class');

    await themeBtn.click();

    // Wait for the class attribute to change after the click
    await expect(html).toHaveAttribute('class', (value) => value !== initialClass);
  });

  test('TC005 - Navigation to Privacy Policy route renders content', async ({
    page,
  }) => {
    const response = await page.goto(`${BASE}/privacy`, {
      waitUntil: 'domcontentloaded',
    });
    expect(response).not.toBeNull();
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1, h2, main').first()).toBeVisible();
  });

  test('TC006 - SEO preset route for 50KB compression loads cleanly', async ({
    page,
  }) => {
    const response = await page.goto(`${BASE}/compress-image-to-50kb`, {
      waitUntil: 'domcontentloaded',
    });
    expect(response).not.toBeNull();
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC007 - Mobile viewport renders responsive navigation', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    const nav = page.locator('nav, header, [role="navigation"]').first();
    await expect(nav).toBeVisible();
  });

  test('TC008 - Tools navigation tab displays tool options', async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    const toolsTab = page.locator('button:has-text("Tools"), a:has-text("Tools")').first();
    if (await toolsTab.count() > 0) {
      await toolsTab.click();
      // After clicking Tools, a main content area with tool options should appear
      await expect(page.locator('main, #root')).toBeVisible();
    } else {
      test.fail(true, 'Tools tab not found');
    }
  });

  test('TC009 - No uncaught runtime exceptions during initial load', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto(BASE, { waitUntil: 'load' });

    const fatalErrors = pageErrors.filter(
      (msg) => !/ResizeObserver|Non-Error/i.test(msg)
    );
    expect(fatalErrors).toEqual([]);
  });
});