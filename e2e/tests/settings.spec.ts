import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  if (await page.locator('#app-aside').isVisible()) {
    await page.locator('#aside-toggle').click();
    await page.waitForTimeout(500);
    await page.locator('#aside-settings').click();
    await page.waitForTimeout(500);
    await page.locator('#aside-settings-theme').click();
  } else {
    await page.locator('#app-drawer').click();
    await page.waitForTimeout(500);
    await page.locator('#drawer-settings').click();
  }
  await page.waitForTimeout(500);
});

test('should open settings', async ({ page }) => {
  expect(page.locator('app-settings-dialog')).toBeTruthy();
});

test('should have set the right theme', async ({ page }) => {
  const theme =
    (await page.evaluate(() => localStorage.getItem('theme'))) ?? null;

  expect(await page.locator('#theme-system').isChecked()).toBe(theme === null);
  expect(await page.locator('#theme-dark').isChecked()).toBe(theme === 'dark');
  expect(await page.locator('#theme-light').isChecked()).toBe(
    theme === 'light',
  );
});

test('should be able to set theme', async ({ page }) => {
  await page.locator('#theme-dark').click();
  await page.waitForTimeout(500);
  expect(await page.locator('#theme-dark').isChecked()).toBeTruthy();
  expect(await page.locator('#theme-light').isChecked()).toBeFalsy();
  expect(await page.locator('#theme-system').isChecked()).toBeFalsy();
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
});

test('should be able to set theme variation', async ({ page }) => {
  await page.locator('#theme-dark').click();
  await page.waitForTimeout(500);
  await page.locator('#theme-variation').click();
  await page.waitForTimeout(500);
  await page.locator('#theme-variation-terminal').click();
  await page.waitForTimeout(500);
  await page.locator('#theme-variation').click();
  await page.waitForTimeout(500);

  expect(
    await page
      .locator('#theme-variation-terminal')
      .getAttribute('ng-reflect-icon-end'),
  ).toBe('@tui.check');
  expect(
    await page.evaluate(() => localStorage.getItem('dark-theme-variation')),
  ).toBe('terminal');
});
