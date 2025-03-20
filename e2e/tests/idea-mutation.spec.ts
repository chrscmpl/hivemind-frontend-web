import { test, expect } from '@playwright/test';
import { E2ETimeouts } from 'e2e/config/e2e.config';

let createdIdeaId: number = 0;

test('should open idea creation page from aside or app bar', async ({
  page,
}) => {
  await page.goto('/');
  if (await page.locator('#app-aside').isVisible()) {
    await page.locator('#aside-submit').click();
  } else {
    await page.locator('#app-bar-submit').click();
  }
  await page.waitForTimeout(E2ETimeouts.MEDIUM);
  expect(page.locator('app-create-idea-page')).toBeVisible();
  expect(await page.title()).toBe('Post Idea');
  expect(page.url()).toContain('/ideas/submit');
});

test('should open idea creation page from create button', async ({ page }) => {
  await page.goto('/');
  const button = page.locator('#app-create-button');
  if (!(await button.isVisible())) {
    return;
  }
  await button.click();
  await page.waitForTimeout(E2ETimeouts.MEDIUM);
  expect(page.locator('app-create-idea-page')).toBeVisible();
  expect(await page.title()).toBe('Post Idea');
  expect(page.url()).toContain('/ideas/submit');
});

test('should enforce idea creation constraints', async ({ page }) => {
  await page.goto('/ideas/submit');
  await page.locator('#create-idea-submit').click();
  expect(
    page.locator('#create-idea-title-error > .t-message-text'),
  ).toBeVisible();
  await page.locator('#create-idea-title').fill('A');
  await page.locator('#create-idea-submit').click();
  expect(
    page.locator('#create-idea-title-error > .t-message-text'),
  ).toBeVisible();
});

test('should be able to create an idea', async ({ page }) => {
  await page.goto('/ideas/submit');
  await page.locator('#create-idea-title').fill('Test Idea');
  await page.locator('[automation-id="toolbar__font-style-button"]').click();
  await page.getByText('Toggle strike').click();
  await page.keyboard.type('Test idea');
  expect(
    await page.locator('#create-idea-content .ProseMirror s').textContent(),
  ).toBe('Test idea');
  await page.locator('#create-idea-submit').click();
  expect(await page.locator('[id^="idea-"] s').textContent()).toBe('Test idea');
  await page.waitForTimeout(E2ETimeouts.LONG);
  createdIdeaId = Number(page.url().split('/').pop()?.replace(/\?.*/, '') ?? 0);
});

test('should enforce idea editing constraints', async ({ page, isMobile }) => {
  await page.goto(`/ideas/${createdIdeaId}`);
  const more = page.locator(`#idea-${createdIdeaId} .idea-more`);
  expect(await more.isVisible()).toBeTruthy();
  if (isMobile) {
    await more.click();
  } else {
    await more.hover();
  }
  await page.locator(`#idea-${createdIdeaId}-edit`).click();

  await page.locator('#create-idea-title').fill('');
  await page.locator('#create-idea-submit').click();
  expect(
    page.locator('#create-idea-title-error > .t-message-text'),
  ).toBeVisible();
  await page.locator('#create-idea-title').fill('A');
  await page.locator('#create-idea-submit').click();
  expect(
    page.locator('#create-idea-title-error > .t-message-text'),
  ).toBeVisible();
});

test('should be able to edit an idea', async ({ page, isMobile }) => {
  await page.goto(`/ideas/${createdIdeaId}`);
  const more = page.locator(`#idea-${createdIdeaId} .idea-more`);
  expect(await more.isVisible()).toBeTruthy();
  if (isMobile) {
    await more.click();
  } else {
    await more.hover();
  }
  await page.locator(`#idea-${createdIdeaId}-edit`).click();

  await page.locator('#create-idea-title').fill('Edited Idea');
  await page.locator('#create-idea-submit').click();
  expect(
    (
      await page.locator(`#idea-${createdIdeaId} .idea-title`).textContent()
    )?.trim(),
  ).toBe('Edited Idea');
  expect(page.locator(`#idea-${createdIdeaId} .idea-edited`)).toBeVisible();
});

test('should be able to delete an idea', async ({ page, isMobile }) => {
  await page.goto(`/ideas/${createdIdeaId}`);
  const more = page.locator(`#idea-${createdIdeaId} .idea-more`);
  expect(await more.isVisible()).toBeTruthy();
  if (isMobile) {
    await more.click();
  } else {
    await more.hover();
  }
  await page.locator(`#idea-${createdIdeaId}-delete`).click();
  await page.getByText('Delete this idea').click();
  await page.waitForTimeout(E2ETimeouts.LONG);
  expect(page.url().includes(`ideas/${createdIdeaId}`)).toBeFalsy();
});
