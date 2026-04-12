import { test, expect } from '@playwright/test';

test.describe('Marketplace — browse and search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace');
  });

  test('displays model cards on load', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/explore ai models/i);
    const cards = page.locator('.card-hover');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('search filters models by name', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search models/i);
    await searchInput.fill('GPT');
    const cards = page.locator('.card-hover');
    await expect(cards.first()).toBeVisible();
    const names = await cards.locator('h3').allTextContents();
    for (const name of names) {
      expect(name.toLowerCase()).toContain('gpt');
    }
  });

  test('search with no results shows empty state', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search models/i);
    await searchInput.fill('xyznonexistent999');
    await expect(page.getByText(/no models found/i)).toBeVisible();
  });

  test('clear search restores all models', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search models/i);
    const allCards = page.locator('.card-hover');
    const initialCount = await allCards.count();

    await searchInput.fill('GPT');
    await page.waitForTimeout(200);
    const filteredCount = await allCards.count();
    expect(filteredCount).toBeLessThan(initialCount);

    await searchInput.clear();
    await page.waitForTimeout(200);
    const restoredCount = await allCards.count();
    expect(restoredCount).toBe(initialCount);
  });

  test('type filter tabs filter by category', async ({ page }) => {
    await page.getByRole('button', { name: /^Image$/ }).click();
    const cards = page.locator('.card-hover');
    await expect(cards.first()).toBeVisible();
    const badges = await cards.locator('.capitalize').allTextContents();
    for (const badge of badges) {
      expect(badge.toLowerCase()).toBe('image');
    }
  });

  test('sort dropdown opens and selects an option', async ({ page }) => {
    await page.getByRole('button', { name: /sort/i }).click();
    // The sort dropdown has options inside a dropdown menu
    const sortDropdown = page.locator('.shadow-dropdown');
    await expect(sortDropdown).toBeVisible();
    await sortDropdown.getByText('Popular').click();
    await expect(page.getByRole('button', { name: /sort: popular/i })).toBeVisible();
  });

  test('switches between card and list view', async ({ page }) => {
    await expect(page.locator('.card-hover').first()).toBeVisible();

    await page.getByTitle('List view').click();
    await expect(page.locator('.card-hover')).toHaveCount(0);
    const listHeader = page.getByText('Model', { exact: true });
    await expect(listHeader).toBeVisible();

    await page.getByTitle('Card view').click();
    await expect(page.locator('.card-hover').first()).toBeVisible();
  });

  test('clicking a model card navigates to API detail', async ({ page }) => {
    const firstCard = page.locator('.card-hover').first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/api\//);
    // Verify the detail page loaded with an h1
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
