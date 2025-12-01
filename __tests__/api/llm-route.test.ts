import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/llm/route';
import { NextRequest } from 'next/server';

// Mock the input validator
vi.mock('@/lib/input-validator', () => ({
  validatePrompt: vi.fn((prompt: string) => ({
    isValid: !prompt.includes('MALICIOUS'),
    sanitized: prompt,
    issues: prompt.includes('MALICIOUS') ? ['Invalid input'] : [],
    blocked: prompt.includes('MALICIOUS'),
  })),
  isInputSafe: vi.fn((input: string) => !input.includes('MALICIOUS')),
}));

// Mock environment variables
const originalEnv = process.env;

describe('LLM API Route', () => {
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      OPENROUTER_API_KEY: 'test-api-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it('should reject malicious input with 400 status', async () => {
    const request = new NextRequest('http://localhost:3000/api/llm', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'MALICIOUS input',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Invalid input detected');
  });

  it('should allow valid input when skipValidation is true', async () => {
    // Mock fetch to return a successful response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Test response' } }],
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/llm', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'MALICIOUS input',
        skipValidation: true,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.result).toBe('Test response');
  });

  it('should return 429 for rate limit errors', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    });

    const request = new NextRequest('http://localhost:3000/api/llm', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Valid prompt',
        skipValidation: true,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(429);
    
    const data = await response.json();
    expect(data.error).toBe('Rate limit exceeded');
  });

  it('should return 500 for network errors', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/llm', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Valid prompt',
        skipValidation: true,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
    
    const data = await response.json();
    expect(data.error).toBe('Network connection failed');
  });

  it('should return LLM response for valid requests', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Test LLM response' } }],
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/llm', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Valid prompt',
        skipValidation: true,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.result).toBe('Test LLM response');
  });
});

