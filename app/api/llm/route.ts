import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isInputSafe } from '@/lib/input-validator';





export async function POST(req: NextRequest) {
  const { 
    prompt, 
    model = "openai/gpt-4o-search-preview",
    temperature,
    top_p,
    max_tokens,
    stop,
    response_format,
    plugins, // ADD
    web_search_options, // ADD
    skipValidation = false // Add skipValidation flag
   } = await req.json();

   // Add this for testing - remove after testing
 /*  
if (prompt.includes('TEST_ERROR')) {
  return NextResponse.json(
    { error: 'Test error', details: 'Simulated error' },
    { status: 500 }
  );
}
*/

  // Validate prompt for security threats (skip for LLM-generated content)
  if (!skipValidation && !isInputSafe(prompt)) {
    console.warn('Blocked potentially malicious input:', prompt.substring(0, 100));
    return NextResponse.json(
      { 
        error: 'Invalid input detected',
        details: 'Input contains potentially malicious patterns'
      },
      { status: 400 }
    );
  }

  interface OpenRouterRequestBody {
    model: string;
    messages: Array<{ role: string; content: string }>;
    temperature: number;
    top_p?: number;
    max_tokens?: number;
    stop?: string | string[];
    response_format?: { type: string };
    plugins?: string[];
    web_search_options?: Record<string, unknown>;
  }

  const requestBody: OpenRouterRequestBody = {
    model,
    messages: [
      { role: 'system', content: 'You are a helpful assistant for brand research.' },
      { role: 'user', content: prompt }
    ],
    temperature: temperature ?? 0.7, // Default if not provided
  };

  // Only add parameters if they are explicitly provided
  if (top_p !== undefined) requestBody.top_p = top_p;
  if (max_tokens !== undefined) requestBody.max_tokens = max_tokens;
  if (stop !== undefined) requestBody.stop = stop;
  if (response_format !== undefined) requestBody.response_format = response_format;
  if (plugins !== undefined) requestBody.plugins = plugins; // ADD
  if (web_search_options !== undefined) requestBody.web_search_options = web_search_options; // ADD

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // Handle specific error types
      if (response.status === 429) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            details: 'Too many requests to the LLM service'
          },
          { status: 429 }
        );
      }
      
      // Handle 500 Internal Server Error
      if (response.status === 500) {
        console.error('OpenRouter 500 error');
        return NextResponse.json(
          { 
            error: 'Service temporarily unavailable',
            details: 'OpenRouter server is currently busy. Please try again in a little while.'
          },
          { status: 500 }
        );
      }
      
      // Get the actual error response from OpenRouter
      let errorDetails: { error?: { message?: string } } = {};
      try {
          errorDetails = await response.json();
      } catch {
          errorDetails = { error: { message: await response.text() } };
      }
      
      // Log to server console for debugging
      console.error('OpenRouter error:', errorDetails);
      
      // Handle 400 token limit exceeded error
      if (response.status === 400 && errorDetails?.error?.message?.includes('maximum context length')) {
        return NextResponse.json(
          { 
            error: 'Search results too large',
            details: 'The search returned too much content to process. Please try again - results vary by timing.'
          },
          { status: 400 }
        );
      }
      
      // Return the error details in the API response
      return NextResponse.json(
        { 
          error: 'LLM service error',
          details: `HTTP ${response.status}: ${response.statusText}`
        }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ result: data.choices[0].message.content });
    
  } catch (error) {
    console.error('LLM API error:', error);
    return NextResponse.json(
      { 
        error: 'Network connection failed',
        details: 'Unable to connect to LLM service'
      },
      { status: 500 }
    );
  }
}