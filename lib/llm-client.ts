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

// Function for structured data with strict parameters
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
      max_tokens: 300,
      stop: ["END"]
    }),
  });
  const data = await response.json();
  console.log("Structured data result: ", data);
  if (!response.ok) throw new Error(data.error || 'LLM error');
  return data.result;
}

// Function for detailed report with default parameters
export async function getDetailedReport(prompt: string) {
  console.log("Getting detailed report with default parameters");
  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt, 
      model: "openai/gpt-4o-search-preview"
      // Uses default temperature and other params
    }),
  });
  const data = await response.json();
  console.log("Detailed report result: ", data);
  if (!response.ok) throw new Error(data.error || 'LLM error');
  return data.result;
} 