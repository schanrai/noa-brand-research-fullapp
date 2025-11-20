# Testing Infrastructure

This document describes the testing infrastructure set up for pre-launch testing.

## Overview

The project uses a comprehensive testing setup with:
- **Vitest** + **React Testing Library** for unit and component tests
- **Playwright** for end-to-end (E2E) tests

## Test Structure

```
├── __tests__/           # Unit and component tests
│   ├── lib/            # Utility function tests
│   ├── components/     # React component tests
│   └── api/            # API route tests
├── e2e/                # End-to-end tests
│   ├── auth.spec.ts
│   ├── input-validation.spec.ts
│   └── error-handling.spec.ts
└── test/               # Test utilities and setup
    ├── setup.ts
    └── test-utils.tsx
```

## Running Tests

### Unit/Component Tests (Vitest)

```bash
# Run all unit/component tests
npm run test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI (interactive)
npm run test:ui
```

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI (interactive)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed
```

### Run All Tests

```bash
# Run both unit and E2E tests
npm run test:all

# Pre-launch checklist (runs lint, unit tests, and E2E tests)
npm run pre-launch
```

## Test Coverage

### Unit Tests

- **Input Validation** (`__tests__/lib/input-validator.test.ts`)
  - SQL injection detection
  - XSS detection
  - Template injection detection
  - JSON injection detection
  - Pattern detection (repeated characters, gibberish)
  - Company/Region/Division name validation
  - Comprehensive security validation

- **Utilities** (`__tests__/lib/utils.test.ts`)
  - className utility (cn)
  - Currency formatting

### Component Tests

- **Error Toast** (`__tests__/components/error-toast.test.tsx`)
  - Error message display
  - Dismiss functionality
  - Retry button visibility and functionality
  - Styling verification

### API Route Tests

- **LLM Route** (`__tests__/api/llm-route.test.ts`)
  - Input validation (400 errors)
  - Rate limiting (429 errors)
  - Server errors (500 errors)
  - Network errors
  - Successful responses
  - Skip validation flag

### E2E Tests

- **Authentication Flow** (`e2e/auth.spec.ts`)
  - Login page display
  - Form validation
  - Password length validation
  - Sign in/sign up toggle

- **Input Validation** (`e2e/input-validation.spec.ts`)
  - SQL injection blocking
  - XSS blocking
  - Template injection blocking
  - JSON injection blocking
  - Repeated characters blocking
  - Valid input acceptance
  - Edge cases (empty, whitespace, long input)

- **Error Handling** (`e2e/error-handling.spec.ts`)
  - Validation error display (400)
  - Server error display with retry (500)
  - Rate limit error display (429)
  - Network error display
  - Error toast dismissal

## Pre-Launch Testing Checklist

Based on your testing scenarios, ensure these areas are covered:

### ✅ Security Testing
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] Template injection protection
- [ ] Prompt injection protection
- [ ] JSON injection protection

### ✅ Input Validation
- [ ] Empty input handling
- [ ] Whitespace-only input
- [ ] Extremely long input
- [ ] Special characters
- [ ] Repeated characters
- [ ] Gibberish detection

### ✅ Error Handling
- [ ] Validation errors (400) - no retry
- [ ] Server errors (500) - with retry
- [ ] Rate limit errors (429) - with retry
- [ ] Network errors - with retry
- [ ] Empty/no data responses
- [ ] Error toast dismissal

### ✅ User Flows
- [ ] Authentication flow
- [ ] Research input flow
- [ ] Error recovery
- [ ] Navigation between pages

## Writing New Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { validateCompanyName } from '@/lib/input-validator';

describe('validateCompanyName', () => {
  it('should validate legitimate company names', () => {
    const result = validateCompanyName('Apple Inc');
    expect(result.isValid).toBe(true);
  });
});
```

### Component Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import MyComponent from '@/components/my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should display login page', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('h1')).toBeVisible();
});
```

## Configuration Files

- **`vitest.config.ts`** - Vitest configuration with Next.js support
- **`playwright.config.ts`** - Playwright configuration for E2E tests
- **`test/setup.ts`** - Test setup with mocks and utilities
- **`test/test-utils.tsx`** - Custom render function with providers

## Pre-Launch Testing

Before deploying to production, run the pre-launch test script:

```bash
npm run pre-launch
```

This script will:
1. Run all unit & component tests
2. Run all end-to-end tests

If all tests pass, you're ready for launch! 🚀

If any tests fail, the script will exit with an error code to prevent accidental deployment.

## Continuous Integration (Optional)

For CI/CD pipelines, use:

```bash
# Run tests in CI mode
CI=true npm run test
CI=true npm run test:e2e
```

Playwright will automatically use CI settings (retries, workers, etc.) when `CI` environment variable is set.

**Note**: This project uses manual pre-launch testing. For automatic CI, you can set up GitHub Actions workflows later if needed.

## Debugging Tests

### Vitest

```bash
# Run with debugging output
npm run test -- --reporter=verbose

# Run specific test file
npm run test -- __tests__/lib/input-validator.test.ts
```

### Playwright

```bash
# Run with headed browser and debug mode
npm run test:e2e:headed -- --debug

# Run specific test file
npm run test:e2e -- e2e/auth.spec.ts

# Run with trace
npm run test:e2e -- --trace on
```

## Notes

- E2E tests require the dev server to be running (handled automatically by Playwright config)
- Some E2E tests may need adjustment based on actual component selectors and behavior
- Mock Supabase authentication in tests as needed
- Network interception in E2E tests allows testing error scenarios

