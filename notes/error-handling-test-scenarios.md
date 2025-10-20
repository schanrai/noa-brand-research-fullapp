# Error Handling Test Scenarios

## Overview
This document outlines comprehensive testing scenarios for the enhanced error handling system implemented in the brand research application.

## Test Categories

### 1. **Validation Errors (400 Status)**

#### Test Cases:
- **SQL Injection**: `Company'; DROP TABLE--`
- **XSS Attempts**: `<script>alert('test')</script>`
- **Template Injection**: `${process.env.API_KEY}`
- **JSON Injection**: `{"TEST": "VALUE"}`
- **Repeated Characters**: `aaaaaaaaaaa`
- **Special Characters**: `Company@#$%^&*()`

#### Expected Behavior:
- Error message: `"[CompanyName]" contains invalid characters or patterns. Please use a valid company name without special characters.`
- No retry button (validation errors are not retryable)
- Toast should dismiss normally

#### Manual Testing Steps:
1. Enter malicious input in company name field
2. Submit the form
3. Verify error toast appears with specific message
4. Verify no retry button is shown
5. Test dismiss functionality

### 2. **Server Errors (500 Status)**

#### Test Cases:
- **LLM Service Down**: Simulate API service unavailable
- **Network Timeout**: Simulate slow/unreliable connection
- **Internal Server Error**: Simulate backend processing failure

#### Expected Behavior:
- Error message: `"Our research service is temporarily unavailable. Please try again in a few moments."`
- Retry button should be visible
- Retry should reload the page

#### Manual Testing Steps:
1. Disconnect internet connection
2. Enter valid company name (e.g., "Apple")
3. Submit the form
4. Verify error toast with retry button
5. Test retry functionality

### 3. **Rate Limiting (429 Status)**

#### Test Cases:
- **Too Many Requests**: Rapid successive API calls
- **API Quota Exceeded**: Simulate rate limit hit

#### Expected Behavior:
- Error message: `"Too many requests. Please wait a moment before trying again."`
- Retry button should be visible
- Retry should reload the page

#### Manual Testing Steps:
1. Make multiple rapid requests
2. Verify rate limit error appears
3. Test retry functionality

### 4. **Network Errors**

#### Test Cases:
- **No Internet Connection**: Disconnect from network
- **DNS Resolution Failure**: Invalid API endpoint
- **Connection Timeout**: Slow network conditions

#### Expected Behavior:
- Error message: `"Unable to connect to our research service. Please check your internet connection and try again."`
- Retry button should be visible
- Retry should reload the page

#### Manual Testing Steps:
1. Disconnect internet
2. Enter valid company name
3. Submit form
4. Verify network error message
5. Test retry functionality

### 5. **No Data Found (LLM Returns Empty)**

#### Test Cases:
- **Non-existent Company**: `FakeBusinessName2024`
- **Misspelled Company**: `Appel` (instead of Apple)
- **Too New/Private Company**: `BrandNewStartup2024`

#### Expected Behavior:
- Error message: `"We couldn't find reliable information about '[CompanyName]'. Try using the company's official legal name or check for typos."`
- No retry button (data not found is not retryable)
- Toast should dismiss normally

#### Manual Testing Steps:
1. Enter non-existent company name
2. Submit form
3. Verify "no data found" error message
4. Test dismiss functionality

## Automated Testing Scenarios

### Browser Console Testing

#### Test Error Message Function:
```javascript
// Test the getErrorMessage function directly
const testCases = [
  { companyName: "TestCompany", error: { status: 400 } },
  { companyName: "TestCompany", error: { status: 500 } },
  { companyName: "TestCompany", error: { status: 429 } },
  { companyName: "TestCompany", error: { message: "network error" } },
  { companyName: "TestCompany", error: { message: "LLM request failed" } },
  { companyName: "TestCompany", error: null }
];

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}:`, getErrorMessage(testCase.companyName, testCase.error));
});
```

#### Simulate Error States:
```javascript
// Simulate different error states
const simulateError = (errorType) => {
  const errorToast = {
    show: true,
    message: getErrorMessage("TestCompany", errorType)
  };
  
  // Trigger error toast display
  window.dispatchEvent(new CustomEvent('showErrorToast', { detail: errorToast }));
};

// Test different error types
simulateError({ status: 400 }); // Validation error
simulateError({ status: 500 }); // Server error
simulateError({ status: 429 }); // Rate limit
simulateError({ message: "network error" }); // Network error
```

### API Testing

#### Test Backend Error Responses:
```bash
# Test validation error
curl -X POST http://localhost:3000/api/llm \
  -H "Content-Type: application/json" \
  -d '{"prompt": "<script>alert(\"test\")</script>"}'

# Expected: 400 status with "Invalid input detected"

# Test with skipValidation (should work)
curl -X POST http://localhost:3000/api/llm \
  -H "Content-Type: application/json" \
  -d '{"prompt": "<script>alert(\"test\")</script>", "skipValidation": true}'

# Expected: 200 status with LLM response
```

## Test Data Sets

### Valid Company Names (Should Work):
- Apple
- Microsoft
- Google
- Johnson & Johnson
- Procter & Gamble
- General Electric

### Invalid Company Names (Should Trigger Validation):
- `<script>alert('test')</script>`
- `Company'; DROP TABLE--`
- `${process.env.API_KEY}`
- `{"TEST": "VALUE"}`
- `aaaaaaaaaaa`
- `Company@#$%^&*()`

### Non-existent Companies (Should Trigger No Data Error):
- FakeBusinessName2024
- NonExistentCorp2024
- ImaginaryCompanyLLC
- TestBusinessName2024

## Testing Checklist

### ✅ Frontend Error Handling
- [ ] Error toast displays with correct message
- [ ] Retry button appears for retryable errors
- [ ] Retry button hidden for non-retryable errors
- [ ] Dismiss button works correctly
- [ ] Error toast styling is correct
- [ ] Error toast positioning is correct

### ✅ Backend Error Handling
- [ ] 400 errors return proper validation message
- [ ] 500 errors return proper server error message
- [ ] 429 errors return proper rate limit message
- [ ] Network errors return proper connection message
- [ ] Error responses include proper status codes
- [ ] Error responses include helpful details

### ✅ Error Message Quality
- [ ] Messages are user-friendly
- [ ] Messages are specific to error type
- [ ] Messages provide actionable guidance
- [ ] Messages don't expose technical details
- [ ] Messages are consistent across error types

### ✅ Retry Functionality
- [ ] Retry button only appears for retryable errors
- [ ] Retry button reloads page correctly
- [ ] Retry button has proper styling
- [ ] Retry functionality works as expected

## Performance Testing

### Error Handling Performance:
- [ ] Error messages display quickly (< 100ms)
- [ ] Error toast animations are smooth
- [ ] No memory leaks from error handling
- [ ] Error handling doesn't impact normal flow

## Security Testing

### Error Message Security:
- [ ] Error messages don't expose sensitive information
- [ ] Error messages don't reveal system internals
- [ ] Error messages are sanitized properly
- [ ] No information leakage in error responses

## Browser Compatibility

### Error Handling Across Browsers:
- [ ] Chrome: Error toasts display correctly
- [ ] Firefox: Error toasts display correctly
- [ ] Safari: Error toasts display correctly
- [ ] Edge: Error toasts display correctly
- [ ] Mobile browsers: Error toasts display correctly

## Accessibility Testing

### Error Handling Accessibility:
- [ ] Error messages are screen reader accessible
- [ ] Error toasts have proper ARIA labels
- [ ] Error toasts are keyboard navigable
- [ ] Error toasts have proper focus management
- [ ] Error toasts meet color contrast requirements

## Regression Testing

### Ensure No Breaking Changes:
- [ ] Normal company search still works
- [ ] Valid companies still return data
- [ ] Existing error handling still works
- [ ] No new errors introduced
- [ ] Performance is maintained

## Test Results Template

```
Test Case: [Error Type]
Input: [Test Input]
Expected: [Expected Behavior]
Actual: [Actual Behavior]
Status: [PASS/FAIL]
Notes: [Additional Notes]
```

## Continuous Testing

### Automated Tests to Implement:
1. Unit tests for `getErrorMessage` function
2. Integration tests for error toast component
3. API tests for error response formats
4. E2E tests for error handling flow
5. Performance tests for error handling

### Monitoring:
1. Error rate monitoring
2. Error message effectiveness tracking
3. User retry behavior analysis
4. Error handling performance metrics
