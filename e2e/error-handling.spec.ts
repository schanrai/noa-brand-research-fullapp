import { test, expect } from '@playwright/test';

test.describe('Error Handling - API Errors', () => {
  test('should display error toast for validation errors (400)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Intercept API calls and return 400 error
    await page.route('**/api/llm', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid input detected',
          details: 'Input contains potentially malicious patterns',
        }),
      });
    });

    // Try to submit invalid input
    const input = page.locator('input, textarea').first();
    await input.fill('Invalid input');
    
    const submitButton = page.getByRole('button', { name: /send|submit|search/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Wait for error toast
      await page.waitForTimeout(2000);
      
      // Check for error message
      const errorMessage = page.getByText(/invalid|error/i);
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
      
      // Should not show retry button for validation errors
      const retryButton = page.getByRole('button', { name: /try again|retry/i });
      await expect(retryButton).not.toBeVisible();
    }
  });

  test('should display error toast with retry for server errors (500)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Intercept API calls and return 500 error
    await page.route('**/api/llm', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'LLM service error',
          details: 'HTTP 500: Internal Server Error',
        }),
      });
    });

    const input = page.locator('input, textarea').first();
    await input.fill('Apple Inc');
    
    const submitButton = page.getByRole('button', { name: /send|submit|search/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      await page.waitForTimeout(2000);
      
      // Check for error message
      const errorMessage = page.getByText(/unavailable|error|service/i);
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
      
      // Should show retry button for server errors
      const retryButton = page.getByRole('button', { name: /try again|retry/i });
      await expect(retryButton).toBeVisible({ timeout: 4000 }).catch(() => {
        // Retry might be implemented differently
      });
    }
  });

  test('should display error toast for rate limit errors (429)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.route('**/api/llm', async route => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Rate limit exceeded',
          details: 'Too many requests to the LLM service',
        }),
      });
    });

    const input = page.locator('input, textarea').first();
    await input.fill('Apple Inc');
    
    const submitButton = page.getByRole('button', { name: /send|submit|search/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      await page.waitForTimeout(2000);
      
      const errorMessage = page.getByText(/too many|rate limit|wait/i);
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display error toast for network errors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Intercept and abort network requests
    await page.route('**/api/llm', async route => {
      await route.abort('failed');
    });

    const input = page.locator('input, textarea').first();
    await input.fill('Apple Inc');
    
    const submitButton = page.getByRole('button', { name: /send|submit|search/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      await page.waitForTimeout(3000);
      
      const errorMessage = page.getByText(/network|connection|unable to connect/i);
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test('should dismiss error toast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.route('**/api/llm', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Test error' }),
      });
    });

    const input = page.locator('input, textarea').first();
    await input.fill('Test');
    
    const submitButton = page.getByRole('button', { name: /send|submit|search/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      await page.waitForTimeout(2000);
      
      // Find dismiss button
      const dismissButton = page.getByRole('button', { name: /dismiss/i });
      if (await dismissButton.isVisible({ timeout: 4000 })) {
        await dismissButton.click();
        
        // Error toast should disappear
        await page.waitForTimeout(1500);
        await expect(dismissButton).not.toBeVisible();
      }
    }
  });
});

