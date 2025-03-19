import { test, expect } from '@playwright/test';

test('should open not found page on no matching route', async ({ page }) => {
  await page.goto('/not/a/route');
  const title = await page.title();
  expect(title).toBe('Not Found');
  expect(page.locator('app-not-found-page')).toBeVisible();
});
