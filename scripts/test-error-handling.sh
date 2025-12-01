#!/bin/bash

# Error Handling API Test Script
# This script tests the backend API error handling

echo "🧪 Error Handling API Tests"
echo "=========================="

BASE_URL="http://localhost:3000"
API_ENDPOINT="$BASE_URL/api/llm"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local payload="$2"
    local expected_status="$3"
    local expected_error="$4"
    
    echo -e "\n🔍 Testing: $test_name"
    echo "Payload: $payload"
    
    # Make the API call
    response=$(curl -s -w "\n%{http_code}" -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -d "$payload")
    
    # Extract status code and body
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    echo "Status Code: $status_code"
    echo "Response: $body"
    
    # Check if status code matches expected
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ Status code correct${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ Status code incorrect. Expected: $expected_status, Got: $status_code${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return
    fi
    
    # Check if error message contains expected text
    if echo "$body" | grep -q "$expected_error"; then
        echo -e "${GREEN}✅ Error message correct${NC}"
    else
        echo -e "${RED}❌ Error message incorrect. Expected to contain: $expected_error${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Test 1: Validation Error (SQL Injection)
run_test "SQL Injection" \
    '{"prompt": "Company'\''; DROP TABLE--"}' \
    "400" \
    "Invalid input detected"

# Test 2: Validation Error (XSS)
run_test "XSS Attempt" \
    '{"prompt": "<script>alert('\''test'\'')</script>"}' \
    "400" \
    "Invalid input detected"

# Test 3: Validation Error (Template Injection)
run_test "Template Injection" \
    '{"prompt": "${process.env.API_KEY}"}' \
    "400" \
    "Invalid input detected"

# Test 4: Validation Error (JSON Injection)
run_test "JSON Injection" \
    '{"prompt": "{\"TEST\": \"VALUE\"}"}' \
    "400" \
    "Invalid input detected"

# Test 5: Validation Error (Repeated Characters)
run_test "Repeated Characters" \
    '{"prompt": "aaaaaaaaaaa"}' \
    "400" \
    "Invalid input detected"

# Test 6: Valid Input (Should Work)
run_test "Valid Input" \
    '{"prompt": "Apple", "skipValidation": true}' \
    "200" \
    "result"

# Test 7: Valid Input with Skip Validation
run_test "Skip Validation" \
    '{"prompt": "<script>alert('\''test'\'')</script>", "skipValidation": true}' \
    "200" \
    "result"

# Test 8: Empty Prompt
run_test "Empty Prompt" \
    '{"prompt": ""}' \
    "400" \
    "Invalid input detected"

# Test 9: Missing Prompt Field
run_test "Missing Prompt" \
    '{}' \
    "400" \
    "Invalid input detected"

# Test 10: Invalid JSON
echo -e "\n🔍 Testing: Invalid JSON"
echo "Payload: {invalid json}"

response=$(curl -s -w "\n%{http_code}" -X POST "$API_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{invalid json}")

status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

echo "Status Code: $status_code"
echo "Response: $body"

if [ "$status_code" = "400" ]; then
    echo -e "${GREEN}✅ Invalid JSON handled correctly${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ Invalid JSON not handled correctly${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# Summary
echo -e "\n📊 Test Summary"
echo "==============="
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"

total_tests=$((TESTS_PASSED + TESTS_FAILED))
if [ $total_tests -gt 0 ]; then
    success_rate=$((TESTS_PASSED * 100 / total_tests))
    echo -e "Success Rate: ${success_rate}%"
fi

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n🎉 All tests passed!"
    exit 0
else
    echo -e "\n❌ Some tests failed. Check the output above."
    exit 1
fi
