import { test, expect } from '@playwright/test';

test.describe('Navigation and static pages', () => {
  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('heading', { name: 'Pricing' })).toBeVisible();
  });

  test('docs page loads', async ({ page }) => {
    await page.goto('/docs');
    await expect(page.getByRole('heading', { name: 'Documentation' })).toBeVisible();
  });

  test('header brand links to home', async ({ page }) => {
    await page.goto('/marketplace');
    await page.locator('a', { has: page.locator('text=supremind.ai') }).first().click();
    await expect(page).toHaveURL('/');
  });

  test('footer is visible on all pages', async ({ page }) => {
    await page.goto('/');
    // Scroll to bottom to ensure footer is in view
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('footer')).toBeVisible();
  });

  test('responsive: mobile menu toggle works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    // The mobile menu button has the lg:hidden class
    const menuButton = page.locator('button.lg\\:hidden');
    await menuButton.click();
    await expect(page.getByText('API Market').last()).toBeVisible();
  });
});
