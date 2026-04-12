import { test, expect } from '@playwright/test';

test.describe('Chat interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
  });

  test('shows welcome message and input', async ({ page }) => {
    await expect(page.getByText(/what's on your mind/i)).toBeVisible();
    await expect(page.getByPlaceholder(/ask supremind/i)).toBeVisible();
  });

  test('shows quick action buttons', async ({ page }) => {
    await expect(page.getByText('Summary')).toBeVisible();
    await expect(page.getByText('Code')).toBeVisible();
    await expect(page.getByText('Design')).toBeVisible();
    await expect(page.getByText('Research')).toBeVisible();
  });

  test('quick action fills input', async ({ page }) => {
    await page.getByText('Summary').click();
    const input = page.getByPlaceholder(/ask supremind/i);
    await expect(input).toHaveValue('Summarize the French Revolution');
  });

  test('model selector opens and allows selection', async ({ page }) => {
    await page.getByText('GPT-5').click();
    await expect(page.getByText('Claude Sonnet 4.6')).toBeVisible();
    await page.getByText('Claude Sonnet 4.6').click();
    await expect(page.getByText('Claude Sonnet 4.6').first()).toBeVisible();
  });

  test('sending a message shows it in conversation', async ({ page }) => {
    const input = page.getByPlaceholder(/ask supremind/i);
    await input.fill('Hello AI');
    await input.press('Enter');
    await expect(page.getByText('Hello AI')).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('quick actions disappear after sending a message', async ({ page }) => {
    const input = page.getByPlaceholder(/ask supremind/i);
    await input.fill('Test message');
    await input.press('Enter');
    await expect(page.getByText(/what's on your mind/i)).not.toBeVisible();
  });

  test('sidebar shows conversation history', async ({ page }) => {
    await expect(page.getByText('How to build a REST API')).toBeVisible();
    await expect(page.getByText('Today')).toBeVisible();
  });

  test('New Chat button resets to welcome screen', async ({ page }) => {
    const input = page.getByPlaceholder(/ask supremind/i);
    await input.fill('A test message');
    await input.press('Enter');
    await expect(page.getByText(/what's on your mind/i)).not.toBeVisible();

    await page.getByRole('button', { name: /new chat/i }).click();
    await expect(page.getByText(/what's on your mind/i)).toBeVisible();
  });
});
