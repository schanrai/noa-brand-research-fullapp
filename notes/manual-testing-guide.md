# Manual Error Handling Testing Guide

## Quick Start Testing

### 1. **Start the Development Server**
```bash
npm run dev
```

### 2. **Open Browser Console**
- Press `F12` or right-click → "Inspect"
- Go to the "Console" tab

### 3. **Load the Test Utility**
Copy and paste the contents of `lib/error-handling-tester.js` into the console, then run:

```javascript
const tester = new ErrorHandlingTester();
tester.runAllTests();
```

## Manual Testing Scenarios

### **Scenario 1: Validation Errors**
1. Go to the company search interface
2. Enter malicious input: `<script>alert('test')</script>`
3. Submit the form
4. **Expected**: Error toast with message about invalid characters
5. **Expected**: No "Try Again" button

### **Scenario 2: Server Errors (Simulated)**
1. Disconnect your internet connection
2. Enter a valid company name: "Apple"
3. Submit the form
4. **Expected**: Error toast with "temporarily unavailable" message
5. **Expected**: "Try Again" button visible
6. **Test**: Click "Try Again" - should reload page

### **Scenario 3: No Data Found**
1. Reconnect internet
2. Enter non-existent company: "FakeBusinessName2024"
3. Submit the form
4. **Expected**: Error toast with "couldn't find reliable information" message
5. **Expected**: No "Try Again" button

### **Scenario 4: Rate Limiting (Simulated)**
1. Make multiple rapid requests (submit form quickly 5+ times)
2. **Expected**: Error toast with "Too many requests" message
3. **Expected**: "Try Again" button visible

## Browser Console Testing

### **Test Error Message Function**
```javascript
// Test different error scenarios
const testCases = [
  { companyName: "TestCompany", error: { status: 400 } },
  { companyName: "TestCompany", error: { status: 500 } },
  { companyName: "TestCompany", error: { status: 429 } },
  { companyName: "TestCompany", error: { message: "network error" } },
  { companyName: "TestCompany", error: null }
];

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}:`, getErrorMessage(testCase.companyName, testCase.error));
});
```

### **Simulate Error Toasts**
```javascript
// Simulate different error toasts
const simulateError = (errorType) => {
  const errorToast = {
    show: true,
    message: getErrorMessage("TestCompany", errorType)
  };
  
  // This would trigger the error toast in the real app
  console.log("Error Toast:", errorToast);
};

simulateError({ status: 400 }); // Validation error
simulateError({ status: 500 }); // Server error
simulateError({ status: 429 }); // Rate limit
simulateError({ message: "network error" }); // Network error
```

## API Testing

### **Using curl (Command Line)**
```bash
# Test validation error
curl -X POST http://localhost:3000/api/llm \
  -H "Content-Type: application/json" \
  -d '{"prompt": "<script>alert(\"test\")</script>"}'

# Expected: 400 status with "Invalid input detected"

# Test valid input
curl -X POST http://localhost:3000/api/llm \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Apple", "skipValidation": true}'

# Expected: 200 status with LLM response
```

### **Using the Test Script**
```bash
# Run the automated API test script
./scripts/test-error-handling.sh
```

## Testing Checklist

### ✅ **Error Message Quality**
- [ ] Messages are user-friendly and clear
- [ ] Messages are specific to the error type
- [ ] Messages provide actionable guidance
- [ ] Messages don't expose technical details
- [ ] Messages are consistent across error types

### ✅ **Error Toast Functionality**
- [ ] Error toast displays correctly
- [ ] Error toast has proper styling
- [ ] Error toast positioning is correct
- [ ] Dismiss button works
- [ ] Retry button appears for retryable errors
- [ ] Retry button hidden for non-retryable errors

### ✅ **Error Handling Logic**
- [ ] Validation errors (400) show correct message
- [ ] Server errors (500) show correct message
- [ ] Rate limiting (429) shows correct message
- [ ] Network errors show correct message
- [ ] No data found shows correct message
- [ ] Error handling doesn't break normal flow

### ✅ **Retry Functionality**
- [ ] Retry button only appears for retryable errors
- [ ] Retry button reloads page correctly
- [ ] Retry button has proper styling
- [ ] Retry functionality works as expected

### ✅ **Backend Error Responses**
- [ ] 400 errors return proper validation message
- [ ] 500 errors return proper server error message
- [ ] 429 errors return proper rate limit message
- [ ] Network errors return proper connection message
- [ ] Error responses include proper status codes
- [ ] Error responses include helpful details

## Common Issues to Watch For

### **Frontend Issues**
- Error toast not displaying
- Error message not updating
- Retry button not working
- Styling issues with error toast
- Error handling breaking normal flow

### **Backend Issues**
- Wrong status codes returned
- Generic error messages
- Missing error details
- Error handling not catching all cases
- API responses not properly formatted

### **Integration Issues**
- Frontend not receiving error details
- Error messages not matching between frontend/backend
- Retry functionality not working
- Error handling not consistent across components

## Performance Testing

### **Error Handling Performance**
- [ ] Error messages display quickly (< 100ms)
- [ ] Error toast animations are smooth
- [ ] No memory leaks from error handling
- [ ] Error handling doesn't impact normal flow

## Browser Compatibility

### **Error Handling Across Browsers**
- [ ] Chrome: Error toasts display correctly
- [ ] Firefox: Error toasts display correctly
- [ ] Safari: Error toasts display correctly
- [ ] Edge: Error toasts display correctly
- [ ] Mobile browsers: Error toasts display correctly

## Accessibility Testing

### **Error Handling Accessibility**
- [ ] Error messages are screen reader accessible
- [ ] Error toasts have proper ARIA labels
- [ ] Error toasts are keyboard navigable
- [ ] Error toasts have proper focus management
- [ ] Error toasts meet color contrast requirements

## Troubleshooting

### **If Error Toasts Don't Appear**
1. Check browser console for JavaScript errors
2. Verify error handling code is loaded
3. Check if error state is being set correctly
4. Verify error toast component is rendered

### **If Error Messages Are Wrong**
1. Check `getErrorMessage` function logic
2. Verify error object structure
3. Check error handling in API route
4. Verify error propagation from backend

### **If Retry Button Doesn't Work**
1. Check retry button visibility logic
2. Verify retry function implementation
3. Check if page reload is working
4. Verify error state is cleared on retry

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

### **Automated Tests to Implement**
1. Unit tests for `getErrorMessage` function
2. Integration tests for error toast component
3. API tests for error response formats
4. E2E tests for error handling flow
5. Performance tests for error handling

### **Monitoring**
1. Error rate monitoring
2. Error message effectiveness tracking
3. User retry behavior analysis
4. Error handling performance metrics
