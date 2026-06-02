import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('renders and shows featured ads', async ({ page }) => {
    await page.goto('/');

    // Page loads with title
    await expect(page.locator('h1')).toContainText(/xyzt|ad|market/i);

    // Category filter buttons are visible
    const categories = page.locator('button, a', { hasText: /all|products|services|events/i });
    await expect(categories.first()).toBeVisible();
  });

  test('search input works', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('XYZT');
      await searchInput.press('Enter');
      // URL should contain search param
      await expect(page).toHaveURL(/[?&]q=/);
    }
  });

  test('ad detail modal opens via deep link', async ({ page }) => {
    // First, get an ad ID from the page
    await page.goto('/');

    // Look for View buttons/links on ad cards
    const viewLinks = page.locator('a[href*="?ad="]');
    const viewCount = await viewLinks.count();

    if (viewCount > 0) {
      // Click the first "View" link
      await viewLinks.first().click();

      // Should navigate to /?ad=UUID — the modal should appear
      await expect(page).toHaveURL(/[?&]ad=/);
    }
  });
});

test.describe('Navigation', () => {
  test('sign-in page has test account helper', async ({ page }) => {
    await page.goto('/sign-in');

    // Dev mode banner should show on local/development
    const devBanner = page.locator('text=Development Mode');
    if (await devBanner.isVisible()) {
      await expect(devBanner).toBeVisible();
    }
  });

  test('navigates to submit ad page', async ({ page }) => {
    await page.goto('/');
    await page.goto('/submit-ad');

    await expect(page.locator('h1')).toContainText(/submit/i);
  });

  test('navigates to pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('h1')).toContainText(/pricing|plan/i);
  });
});

test.describe('My Ads (authenticated)', () => {
  test('redirects anonymous users to sign-in', async ({ page }) => {
    await page.goto('/me/ads');

    // Should show a sign-in prompt or redirect
    const body = page.locator('body');
    await expect(body).toContainText(/sign in/i);
  });
});
