import { describe, it, expect } from 'vitest';
import { sanitizeText, validateNumber, isValidDateKey, safeJsonParse } from '../utils/sanitize';

describe('sanitizeText', () => {
  it('should return empty string for non-string input', () => {
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
    expect(sanitizeText(123)).toBe('');
  });

  it('should escape HTML angle brackets', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).not.toContain('<script>');
    expect(sanitizeText('<b>bold</b>')).toBe('&lt;b&gt;bold&lt;&#x2F;b&gt;');
  });

  it('should escape ampersands', () => {
    expect(sanitizeText('a & b')).toBe('a &amp; b');
  });

  it('should escape double quotes', () => {
    expect(sanitizeText('"hello"')).toBe('&quot;hello&quot;');
  });

  it('should escape single quotes', () => {
    expect(sanitizeText("it's")).toBe('it&#x27;s');
  });

  it('should escape forward slashes', () => {
    expect(sanitizeText('a/b')).toBe('a&#x2F;b');
  });

  it('should return plain text unchanged', () => {
    expect(sanitizeText('Hello World')).toBe('Hello World');
  });

  it('should handle empty string', () => {
    expect(sanitizeText('')).toBe('');
  });
});

describe('validateNumber', () => {
  it('should return the number when within range', () => {
    expect(validateNumber(5, 0, 10)).toBe(5);
  });

  it('should clamp to min when below range', () => {
    expect(validateNumber(-5, 0, 10)).toBe(0);
  });

  it('should clamp to max when above range', () => {
    expect(validateNumber(15, 0, 10)).toBe(10);
  });

  it('should return fallback for NaN', () => {
    expect(validateNumber('abc', 0, 10, 99)).toBe(99);
  });

  it('should return fallback for undefined', () => {
    expect(validateNumber(undefined, 0, 100, 42)).toBe(42);
  });

  it('should clamp Infinity to max', () => {
    expect(validateNumber(Infinity, 0, 100, 0)).toBe(100);
  });

  it('should handle float values', () => {
    expect(validateNumber(3.7, 0, 10)).toBe(3.7);
  });

  it('should default fallback to 0', () => {
    expect(validateNumber('bad', 0, 10)).toBe(0);
  });
});

describe('isValidDateKey', () => {
  it('should return true for valid ISO date strings', () => {
    expect(isValidDateKey('2024-06-14')).toBe(true);
    expect(isValidDateKey('2000-01-01')).toBe(true);
  });

  it('should return false for invalid formats', () => {
    expect(isValidDateKey('14-06-2024')).toBe(false);
    expect(isValidDateKey('2024/06/14')).toBe(false);
    expect(isValidDateKey('not-a-date')).toBe(false);
  });

  it('should return false for non-string input', () => {
    expect(isValidDateKey(null)).toBe(false);
    expect(isValidDateKey(20240614)).toBe(false);
    expect(isValidDateKey(undefined)).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidDateKey('')).toBe(false);
  });

  it('should return false for invalid calendar dates', () => {
    expect(isValidDateKey('2024-13-01')).toBe(false);
  });
});

describe('safeJsonParse', () => {
  it('should parse valid JSON', () => {
    expect(safeJsonParse('{"key":"value"}')).toEqual({ key: 'value' });
    expect(safeJsonParse('[1, 2, 3]')).toEqual([1, 2, 3]);
  });

  it('should return fallback for invalid JSON', () => {
    expect(safeJsonParse('not json')).toBeNull();
    expect(safeJsonParse('{bad json}', 'fallback')).toBe('fallback');
  });

  it('should return fallback for empty string', () => {
    expect(safeJsonParse('', 'default')).toBe('default');
  });

  it('should return fallback for null input', () => {
    expect(safeJsonParse(null, [])).toEqual([]);
  });

  it('should parse primitive JSON values', () => {
    expect(safeJsonParse('42')).toBe(42);
    expect(safeJsonParse('"hello"')).toBe('hello');
    expect(safeJsonParse('true')).toBe(true);
  });
});
