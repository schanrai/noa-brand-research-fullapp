# Authentication Guide for E2E Tests

## The Problem

Many of your E2E tests (especially in `input-validation.spec.ts` and `error-handling.spec.ts`) navigate to `/` and assume the user is already on the research interface. However, if the user is not authenticated, they will be redirected to `/login`.

## Solution Options

You have **three main approaches** to handle authentication in Playwright tests:

### Option 1: Mock Authentication State (Recommended for Testing)

Use Playwright's `storageState` to simulate an authenticated session. This is the fastest and most reliable approach for E2E tests.

**Steps:**

1. **Create an authenticated state file** (`e2e/.auth/user.json`):
   ```bash
   mkdir -p e2e/.auth
   ```

2. **Create a setup script** to authenticate once and save the state:
   ```typescript
   // e2e/auth-setup.ts (run once: npx playwright test auth-setup.ts)
   import { test as setup, expect } from '@playwright/test';
   import * as fs from 'fs';
   import * as path from 'path';

   const authFile = path.join(__dirname, '.auth/user.json');

   setup('authenticate', async ({ page }) => {
     // Navigate to login page
     await page.goto('/login');
     
     // Perform login (adjust selectors to match your form)
     await page.getByLabel(/email/i).fill('test@example.com');
     await page.getByLabel(/password/i).fill('testpassword');
     await page.getByRole('button', { name: /sign in/i }).click();
     
     // Wait for successful login (redirect to home page)
     await page.waitForURL('/', { timeout: 10000 });
     
     // Save authenticated state
     await page.context().storageState({ path: authFile });
   });
   ```

3. **Update `playwright.config.ts`** to use the authenticated state for tests that need it:
   ```typescript
   projects: [
     {
       name: 'setup',
       testMatch: /.*\.setup\.ts/,
     },
     {
       name: 'chromium',
       use: { 
         ...devices['Desktop Chrome'],
         // Use authenticated state for all tests in this project
         storageState: 'e2e/.auth/user.json',
       },
       dependencies: ['setup'],
     },
     // ... other browsers
   ],
   ```

4. **Run setup once**:
   ```bash
   npx playwright test auth-setup.ts
   ```

### Option 2: Authenticate Before Each Test

Add authentication to `beforeEach` hooks in tests that need it:

```typescript
test.beforeEach(async ({ page }) => {
  // Navigate to login
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  
  // Check if already logged in (if redirected away from /login)
  if (page.url().includes('/login')) {
    // Perform login
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('testpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for redirect to home page
    await page.waitForURL('/', { timeout: 10000 });
  }
  
  // Now navigate to the page you want to test
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('input, textarea', { timeout: 10000 });
});
```

**Pros:** Simple, no extra setup
**Cons:** Slower (authenticates before every test), requires real credentials

### Option 3: Mock Supabase Client in Tests

If you're using Supabase, you can mock the authentication check:

```typescript
test.beforeEach(async ({ page }) => {
  // Mock Supabase to return authenticated user
  await page.addInitScript(() => {
    // Override Supabase auth check
    window.localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: 'mock-token',
      user: { id: 'test-user-id', email: 'test@example.com' }
    }));
  });
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});
```

**Pros:** Very fast, no real auth needed
**Cons:** Less realistic, might not catch auth-related bugs

## Recommended Approach

**Use Option 1 (storageState)** because:
- ✅ Fast (authenticates once)
- ✅ Realistic (uses real authentication flow)
- ✅ Reliable (state persists across test runs)
- ✅ Can be committed to repo (if using test credentials)

## Implementation Steps

1. Check if your app requires authentication to access `/`
2. If yes, implement Option 1 above
3. Update test files that go to `/` to use the authenticated project
4. Run `auth-setup.ts` once to create the authenticated state

## Current Test Files That Need Authentication

- `e2e/input-validation.spec.ts` - All tests go to `/`
- `e2e/error-handling.spec.ts` - All tests go to `/`

These tests assume the user can access the research interface, which likely requires authentication.

