#!/bin/bash

# Pre-Launch Testing Script
# Simple script to run all tests before deployment
# Usage: npm run pre-launch

set -e  # Exit on any error

echo ""
echo "🚀 Pre-Launch Testing"
echo "===================="
echo ""

# Step 1: Unit & Component Tests
echo "1️⃣ Running unit & component tests..."
npm run test

echo ""
echo "2️⃣ Running end-to-end tests..."
npm run test:e2e

echo ""
echo "✅ All tests passed!"
echo "🎉 Ready for launch!"
echo ""

