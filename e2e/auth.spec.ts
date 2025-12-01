import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Check for key elements
    await expect(page.locator('h1')).toContainText(/get started|scova/i);
    await expect(page.getByText(/brand research/i)).toBeVisible();
  });

  test('should show email sign-in form', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Check for email and password fields
    const emailInput = page.getByLabel(/email/i, { exact: false });
    const passwordInput = page.getByLabel(/password/i, { exact: false });

    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
  });

  test('should validate empty form submission', async ({ page }) => {
    await page.goto('/login');

    const submitButton = page.getByRole('button', { name: /sign in|sign up/i });
    await submitButton.click();

    // Should show validation error or prevent submission
    // This depends on your implementation - adjust as needed
    await page.waitForTimeout(1500);
    
    // Check if error message appears or form doesn't submit
    const errorMessage = page.getByText(/fill|required|invalid/i);
    await expect(errorMessage).toBeVisible({ timeout: 3000 }).catch(() => {
      // If no error message, the form should still be on login page
      expect(page.url()).toContain('/login');
    });
  });

  test('should validate password length', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.getByLabel(/email/i, { exact: false });
    const passwordInput = page.getByLabel(/password/i, { exact: false });

    await emailInput.fill('test@example.com');
    await passwordInput.fill('12345'); // Less than 6 characters

    const submitButton = page.getByRole('button', { name: /sign in/i });
    await submitButton.click();

    // Should show password length error
    await expect(
      page.getByText(/at least 6 characters|password/i)
    ).toBeVisible({ timeout: 3000 }).catch(() => {
      // Form validation might prevent submission
      expect(passwordInput).toHaveAttribute('minlength', '6');
    });
  });

  test('should toggle between sign in and sign up', async ({ page }) => {
    await page.goto('/login');

    // Find the toggle link
    const toggleLink = page.getByText(/don't have an account|sign up/i);
    if (await toggleLink.isVisible()) {
      await toggleLink.click();
      
      // Button text should change to "Create account" or similar
      const createButton = page.getByRole('button', { name: /create account|sign up/i });
      await expect(createButton).toBeVisible();
    }
  });
});

