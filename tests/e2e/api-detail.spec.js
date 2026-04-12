import { test, expect } from '@playwright/test';

test.describe('API Detail page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace');
    await page.locator('.card-hover').first().click();
    await expect(page).toHaveURL(/\/api\//);
  });

  test('shows API name and provider', async ({ page }) => {
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByText(/^by /i)).toBeVisible();
  });

  test('shows pricing sidebar', async ({ page }) => {
    await expect(page.getByText('Pricing')).toBeVisible();
    await expect(page.getByText('Input', { exact: true })).toBeVisible();
    await expect(page.getByText('Output', { exact: true })).toBeVisible();
  });

  test('Playground tab shows sign-in prompt when logged out', async ({ page }) => {
    await expect(page.getByText(/sign in to use the playground/i)).toBeVisible();
  });

  test('switches to Introduction tab', async ({ page }) => {
    await page.getByRole('button', { name: /introduction/i }).click();
    await expect(page.getByText(/frequently asked questions/i)).toBeVisible();
  });

  test('FAQ accordion opens on click', async ({ page }) => {
    await page.getByRole('button', { name: /introduction/i }).click();
    const firstFaq = page.locator('button').filter({ hasText: /what is/i }).first();
    await firstFaq.click();
    // Answer content should appear — look for the unified API text
    await expect(page.getByText(/unified api/i)).toBeVisible();
  });

  test('switches to API tab and shows code examples', async ({ page }) => {
    await page.getByRole('button', { name: /^api$/i }).click();
    await expect(page.getByText(/code examples/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /python/i })).toBeVisible();
  });

  test('code example language tabs work', async ({ page }) => {
    await page.getByRole('button', { name: /^api$/i }).click();
    await page.getByRole('button', { name: /javascript/i }).click();
    await expect(page.getByRole('button', { name: /javascript/i })).toBeVisible();
    await page.getByRole('button', { name: /curl/i }).click();
    await expect(page.getByRole('button', { name: /curl/i })).toBeVisible();
  });

  test('back button returns to previous page', async ({ page }) => {
    await page.getByRole('button', { name: /back/i }).click();
    await expect(page).toHaveURL(/\/marketplace/);
  });
});
