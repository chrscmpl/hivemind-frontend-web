import { test as setup, expect, Page } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

async function submitSignup(page: Page) {
  await page.locator('#signup-display-name').fill('Playwright User');
  await page.locator('#signup-handle').fill('playwright');
  await page.locator('#signup-email').fill('playwright@example.com');
  await page.locator('#signup-password').fill('Playwright123?');
  await page.locator('#signup-confirm-password').fill('Playwright123?');
  await page.locator('#signup-accept-tos').check();
  await page.locator('#signup-submit').click();
}

async function submitLogin(page: Page) {
  await page.locator('#login-email').fill('playwright@example.com');
  await page.locator('#login-password').fill('Playwright123?');
  await page.locator('#login-submit').click();
}

setup('authenticate', async ({ page }) => {
  await page.goto('/');

  if (!(await page.evaluate(() => localStorage.getItem('accessToken')))) {
    await page.locator('#header-signup').click();

    await submitSignup(page);

    if (await page.locator('app-signup-form')?.isVisible()) {
      await page.locator('#signup-login').click();
      await submitLogin(page);
    }

    await page.waitForTimeout(500);
  }

  expect(
    await page.evaluate(() => localStorage.getItem('accessToken')),
  ).toBeTruthy();

  await page.context().storageState({ path: authFile });

  await page.close();
});
