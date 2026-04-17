// __tests__/validation.test.js
// Exp 07 — Unit tests for input validation functions

import {
  isEmailValid,
  isPasswordStrong,
  isNotEmpty,
  isMobileValid,
} from '../utils/validation';

// Email tests
test('valid email test', () => {
  expect(isEmailValid('harshit@calloryx.ai')).toBe(true);
});

test('invalid email test - missing @', () => {
  expect(isEmailValid('harshitcalloryx.ai')).toBe(false);
});

// Password tests
test('strong password - 6 or more characters', () => {
  expect(isPasswordStrong('secure123')).toBe(true);
});

test('weak password - less than 6 characters', () => {
  expect(isPasswordStrong('abc')).toBe(false);
});

// Empty field tests
test('non-empty value returns true', () => {
  expect(isNotEmpty('Harshit')).toBe(true);
});

test('empty or whitespace value returns false', () => {
  expect(isNotEmpty('   ')).toBe(false);
});

// Mobile tests
test('valid 10 digit mobile number', () => {
  expect(isMobileValid('9876543210')).toBe(true);
});

test('invalid mobile number - less than 10 digits', () => {
  expect(isMobileValid('98765')).toBe(false);
});
