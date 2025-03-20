import { test, expect } from '@playwright/test';
import { E2ETimeouts } from 'e2e/config/e2e.config';

let createdIdeaId: number | null = null;
let createdCommentId: number | null = null;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto('/ideas/submit');
  await page.locator('#create-idea-title').fill('Test Idea');
  await page.locator('#create-idea-submit').click();
  await page.waitForTimeout(E2ETimeouts.EXTRA_LONG);
  for (
    let i = 0;
    i < 10 && (createdIdeaId === null || isNaN(createdIdeaId));
    i++
  ) {
    createdIdeaId = Number(
      page.url().split('/').pop()?.replace(/\?.*/, '') ?? null,
    );
    await page.waitForTimeout(E2ETimeouts.MEDIUM);
  }
  expect(createdIdeaId !== null && !isNaN(createdIdeaId)).toBeTruthy();
});

test.beforeEach(async ({ page }) => {
  await page.goto(`/ideas/${createdIdeaId}`);
  await page.waitForTimeout(E2ETimeouts.SHORT);
});

test.afterAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto(`/ideas/${createdIdeaId}`);
  const more = page.locator(`#idea-${createdIdeaId} .idea-more`);
  await more.click();
  await page.locator(`#idea-${createdIdeaId}-delete`).click();
  await page.getByText('Delete this idea').click();
  await page.waitForTimeout(E2ETimeouts.LONG);
  expect(page.url().includes(`ideas/${createdIdeaId}`)).toBeFalsy();
});

test('should enforce comment creation constraints', async ({ page }) => {
  await page.locator('#comment-editor-input').click();
  await page.waitForTimeout(E2ETimeouts.LONG);
  await page.locator('#comment-editor-submit').click();
  expect(
    page.locator('#comment-editor-content-error > .t-message-text'),
  ).toBeVisible();
});

test('should be able to create a comment', async ({ page }) => {
  await page.locator('#comment-editor-input').click();
  await page.waitForTimeout(E2ETimeouts.LONG);
  await page.locator('tui-code button').click();
  await page.getByText(' Code in block ').click();
  await page.keyboard.type("alert('hello world');");
  await page.locator('#comment-editor-submit').click();
  await page.waitForTimeout(E2ETimeouts.LONG);
  const comment = page.locator(
    `#comment-list-${createdIdeaId} [id^="comment-"]`,
  );
  expect(comment).toBeVisible();
  expect(await comment.locator('.comment-content code').textContent()).toBe(
    "alert('hello world');",
  );

  await page.waitForTimeout(E2ETimeouts.EXTRA_LONG);

  createdCommentId = Number(
    (await comment.getAttribute('id'))?.split('-').pop() ?? null,
  );
});

test('should enforce comment editing constraints', async ({ page }) => {
  for (
    let i = 0;
    i < 10 && (createdCommentId === null || isNaN(createdCommentId));
    i++
  ) {
    page.waitForTimeout(E2ETimeouts.MEDIUM);
  }
  await page.reload();
  const more = page.locator(`#comment-${createdCommentId} .comment-more`);
  expect(more).toBeVisible();
  await more.click();
  await page.waitForTimeout(E2ETimeouts.MEDIUM);
  await page.locator(`#comment-${createdCommentId}-edit`).click();
  await page.waitForTimeout(E2ETimeouts.EXTRA_LONG);
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.locator('#comment-editor-submit').click();
  expect(
    page.locator('#comment-editor-content-error > .t-message-text'),
  ).toBeVisible();
});

test('should be able to edit comment', async ({ page }) => {
  for (
    let i = 0;
    i < 10 && (createdCommentId === null || isNaN(createdCommentId));
    i++
  ) {
    page.waitForTimeout(E2ETimeouts.MEDIUM);
  }
  await page.reload();
  const more = page.locator(`#comment-${createdCommentId} .comment-more`);
  expect(more).toBeVisible();
  await more.click();
  await page.waitForTimeout(E2ETimeouts.MEDIUM);
  await page.locator(`#comment-${createdCommentId}-edit`).click();
  await page.waitForTimeout(E2ETimeouts.EXTRA_LONG);
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('Edited comment');
  await page.locator('#comment-editor-submit').click();
  await page.waitForTimeout(E2ETimeouts.LONG);
  expect(
    await page
      .locator(`#comment-${createdCommentId} .comment-content p`)
      .textContent(),
  ).toBe('Edited comment');
});

test('should be able to delete comment', async ({ page }) => {
  for (
    let i = 0;
    i < 10 && (createdCommentId === null || isNaN(createdCommentId));
    i++
  ) {
    page.waitForTimeout(E2ETimeouts.MEDIUM);
  }
  await page.reload();
  const more = page.locator(`#comment-${createdCommentId} .comment-more`);
  expect(more).toBeVisible();
  await more.click();
  await page.waitForTimeout(E2ETimeouts.MEDIUM);
  await page.locator(`#comment-${createdCommentId}-delete`).click();
  await page.getByText('Delete this comment').click();
  await page.waitForTimeout(E2ETimeouts.LONG);
  expect(
    page.locator(`#comment-${createdCommentId}`).isVisible(),
  ).resolves.toBeFalsy();
});
