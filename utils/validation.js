// utils/validation.js
// Exp 07 — Input validation utility functions to be unit tested with Jest

// Email validation using regex
export const isEmailValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Password must be at least 6 characters
export const isPasswordStrong = (password) => {
  return password.length >= 6;
};

// Empty field check
export const isNotEmpty = (value) => {
  return value.trim().length > 0;
};

// Mobile number — exactly 10 digits
export const isMobileValid = (mobile) => {
  return /^[0-9]{10}$/.test(mobile);
};
