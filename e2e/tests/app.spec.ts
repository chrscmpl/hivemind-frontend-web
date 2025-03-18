import { test, expect } from '@playwright/test';

test('should load homepage', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title).toBe('HiveMind');
});
