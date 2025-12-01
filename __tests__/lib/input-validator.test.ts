import { describe, it, expect } from 'vitest';
import {
  detectSQLInjection,
  detectXSS,
  detectTemplateInjection,
  detectPromptInjection,
  detectJsonInjection,
  detectRepeatedCharacters,
  detectGibberish,
  detectInvalidLength,
  validateCompanyName,
  validateRegionName,
  validateDivisionName,
  validateNumericChoice,
  isInputSafe,
  validatePrompt,
} from '@/lib/input-validator';

describe('Input Validator - SQL Injection Detection', () => {
  it('should detect basic SQL injection patterns', () => {
    expect(detectSQLInjection("Company'; DROP TABLE users--")).toBe(true);
    expect(detectSQLInjection('OR 1=1')).toBe(true); // Matches the actual pattern
    expect(detectSQLInjection('or 1=1')).toBe(true); // Case insensitive
    expect(detectSQLInjection('UNION SELECT * FROM users')).toBe(true);
    expect(detectSQLInjection("'; DELETE FROM users--")).toBe(true);
    // Test with case-insensitive matching
    expect(detectSQLInjection('drop table users')).toBe(true);
    expect(detectSQLInjection('SELECT * FROM users')).toBe(true);
  });

  it('should allow valid company names', () => {
    expect(detectSQLInjection('Apple Inc')).toBe(false);
    expect(detectSQLInjection('Microsoft Corporation')).toBe(false);
    expect(detectSQLInjection('Johnson & Johnson')).toBe(false);
  });
});

describe('Input Validator - XSS Detection', () => {
  it('should detect XSS script tags', () => {
    expect(detectXSS("<script>alert('test')</script>")).toBe(true);
    expect(detectXSS('<img onerror="alert(1)">')).toBe(true);
    expect(detectXSS('javascript:alert(1)')).toBe(true);
    expect(detectXSS('<iframe src="evil.com"></iframe>')).toBe(true);
  });

  it('should allow valid company names', () => {
    expect(detectXSS('Apple Inc')).toBe(false);
    expect(detectXSS('Microsoft Corporation')).toBe(false);
  });
});

describe('Input Validator - Template Injection Detection', () => {
  it('should detect template injection patterns', () => {
    expect(detectTemplateInjection('${process.env.API_KEY}')).toBe(true);
    expect(detectTemplateInjection('{{malicious}}')).toBe(true);
    expect(detectTemplateInjection('<% code %>')).toBe(true);
  });

  it('should allow valid company names', () => {
    expect(detectTemplateInjection('Apple Inc')).toBe(false);
  });
});

describe('Input Validator - JSON Injection Detection', () => {
  it('should detect JSON-like input', () => {
    expect(detectJsonInjection('{"TEST": "VALUE"}')).toBe(true);
    expect(detectJsonInjection('["test", "value"]')).toBe(true);
    expect(detectJsonInjection('{"test": "value"}')).toBe(true);
  });

  it('should allow valid company names', () => {
    expect(detectJsonInjection('Apple Inc')).toBe(false);
  });
});

describe('Input Validator - Pattern Detection', () => {
  it('should detect repeated characters', () => {
    expect(detectRepeatedCharacters('aaaaa')).toBe(true);
    expect(detectRepeatedCharacters('Apple')).toBe(false);
  });

  it('should detect invalid length', () => {
    expect(detectInvalidLength('')).toBe(true);
    expect(detectInvalidLength('a')).toBe(true);
    expect(detectInvalidLength('ab')).toBe(false);
    expect(detectInvalidLength('Apple')).toBe(false);
  });
});

describe('Input Validator - Company Name Validation', () => {
  it('should validate legitimate company names', () => {
    const result1 = validateCompanyName('Apple Inc');
    expect(result1.isValid).toBe(true);
    expect(result1.blocked).toBe(false);

    const result2 = validateCompanyName('Microsoft Corporation');
    expect(result2.isValid).toBe(true);
    expect(result2.blocked).toBe(false);

    const result3 = validateCompanyName('Johnson & Johnson');
    expect(result3.isValid).toBe(true);
  });

  it('should block SQL injection attempts', () => {
    const result = validateCompanyName("Company'; DROP TABLE--");
    expect(result.isValid).toBe(false);
    expect(result.blocked).toBe(true);
  });

  it('should block XSS attempts', () => {
    const result = validateCompanyName("<script>alert('test')</script>");
    expect(result.isValid).toBe(false);
    expect(result.blocked).toBe(true);
  });

  it('should block template injection attempts', () => {
    const result = validateCompanyName('${process.env.API_KEY}');
    expect(result.isValid).toBe(false);
    expect(result.blocked).toBe(true);
  });

  it('should block JSON injection attempts', () => {
    const result = validateCompanyName('{"TEST": "VALUE"}');
    expect(result.isValid).toBe(false);
    expect(result.blocked).toBe(true);
  });

  it('should block repeated characters', () => {
    const result = validateCompanyName('aaaaaaaaaaa');
    expect(result.isValid).toBe(false);
    expect(result.blocked).toBe(true);
  });

  it('should reject empty input', () => {
    const result = validateCompanyName('');
    expect(result.isValid).toBe(false);
    expect(result.blocked).toBe(false);
  });

  it('should reject too short input', () => {
    const result = validateCompanyName('a');
    expect(result.isValid).toBe(false);
    expect(result.blocked).toBe(true);
  });
});

describe('Input Validator - isInputSafe', () => {
  it('should return true for safe input', () => {
    expect(isInputSafe('Apple Inc')).toBe(true);
    expect(isInputSafe('Microsoft Corporation')).toBe(true);
  });

  it('should return false for unsafe input', () => {
    expect(isInputSafe("Company'; DROP TABLE--")).toBe(false);
    expect(isInputSafe("<script>alert('test')</script>")).toBe(false);
    expect(isInputSafe('${process.env.API_KEY}')).toBe(false);
    expect(isInputSafe('{"TEST": "VALUE"}')).toBe(false);
    expect(isInputSafe('aaaaaaaaaaa')).toBe(false);
  });
});

describe('Input Validator - Prompt Validation', () => {
  it('should validate safe prompts', () => {
    const result = validatePrompt('Research company Apple Inc');
    expect(result.isValid).toBe(true);
    expect(result.blocked).toBe(false);
  });

  it('should block prompts with SQL injection', () => {
    const result = validatePrompt("Company'; DROP TABLE--");
    expect(result.isValid).toBe(false);
    expect(result.blocked).toBe(true);
  });

  it('should block prompts with XSS', () => {
    const result = validatePrompt("<script>alert('test')</script>");
    expect(result.isValid).toBe(false);
    expect(result.blocked).toBe(true);
  });
});

describe('Input Validator - Numeric Choice Validation', () => {
  it('should validate correct numeric choices', () => {
    const result = validateNumericChoice('1', ['1', '2', '3']);
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid numeric choices', () => {
    const result = validateNumericChoice('4', ['1', '2', '3']);
    expect(result.isValid).toBe(false);
  });
});

