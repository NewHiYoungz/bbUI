import { test, expect } from '@playwright/test';

test.describe('Dashboard — authenticated user', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('demo@example.com');
    await page.getByPlaceholder('Enter your password').fill('password123');
    await page.getByRole('button', { name: /sign in$/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('shows dashboard overview with stats', async ({ page }) => {
    await expect(page.getByText(/overview/i).first()).toBeVisible();
    await expect(page.getByText(/calls \(7d\)/i).first()).toBeVisible();
  });

  test('sidebar navigation between tabs', async ({ page }) => {
    const sidebar = page.locator('aside');

    // Call Logs tab has a search filter
    await sidebar.getByText('Call Logs').click();
    await expect(page.getByPlaceholder(/search by id or model/i)).toBeVisible();

    // Analytics tab
    await sidebar.getByText('Analytics').click();
    await expect(page.getByText(/analytics/i).first()).toBeVisible();

    // API Keys tab shows heading
    await sidebar.getByText('API Keys').click();
    await expect(page.getByRole('heading', { name: /api keys/i })).toBeVisible();
  });

  test('API Keys tab shows create key button', async ({ page }) => {
    const sidebar = page.locator('aside');
    await sidebar.getByText('API Keys').click();
    await expect(page.getByRole('button', { name: /create key/i })).toBeVisible();
  });

  test('Billing tab shows balance', async ({ page }) => {
    const sidebar = page.locator('aside');
    await sidebar.getByText('Billing').click();
    await expect(page.getByRole('heading', { name: /billing/i })).toBeVisible();
    await expect(page.getByText(/available balance/i)).toBeVisible();
  });

  test('Activity tab shows referral program', async ({ page }) => {
    const sidebar = page.locator('aside');
    await sidebar.getByText('Activity').click();
    await expect(page.getByRole('heading', { name: /referral program/i })).toBeVisible();
  });
});
