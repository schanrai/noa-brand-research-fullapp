// Input Validation Utility for Research Search
// Provides comprehensive validation for all user inputs in the co-pilot interface

export interface ValidationResult {
  isValid: boolean;
  sanitized: string;
  issues: string[];
  blocked: boolean; // true if input was completely rejected
}

export type ValidationContext = 'company' | 'region' | 'division' | 'numeric';

// =============================================================================
// PRIORITY #1: SQL INJECTION PROTECTION
// =============================================================================

/**
 * Detects SQL injection attempts in user input
 * Blocks common SQL injection patterns, keywords, and comment sequences
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    // SQL keywords
    /\b(drop|delete|insert|update|select|union|alter|create|truncate|exec|execute)\b/i,
    // SQL comment patterns
    /--\s*$/m,           // SQL line comments
    /\/\*[\s\S]*?\*\//,  // SQL block comments
    // String terminators and injection patterns
    /['"]\s*;\s*/,       // Quote followed by semicolon
    /;\s*(drop|delete|insert|update|select|union)/i, // Semicolon + SQL command
    // Common injection patterns
    /'?\s*or\s+'?\d+='?\d+/i,  // OR 1=1 type injections
    /'?\s*and\s+'?\d+='?\d+/i, // AND 1=1 type injections
    /union\s+select/i,   // UNION SELECT injections
    // Function calls
    /\b(load_file|into\s+outfile|into\s+dumpfile)\b/i,
    // Database-specific patterns
    /\b(mysql|postgresql|sqlite|mssql|oracle)\b/i,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

// =============================================================================
// XSS PROTECTION
// =============================================================================

/**
 * Detects XSS (Cross-Site Scripting) attempts in user input
 * Blocks script tags, event handlers, and javascript protocols
 */
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    // Script tags
    /<script[\s\S]*?>[\s\S]*?<\/script>/i,
    /<script/i,
    // Event handlers
    /on\w+\s*=/i,        // onclick=, onload=, onerror=, etc.
    // JavaScript protocol
    /javascript\s*:/i,
    // Data URLs that could contain scripts
    /data\s*:\s*text\/html/i,
    // Iframe tags
    /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/i,
    // Object and embed tags
    /<object[\s\S]*?>[\s\S]*?<\/object>/i,
    /<embed[\s\S]*?>/i,
    // Form tags that could be used for CSRF
    /<form[\s\S]*?>[\s\S]*?<\/form>/i,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

// =============================================================================
// TEMPLATE INJECTION PROTECTION
// =============================================================================

/**
 * Detects template injection attempts that could execute server-side code
 * Blocks template syntax from various frameworks
 */
export function detectTemplateInjection(input: string): boolean {
  const templatePatterns = [
    // JavaScript template literals
    /\$\{[^}]*\}/,
    // Ruby ERB templates
    /<%[\s\S]*?%>/,
    // Jinja2/Python templates
    /\{\{[\s\S]*?\}\}/,
    /\{%[\s\S]*?%\}/,
    // Handlebars/Mustache
    /\{\{[\s\S]*?\}\}/,
    // PHP templates
    /<\?php[\s\S]*?\?>/i,
    // JSP templates
    /<%[\s\S]*?%>/,
    // ASP.NET templates
    /<%=[\s\S]*?%>/,
    // Node.js template engines
    /#\{[\s\S]*?\}/,
  ];

  return templatePatterns.some(pattern => pattern.test(input));
}

// =============================================================================
// PROMPT INJECTION PROTECTION
// =============================================================================

/**
 * Detects prompt injection attempts that could manipulate LLM behavior
 * Blocks attempts to override system instructions or extract prompts
 */
export function detectPromptInjection(input: string): boolean {
  const promptInjectionPatterns = [
    // Instruction override attempts
    /ignore\s+(previous\s+)?instructions/i,
    /forget\s+(previous\s+)?instructions/i,
    /disregard\s+(previous\s+)?instructions/i,
    // System prompt extraction attempts
    /(show|tell|display|reveal|print)\s+(me\s+)?(your\s+)?(system\s+)?prompt/i,
    /what\s+are\s+(your\s+)?(initial\s+)?instructions/i,
    // Role switching attempts
    /you\s+are\s+now\s+(a\s+)?(different|new)\s+/i,
    /act\s+as\s+(if\s+)?you\s+are/i,
    /pretend\s+(to\s+be|that\s+you\s+are)/i,
    // Jailbreak attempts
    /(jailbreak|developer\s+mode|debug\s+mode)/i,
    // Instruction injection
    /new\s+instructions?\s*:/i,
    /additional\s+instructions?\s*:/i,
    // Prompt leaking attempts
    /(leak|extract|reveal)\s+(the\s+)?(prompt|instructions?)/i,
  ];

  return promptInjectionPatterns.some(pattern => pattern.test(input));
}

// =============================================================================
// CONTEXT-AWARE VALIDATION
// =============================================================================

/**
 * Validates company names with appropriate rules
 * Allows legitimate company names while blocking malicious input
 */
export function validateCompanyName(input: string): ValidationResult {
  const issues: string[] = [];
  let sanitized = input.trim();

  // Check for empty input
  if (!sanitized) {
    return { isValid: false, sanitized: '', issues: ['Company name cannot be empty'], blocked: false };
  }

  // Check for SQL injection
  if (detectSQLInjection(sanitized)) {
    issues.push('Invalid characters detected');
    sanitized = sanitizeInput(sanitized, 'company');
  }

  // Check for XSS
  if (detectXSS(sanitized)) {
    issues.push('Invalid characters detected');
    sanitized = sanitizeInput(sanitized, 'company');
  }

  // Check for template injection
  if (detectTemplateInjection(sanitized)) {
    issues.push('Invalid characters detected');
    sanitized = sanitizeInput(sanitized, 'company');
  }

  // Check for prompt injection
  if (detectPromptInjection(sanitized)) {
    issues.push('Invalid characters detected');
    sanitized = sanitizeInput(sanitized, 'company');
  }

  // Length check
  if (sanitized.length > 200) {
    issues.push('Company name too long');
    sanitized = sanitized.substring(0, 200);
  }

  // If input was completely sanitized away, it's blocked
  const blocked = sanitized === '' && input.trim() !== '';
  const isValid = !blocked && sanitized.length > 0;

  return { isValid, sanitized, issues, blocked };
}

/**
 * Validates region names with appropriate rules
 * Allows legitimate region names while blocking malicious input
 */
export function validateRegionName(input: string): ValidationResult {
  const issues: string[] = [];
  let sanitized = input.trim();

  // Check for empty input
  if (!sanitized) {
    return { isValid: false, sanitized: '', issues: ['Region name cannot be empty'], blocked: false };
  }

  // Check for injections
  if (detectSQLInjection(sanitized) || detectXSS(sanitized) || detectTemplateInjection(sanitized) || detectPromptInjection(sanitized)) {
    issues.push('Invalid characters detected');
    sanitized = sanitizeInput(sanitized, 'region');
  }

  // Length check
  if (sanitized.length > 100) {
    issues.push('Region name too long');
    sanitized = sanitized.substring(0, 100);
  }

  const blocked = sanitized === '' && input.trim() !== '';
  const isValid = !blocked && sanitized.length > 0;

  return { isValid, sanitized, issues, blocked };
}

/**
 * Validates division names with appropriate rules
 * Allows legitimate division names while blocking malicious input
 */
export function validateDivisionName(input: string): ValidationResult {
  const issues: string[] = [];
  let sanitized = input.trim();

  // Check for empty input
  if (!sanitized) {
    return { isValid: false, sanitized: '', issues: ['Division name cannot be empty'], blocked: false };
  }

  // Check for injections
  if (detectSQLInjection(sanitized) || detectXSS(sanitized) || detectTemplateInjection(sanitized) || detectPromptInjection(sanitized)) {
    issues.push('Invalid characters detected');
    sanitized = sanitizeInput(sanitized, 'division');
  }

  // Length check
  if (sanitized.length > 100) {
    issues.push('Division name too long');
    sanitized = sanitized.substring(0, 100);
  }

  const blocked = sanitized === '' && input.trim() !== '';
  const isValid = !blocked && sanitized.length > 0;

  return { isValid, sanitized, issues, blocked };
}

/**
 * Validates numeric choices (e.g., "1" or "2" for menu options)
 * Strict validation for menu choices
 */
export function validateNumericChoice(input: string, validChoices: string[]): ValidationResult {
  const sanitized = input.trim();
  
  if (!validChoices.includes(sanitized)) {
    return { 
      isValid: false, 
      sanitized: '', 
      issues: [`Please choose one of: ${validChoices.join(', ')}`], 
      blocked: false 
    };
  }

  return { isValid: true, sanitized, issues: [], blocked: false };
}

// =============================================================================
// SANITIZATION HELPERS
// =============================================================================

/**
 * Sanitizes input based on context, removing dangerous characters while preserving legitimate ones
 */
export function sanitizeInput(input: string, context: ValidationContext): string {
  let sanitized = input;

  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>'"`;]/g, '');

  // Context-specific sanitization
  switch (context) {
    case 'company':
      // Keep alphanumeric, spaces, common punctuation for company names
      sanitized = sanitized.replace(/[^a-zA-Z0-9\s.,&'\-()]/g, '');
      break;
    case 'region':
      // Keep alphanumeric, spaces, hyphens for region names
      sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-]/g, '');
      break;
    case 'division':
      // Keep alphanumeric, spaces, slashes, ampersands for division names
      sanitized = sanitized.replace(/[^a-zA-Z0-9\s\/&]/g, '');
      break;
    case 'numeric':
      // Keep only valid choices
      sanitized = '';
      break;
  }

  // Normalize whitespace
  sanitized = normalizeWhitespace(sanitized);

  return sanitized;
}

/**
 * Normalizes whitespace by trimming and collapsing multiple spaces
 */
export function normalizeWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

// =============================================================================
// COMPREHENSIVE VALIDATION
// =============================================================================

/**
 * Comprehensive validation that checks all security patterns
 * Used for backend validation of complete prompts
 */
export function validatePrompt(prompt: string): ValidationResult {
  const issues: string[] = [];
  let sanitized = prompt;

  // Check all injection types
  if (detectSQLInjection(prompt)) {
    issues.push('SQL injection attempt detected');
  }

  if (detectXSS(prompt)) {
    issues.push('XSS attempt detected');
  }

  if (detectTemplateInjection(prompt)) {
    issues.push('Template injection attempt detected');
  }

  if (detectPromptInjection(prompt)) {
    issues.push('Prompt injection attempt detected');
  }

  // Length check for prompts
  if (prompt.length > 5000) {
    issues.push('Prompt too long');
    sanitized = prompt.substring(0, 5000);
  }

  const blocked = issues.length > 0;
  const isValid = !blocked;

  return { isValid, sanitized, issues, blocked };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Checks if input contains only whitespace
 */
export function isOnlyWhitespace(input: string): boolean {
  return input.trim() === '';
}

/**
 * Checks if input is a reasonable length for its context
 */
export function isValidLength(input: string, context: ValidationContext): boolean {
  const maxLengths = {
    company: 200,
    region: 100,
    division: 100,
    numeric: 10,
  };

  return input.length <= maxLengths[context] && input.length > 0;
}

/**
 * Quick validation for backend use - returns boolean for simple checks
 */
export function isInputSafe(input: string): boolean {
  return !(
    detectSQLInjection(input) ||
    detectXSS(input) ||
    detectTemplateInjection(input) ||
    detectPromptInjection(input)
  );
}
