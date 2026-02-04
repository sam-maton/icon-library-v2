#!/bin/bash

# Test script for Better Auth integration
# This script tests the authentication endpoints

BASE_URL="http://localhost:3000"

echo "========================================"
echo "Better Auth Integration Test"
echo "========================================"
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "---------------------"
RESPONSE=$(curl -s "${BASE_URL}/health")
echo "Response: $RESPONSE"
echo ""

# Test 2: Sign Up
echo "Test 2: User Sign Up"
echo "---------------------"
SIGNUP_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"TestPassword123","name":"Test User"}')
echo "Response: $SIGNUP_RESPONSE"
echo ""

# Test 3: Sign In
echo "Test 3: User Sign In"
echo "---------------------"
SIGNIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"TestPassword123"}')
echo "Response: $SIGNIN_RESPONSE"
echo ""

# Test 4: Invalid Password
echo "Test 4: Sign In with Invalid Password"
echo "--------------------------------------"
INVALID_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"WrongPassword"}')
echo "Response: $INVALID_RESPONSE"
echo ""

# Test 5: Better Auth Native Endpoints
echo "Test 5: Better Auth Native Sign Up"
echo "-----------------------------------"
NATIVE_SIGNUP=$(curl -s -X POST "${BASE_URL}/api/auth/sign-up/email" \
  -H "Content-Type: application/json" \
  -d '{"email":"nativeuser@example.com","password":"NativePass123","name":"Native User"}')
echo "Response: $NATIVE_SIGNUP"
echo ""

echo "Test 6: Better Auth Native Sign In"
echo "-----------------------------------"
NATIVE_SIGNIN=$(curl -s -X POST "${BASE_URL}/api/auth/sign-in/email" \
  -H "Content-Type: application/json" \
  -d '{"email":"nativeuser@example.com","password":"NativePass123"}')
echo "Response: $NATIVE_SIGNIN"
echo ""

echo "========================================"
echo "All tests completed!"
echo "========================================"
