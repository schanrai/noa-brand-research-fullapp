export async function getLLMResearch(prompt: string, model: string) {
    console.log("Getting LLM research for prompt: ", prompt, " with model: ", model);
  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model }),
  });
  const data = await response.json();
  console.log("LLM research data: ", data);
  if (!response.ok) throw new Error(data.error || 'LLM error');
  return data.result;
}

// RESTORE: The working getStructuredData function
export async function getStructuredData(prompt: string) {
  console.log("Getting structured data with strict parameters");
  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt, 
      model: "openai/gpt-4o-mini-search-preview",
      temperature: 0.0,
      top_p: 0.0,
      max_tokens: 300
    }),
  });
  const data = await response.json();
  console.log("Structured data result: ", data);
  if (!response.ok) throw new Error(data.error || 'LLM error');
  
  // Parse the JSON response
  try {
    return JSON.parse(data.result);
  } catch (e) {
    console.error("Failed to parse structured data as JSON:", e);
    console.error("Raw response:", data.result);
    throw new Error("Failed to parse structured data response");
  }
}

// ADD: New function for detailed analysis (search agent - no JSON constraints)
export async function getDetailedAnalysis(prompt: string) {
  console.log("Getting detailed analysis from search agent");
  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt, 
      model: "openai/gpt-4o-search-preview",
      temperature: 0.3,
      top_p: 0.9,
      max_tokens: 4000
    }),
  });
  const data = await response.json();
  console.log("Detailed analysis result: ", data);
  if (!response.ok) throw new Error(data.error || 'LLM error');
  
  return data.result; // Return raw text, not parsed JSON
}

// ADD: New function for formatting (formatting agent - strict JSON schema)
export async function getFormattedData(content: string, schema: any) {
  console.log("Formatting content with formatting agent");
  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt: `Convert the following research into structured JSON format:\n\n${content}`,
      model: "openai/gpt-4o-mini",
      temperature: 0.0,
      top_p: 0.1,
      max_tokens: 3000,
      response_format: schema
    }),
  });
  const data = await response.json();
  console.log("Formatted data result: ", data);
  if (!response.ok) throw new Error(data.error || 'LLM error');
  
  try {
    return JSON.parse(data.result);
  } catch (e) {
    console.error("Failed to parse formatted data as JSON:", e);
    throw new Error("Failed to parse formatted data response");
  }
} 