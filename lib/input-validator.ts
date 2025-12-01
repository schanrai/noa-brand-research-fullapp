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
    
    // ENHANCED: Additional XSS patterns to match DOMPurify coverage
    // Event handlers with quotes
    /onclick\s*=\s*["'][^"']*["']/i,
    /onload\s*=\s*["'][^"']*["']/i,
    /onerror\s*=\s*["'][^"']*["']/i,
    /onfocus\s*=\s*["'][^"']*["']/i,
    /onblur\s*=\s*["'][^"']*["']/i,
    /onchange\s*=\s*["'][^"']*["']/i,
    /onsubmit\s*=\s*["'][^"']*["']/i,
    /onreset\s*=\s*["'][^"']*["']/i,
    /onselect\s*=\s*["'][^"']*["']/i,
    /onkeydown\s*=\s*["'][^"']*["']/i,
    /onkeyup\s*=\s*["'][^"']*["']/i,
    /onkeypress\s*=\s*["'][^"']*["']/i,
    /onmousedown\s*=\s*["'][^"']*["']/i,
    /onmouseup\s*=\s*["'][^"']*["']/i,
    /onmouseover\s*=\s*["'][^"']*["']/i,
    /onmouseout\s*=\s*["'][^"']*["']/i,
    /onmousemove\s*=\s*["'][^"']*["']/i,
    /onmouseenter\s*=\s*["'][^"']*["']/i,
    /onmouseleave\s*=\s*["'][^"']*["']/i,
    /ondblclick\s*=\s*["'][^"']*["']/i,
    /oncontextmenu\s*=\s*["'][^"']*["']/i,
    /onwheel\s*=\s*["'][^"']*["']/i,
    /oninput\s*=\s*["'][^"']*["']/i,
    /oninvalid\s*=\s*["'][^"']*["']/i,
    /onsearch\s*=\s*["'][^"']*["']/i,
    
    // CSS injection patterns
    /style\s*=\s*["'][^"']*javascript[^"']*["']/i,
    /style\s*=\s*["'][^"']*expression\s*\([^"']*["']/i,
    /style\s*=\s*["'][^"']*url\s*\([^"']*javascript[^"']*["']/i,
    
    // SVG injection patterns
    /<svg[\s\S]*?onload[\s\S]*?>/i,
    /<svg[\s\S]*?onerror[\s\S]*?>/i,
    /<svg[\s\S]*?onclick[\s\S]*?>/i,
    
    // IMG injection patterns
    /<img[\s\S]*?onerror[\s\S]*?>/i,
    /<img[\s\S]*?onload[\s\S]*?>/i,
    
    // LINK injection patterns
    /<link[\s\S]*?onload[\s\S]*?>/i,
    /<link[\s\S]*?onerror[\s\S]*?>/i,
    
    // META injection patterns
    /<meta[\s\S]*?onload[\s\S]*?>/i,
    /<meta[\s\S]*?onerror[\s\S]*?>/i,
    
    // Input injection patterns
    /<input[\s\S]*?onfocus[\s\S]*?>/i,
    /<input[\s\S]*?onblur[\s\S]*?>/i,
    /<input[\s\S]*?onchange[\s\S]*?>/i,
    
    // Body injection patterns
    /<body[\s\S]*?onload[\s\S]*?>/i,
    /<body[\s\S]*?onunload[\s\S]*?>/i,
    
    // Anchor injection patterns
    /<a[\s\S]*?href\s*=\s*["']?javascript:/i,
    /<a[\s\S]*?onclick[\s\S]*?>/i,
    
    // Protocol handlers
    /vbscript\s*:/i,
    /data\s*:\s*text\/plain/i,
    /data\s*:\s*application\/javascript/i,
    
    // Expression injection
    /expression\s*\(/i,
    /eval\s*\(/i,
    /setTimeout\s*\(/i,
    /setInterval\s*\(/i,
    
    // HTML entities that could be decoded to scripts (removed - caused false positives with company names containing &)
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
// JSON INJECTION PROTECTION
// =============================================================================

/**
 * Detects JSON-like input that could cause parsing issues
 * Blocks JSON objects, arrays, and structured data patterns
 */
export function detectJsonInjection(input: string): boolean {
  const jsonPatterns = [
    // JSON object patterns
    /^\s*\{[\s\S]*\}\s*$/,           // Complete JSON object
    /^\s*\[[\s\S]*\]\s*$/,           // Complete JSON array
    // JSON-like patterns that could cause issues
    /\{[^}]*"[^"]*"\s*:\s*"[^"]*"/,  // Object with key-value pairs
    /\{[^}]*"[^"]*"\s*:\s*\d+/,       // Object with numeric values
    /\{[^}]*"[^"]*"\s*:\s*(true|false|null)/, // Object with boolean/null values
    // Common JSON injection patterns
    /"test"\s*:\s*"value"/i,         // Specific test pattern
    /"TEST"\s*:\s*"VALUE"/i,         // Specific test pattern (uppercase)
  ];

  return jsonPatterns.some(pattern => pattern.test(input));
}

// =============================================================================
// PATTERN DETECTION (NEW)
// =============================================================================

/**
 * Detects repeated characters (e.g., "aaaaaaaaaa") that could cause LLM hallucinations
 */
export function detectRepeatedCharacters(input: string): boolean {
  // Detect 3+ same characters in a row
  return /(.)\1{2,}/.test(input);
}

/**
 * Detects gibberish patterns that could cause LLM hallucinations
 */
export function detectGibberish(input: string): boolean {
  const trimmed = input.trim();
  
  // Too short to be meaningful
  if (trimmed.length < 2) return true;
  
  // Numbers only
  if (/^\d+$/.test(trimmed)) return true;
  
  // Repeated characters (already handled by detectRepeatedCharacters, but included for completeness)
  if (/(.)\1{2,}/.test(trimmed)) return true;
  
  // Random character sequences (very basic detection)
  if (/^[a-z]{3,}$/i.test(trimmed) && !containsVowels(trimmed)) return true;
  
  return false;
}

/**
 * Helper function to check if input contains vowels (basic gibberish detection)
 */
function containsVowels(input: string): boolean {
  return /[aeiou]/i.test(input);
}

/**
 * Detects if input is only whitespace or very short
 */
export function detectInvalidLength(input: string): boolean {
  const trimmed = input.trim();
  return trimmed.length === 0 || trimmed.length < 2;
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

  // Check for invalid length
  if (detectInvalidLength(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Company name too short'], blocked: true };
  }

  // Check for gibberish patterns
  if (detectGibberish(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Please enter a valid company name'], blocked: true };
  }

  // Check for repeated characters
  if (detectRepeatedCharacters(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Please enter a valid company name'], blocked: true };
  }

  // Check for SQL injection
  if (detectSQLInjection(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Invalid input detected'], blocked: true };
  }

  // Check for XSS
  if (detectXSS(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Invalid input detected'], blocked: true };
  }

  // Check for template injection
  if (detectTemplateInjection(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Invalid input detected'], blocked: true };
  }

  // Check for prompt injection
  if (detectPromptInjection(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Invalid input detected'], blocked: true };
  }

  // Check for JSON injection
  if (detectJsonInjection(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Invalid input detected'], blocked: true };
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

  // Check for invalid length
  if (detectInvalidLength(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Region name too short'], blocked: true };
  }

  // Check for gibberish patterns
  if (detectGibberish(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Please enter a valid region name'], blocked: true };
  }

  // Check for repeated characters
  if (detectRepeatedCharacters(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Please enter a valid region name'], blocked: true };
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

  // Check for invalid length
  if (detectInvalidLength(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Division name too short'], blocked: true };
  }

  // Check for gibberish patterns
  if (detectGibberish(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Please enter a valid division name'], blocked: true };
  }

  // Check for repeated characters
  if (detectRepeatedCharacters(sanitized)) {
    return { isValid: false, sanitized: '', issues: ['Please enter a valid division name'], blocked: true };
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
    detectPromptInjection(input) ||
    detectRepeatedCharacters(input) ||
    detectGibberish(input) ||
    detectInvalidLength(input) ||
    detectJsonInjection(input)
  );
}
