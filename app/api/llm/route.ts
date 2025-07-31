import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt, model = "openai/gpt-4-0-search-preview" } = await req.json();

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer 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`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant for brand research.' },
        { role: 'user', content: prompt }
      ],
      //max_tokens: 1024,
      temperature: 0.7,
    }),
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