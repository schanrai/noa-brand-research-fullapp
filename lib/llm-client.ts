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

// Helper function to clean JSON response from markdown formatting
function cleanJsonResponse(responseText: string): string {
  let jsonString = responseText;
  
  // Remove markdown code blocks if present
  if (jsonString.includes('```json')) {
    jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (jsonString.includes('```')) {
    jsonString = jsonString.replace(/```\n?/g, '');
  }
  
  // Trim whitespace
  return jsonString.trim();
}

// Function for structured data with strict parameters - returns JSON
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
    const cleanedResponse = cleanJsonResponse(data.result);
    return JSON.parse(cleanedResponse);
  } catch (e) {
    console.error("Failed to parse structured data as JSON:", e);
    console.error("Raw response:", data.result);
    throw new Error("Failed to parse structured data response");
  }
}

// Function for detailed report with JSON format - returns JSON
export async function getDetailedReport(prompt: string) {
  console.log("Getting detailed report with JSON format");
  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt, 
      model: "openai/gpt-4o-search-preview",
      max_tokens: 4000
    }),
  });
  const data = await response.json();
  console.log("Detailed report result: ", data);
  if (!response.ok) throw new Error(data.error || 'LLM error');
  
  // Parse the JSON response
  try {
    const cleanedResponse = cleanJsonResponse(data.result);
    return JSON.parse(cleanedResponse);
  } catch (e) {
    console.error("Failed to parse detailed report as JSON:", e);
    console.error("Raw response:", data.result);
    throw new Error("Failed to parse detailed report response");
  }
} 