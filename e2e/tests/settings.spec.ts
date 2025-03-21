import { test, expect } from '@playwright/test';
import { E2ETimeouts } from 'e2e/config/e2e.config';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  if (await page.locator('#app-aside').isVisible()) {
    await page.locator('#aside-toggle').click();
    await page.locator('#aside-settings').click();
    await page.locator('#aside-settings-theme').click();
  } else {
    await page.locator('#app-drawer').click();
    await page.locator('#drawer-settings').click();
  }
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
  expect(await page.locator('#theme-dark').isChecked()).toBeTruthy();
  expect(await page.locator('#theme-light').isChecked()).toBeFalsy();
  expect(await page.locator('#theme-system').isChecked()).toBeFalsy();
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
});

test('should be able to set theme variation', async ({ page }) => {
  await page.locator('#theme-dark').click();
  await page.locator('#theme-variation').click();
  await page.locator('#theme-variation-terminal').click();
  await page.locator('#theme-variation').click();

  await page.waitForTimeout(E2ETimeouts.LONG);

  expect(
    await page
      .locator('#theme-variation-terminal')
      .getAttribute('data-checked'),
  ).toBe('true');
  expect(
    await page.evaluate(() => localStorage.getItem('dark-theme-variation')),
  ).toBe('terminal');
});
