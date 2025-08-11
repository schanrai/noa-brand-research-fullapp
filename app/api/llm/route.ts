import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { 
    prompt, 
    model = "openai/gpt-4o-search-preview",
    temperature,
    top_p,
    max_tokens,
    stop,
    response_format
   } = await req.json();

   const requestBody: any = {
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

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    // Get the actual error response from OpenRouter
    let errorDetails = {};
    try {
        errorDetails = await response.json();
    } catch {
        errorDetails = { text: await response.text() };
    }
    // Log to server console for debugging
    console.error('OpenRouter error:', errorDetails);
    // Return the error details in the API response
    return NextResponse.json({ error: 'LLM request failed', response: errorDetails}, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json({ result: data.choices[0].message.content });
} 