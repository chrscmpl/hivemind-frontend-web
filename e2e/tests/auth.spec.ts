import { test, expect } from '@playwright/test';
import { E2ETimeouts } from 'e2e/config/e2e.config';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(E2ETimeouts.LONG);

  const avatar = page.locator('#header-avatar');
  if (await avatar.isVisible()) {
    avatar.click();
    await page.waitForTimeout(E2ETimeouts.MEDIUM);
    await page.locator('#header-logout').click();
  }
  expect(page.locator('#header-signup')).toBeVisible();
});

test('should enforce sign up constraints', async ({ page }) => {
  await page.locator('#header-signup').click();
  await page.locator('#signup-submit').click();
  expect(page.locator('#signup-display-name-error > .t-message-text')).toBeVisible(); //prettier-ignore
  expect(page.locator('#signup-handle-error > .t-message-text')).toBeVisible(); //prettier-ignore
  expect(page.locator('#signup-email-error > .t-message-text')).toBeVisible(); //prettier-ignore
  expect(page.locator('#signup-password-error > .t-message-text')).toBeVisible(); //prettier-ignore
  expect(page.locator('#signup-confirm-password-error > .t-message-text')).toBeVisible(); //prettier-ignore
  expect(page.locator('#signup-accept-tos-error > .t-message-text')).toBeVisible(); //prettier-ignore
});

test('should enforce log in constraints', async ({ page }) => {
  await page.locator('#header-login').click();
  await page.locator('#login-submit').click();
  expect(page.locator('#login-email-error > .t-message-text')).toBeVisible(); //prettier-ignore
  expect(page.locator('#login-password-error > .t-message-text')).toBeVisible(); //prettier-ignore
});
