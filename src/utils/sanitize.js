/**
 * @fileoverview Input sanitization utilities for security.
 * Prevents XSS attacks by sanitizing user-provided text before use.
 */

/**
 * Strips dangerous HTML characters from a string to prevent XSS.
 * @param {string} input - Raw user input.
 * @returns {string} Sanitized string safe for rendering.
 */
export function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates and clamps a numeric value within a safe range.
 * Prevents out-of-bounds values from corrupting stored state.
 * @param {*} value - The value to validate.
 * @param {number} min - Minimum allowed value.
 * @param {number} max - Maximum allowed value.
 * @param {number} fallback - Value returned if validation fails.
 * @returns {number} Validated and clamped number.
 */
export function validateNumber(value, min, max, fallback = 0) {
  const num = parseFloat(value);
  if (Number.isNaN(num)) return fallback;
  return Math.min(Math.max(num, min), max);
}

/**
 * Validates that a string is a real ISO date (YYYY-MM-DD).
 * Prevents malformed date keys from polluting the dailyActions store.
 * @param {string} dateStr - The date string to validate.
 * @returns {boolean} True if valid ISO date format.
 */
export function isValidDateKey(dateStr) {
  if (typeof dateStr !== 'string') return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !Number.isNaN(Date.parse(dateStr));
}

/**
 * Safely parses JSON without throwing.
 * @param {string} raw - Raw JSON string.
 * @param {*} fallback - Value returned on parse failure.
 * @returns {*} Parsed value or fallback.
 */
export function safeJsonParse(raw, fallback = null) {
  if (raw === null || raw === undefined) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
