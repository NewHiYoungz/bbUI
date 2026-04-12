import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads hero section with headline and CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/one api/i);
    await expect(page.getByRole('link', { name: /get api key/i })).toBeVisible();
  });

  test('shows popular AI models section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /popular ai api models/i })).toBeVisible();
  });

  test('navigates to marketplace from API Documentation link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /api documentation/i }).click();
    await expect(page).toHaveURL(/\/docs/);
  });

  test('header navigation links work', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'API Market' }).click();
    await expect(page).toHaveURL(/\/marketplace/);
  });
});
