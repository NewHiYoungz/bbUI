import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('login page loads with form fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText(/welcome back/i)).toBeVisible();
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
  });

  test('shows validation error on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in$/i }).click();
    await expect(page.getByText(/please fill in all fields/i)).toBeVisible();
  });

  test('switches to sign up mode', async ({ page }) => {
    await page.goto('/login');
    // The form footer has "Don't have an account? Sign up" — click the Sign up button in the form
    const form = page.locator('form');
    await form.getByRole('button', { name: /sign up$/i }).click();
    await expect(page).toHaveURL(/mode=signup/);
    await expect(page.getByText('Create Account').first()).toBeVisible();
    await expect(page.getByPlaceholder('John Doe')).toBeVisible();
  });

  test('switches back to login mode', async ({ page }) => {
    await page.goto('/login?mode=signup');
    await expect(page.getByText('Create Account').first()).toBeVisible();
    // The signup form footer has "Already have an account? Sign in"
    const form = page.locator('form');
    await form.getByRole('button', { name: /sign in$/i }).click();
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('demo@example.com');
    await page.getByPlaceholder('Enter your password').fill('password123');
    await page.getByRole('button', { name: /sign in$/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('header shows user name after login', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('demo@example.com');
    await page.getByPlaceholder('Enter your password').fill('password123');
    await page.getByRole('button', { name: /sign in$/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    // Use the header button specifically
    await expect(page.getByRole('button', { name: 'Demo User' })).toBeVisible();
  });

  test('sign out returns to logged-out state', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('demo@example.com');
    await page.getByPlaceholder('Enter your password').fill('password123');
    await page.getByRole('button', { name: /sign in$/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByRole('button', { name: 'Demo User' }).click();
    await page.getByText('Sign Out').click();
    await expect(page.getByRole('button', { name: 'Log in' }).first()).toBeVisible();
  });
});
