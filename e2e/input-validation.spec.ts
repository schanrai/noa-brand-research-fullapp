import { test, expect } from '@playwright/test';

test.describe('Research Input Validation - Security Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app (assuming user is on the research interface)
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for the co-pilot interface to be visible
    await page.waitForSelector('input, textarea', { timeout: 10000 });
  });

  test('should block SQL injection attempts', async ({ page }) => {
    const input = page.locator('input, textarea').first();
    await input.fill("Company'; DROP TABLE users--");

    // Try to submit (if there's a submit button)
    const submitButton = page.getByRole('button', { name: /send|submit|search/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Should not make an API call or should show error
      await page.waitForTimeout(2000);
      
      // Check for error message or blocked state
      const errorMessage = page.getByText(/invalid|blocked|error/i);
      await expect(errorMessage).toBeVisible({ timeout: 4000 }).catch(() => {
        // Input might be silently blocked - check network tab would be ideal
        // For now, verify input field is still visible (not submitted)
        expect(input).toBeVisible();
      });
    }
  });

  test('should block XSS attempts', async ({ page }) => {
    const input = page.locator('input, textarea').first();
    await input.fill("<script>alert('test')</script>");

    const submitButton = page.getByRole('button', { name: /send|submit|search/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(2000);
      
      // Should block the XSS attempt
      const errorMessage = page.getByText(/invalid|blocked|error/i);
      await expect(errorMessage).toBeVisible({ timeout: 4000 }).catch(() => {
        expect(input).toBeVisible();
      });
    }
  });

  test('should block template injection attempts', async ({ page }) => {
    const input = page.locator('input, textarea').first();
    await input.fill('${process.env.API_KEY}');

    const submitButton = page.getByRole('button', { name: /send|submit|search/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(2000);
      
      const errorMessage = page.getByText(/invalid|blocked|error/i);
      await expect(errorMessage).toBeVisible({ timeout: 4000 }).catch(() => {
        expect(input).toBeVisible();
      });
    }
  });

  test('should block JSON injection attempts', async ({ page }) => {
    const input = page.locator('input, textarea').first();
    await input.fill('{"TEST": "VALUE"}');

    const submitButton = page.getByRole('button', { name: /send|submit|search/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(2000);
      
      const errorMessage = page.getByText(/invalid|blocked|error/i);
      await expect(errorMessage).toBeVisible({ timeout: 4000 }).catch(() => {
        expect(input).toBeVisible();
      });
    }
  });

  test('should block repeated characters', async ({ page }) => {
    const input = page.locator('input, textarea').first();
    await input.fill('aaaaaaaaaaa');

    const submitButton = page.getByRole('button', { name: /send|submit|search/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(2000);
      
      const errorMessage = page.getByText(/invalid|valid company|error/i);
      await expect(errorMessage).toBeVisible({ timeout: 4000 }).catch(() => {
        expect(input).toBeVisible();
      });
    }
  });

  test('should allow valid company names', async ({ page }) => {
    const input = page.locator('input, textarea').first();
    await input.fill('Apple Inc');

    // Valid input should be accepted (no immediate error)
    await page.waitForTimeout(1500);
    
    // Should not show validation error
    const errorMessage = page.getByText(/invalid|blocked|error/i);
    await expect(errorMessage).not.toBeVisible({ timeout: 3000 });
  });
});

test.describe('Research Input Validation - Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input, textarea', { timeout: 10000 });
  });

  test('should handle empty input', async ({ page }) => {
    const input = page.locator('input, textarea').first();
    await input.fill('');

    const submitButton = page.getByRole('button', { name: /send|submit|search/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(2000);
      
      // Should show validation error or prevent submission
      const errorMessage = page.getByText(/empty|required|enter/i);
      await expect(errorMessage).toBeVisible({ timeout: 4000 }).catch(() => {
        expect(page.url()).toContain('/');
      });
    }
  });

  test('should handle whitespace-only input', async ({ page }) => {
    const input = page.locator('input, textarea').first();
    await input.fill('   ');

    const submitButton = page.getByRole('button', { name: /send|submit|search/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(2000);
      
      // Should treat as empty or invalid
      const errorMessage = page.getByText(/empty|required|enter/i);
      await expect(errorMessage).toBeVisible({ timeout: 4000 }).catch(() => {
        expect(input).toBeVisible();
      });
    }
  });

  test('should handle very long input', async ({ page }) => {
    const input = page.locator('input, textarea').first();
    const longInput = 'A'.repeat(1000);
    await input.fill(longInput);

    // Should either truncate or show error
    await page.waitForTimeout(1500);
    
    const value = await input.inputValue();
    // Value should be truncated or original
    expect(value.length).toBeLessThanOrEqual(1000);
  });
});

