import { test, expect } from '@playwright/test';

let createdIdeaId: number | null = null;
let createdCommentId: number | null = null;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto('/ideas/submit');
  await page.locator('#create-idea-title').fill('Test Idea');
  await page.keyboard.type('Test idea');
  await page.locator('#create-idea-submit').click();
  await page.waitForTimeout(500);
  createdIdeaId = Number(
    page.url().split('/').pop()?.replace(/\?.*/, '') ?? null,
  );
  expect(createdIdeaId !== null && !isNaN(createdIdeaId)).toBeTruthy();
});

test.beforeEach(async ({ page }) => {
  await page.goto(`/ideas/${createdIdeaId}`);
});

test.afterAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto(`/ideas/${createdIdeaId}`);
  await page.locator(`#idea-${createdIdeaId} .idea-more`).click();
  await page.locator(`#idea-${createdIdeaId}-delete`).click();
  await page.getByText('Delete this idea').click();
  await page.waitForTimeout(500);
  expect(page.url().includes(`ideas/${createdIdeaId}`)).toBeFalsy();
});

test('should enforce comment creation constraints', async ({ page }) => {
  await page.locator('#comment-editor-input').click();
  await page.waitForTimeout(500);
  await page.locator('#comment-editor-submit').click();
  expect(
    page.locator('#comment-editor-content-error > .t-message-text'),
  ).toBeVisible();
});

test('should be able to create a comment', async ({ page }) => {
  await page.locator('#comment-editor-input').click();
  await page.waitForTimeout(500);
  await page.locator('tui-code button').click();
  await page.getByText(' Code in block ').click();
  await page.keyboard.type("alert('hello world');");
  await page.locator('#comment-editor-submit').click();
  await page.waitForTimeout(500);
  const comment = page.locator(
    `#comment-list-${createdIdeaId} [id^="comment-"]`,
  );
  expect(comment).toBeVisible();
  expect(await comment.locator('.comment-content code').textContent()).toBe(
    "alert('hello world');",
  );

  await page.waitForTimeout(500);

  createdCommentId = Number(
    (await comment.getAttribute('id'))?.split('-').pop() ?? null,
  );
});

test('should enforce comment editing constraints', async ({ page }) => {
  const more = page.locator(`#comment-${createdCommentId} .comment-more`);
  expect(more).toBeVisible();
  await more.click();
  await page.locator(`#comment-${createdCommentId}-edit`).click();
  await page.waitForTimeout(500);
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.locator('#comment-editor-submit').click();
  expect(
    page.locator('#comment-editor-content-error > .t-message-text'),
  ).toBeVisible();
});

test('should be able to edit comment', async ({ page }) => {
  const more = page.locator(`#comment-${createdCommentId} .comment-more`);
  expect(more).toBeVisible();
  await more.click();
  await page.locator(`#comment-${createdCommentId}-edit`).click();
  await page.waitForTimeout(500);
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('Edited comment');
  await page.locator('#comment-editor-submit').click();
  await page.waitForTimeout(500);
  expect(
    await page
      .locator(`#comment-${createdCommentId} .comment-content p`)
      .textContent(),
  ).toBe('Edited comment');
});

test('should be able to delete comment', async ({ page }) => {
  const more = page.locator(`#comment-${createdCommentId} .comment-more`);
  expect(more).toBeVisible();
  await more.click();
  await page.locator(`#comment-${createdCommentId}-delete`).click();
  await page.getByText('Delete this comment').click();
  await page.waitForTimeout(500);
  expect(
    page.locator(`#comment-${createdCommentId}`).isVisible(),
  ).resolves.toBeFalsy();
});
