// ADD: Simple JSON cleaning function (move to TOP of file)
function cleanJsonResponse(responseText: string): string {
  let jsonString = responseText;
  
  // Remove markdown code blocks if present
  if (jsonString.includes('```json')) {
    jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (jsonString.includes('```')) {
    jsonString = jsonString.replace(/```\n?/g, '');
  }
  
  // Remove extra quotes around the whole response
  jsonString = jsonString.replace(/^"|"$/g, '');
  
  return jsonString.trim();
}

export async function getLLMResearch(prompt: string, model: string) {
    console.log("Getting LLM research for prompt: ", prompt, " with model: ", model);
  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model }),
  });
  const data = await response.json();
  //console.log("LLM research data: ", data);
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
  //console.log("Structured data result: ", data);
  if (!response.ok) throw new Error(data.error || 'LLM error');
  
  // FIX: Clean the response before parsing
  try {
    const cleanedResponse = cleanJsonResponse(data.result);
    //console.log("Cleaned response:", cleanedResponse);
    return JSON.parse(cleanedResponse);
  } catch (e) {
    console.error("Failed to parse structured data as JSON:", e);
    console.error("Raw response:", data.result);
    throw new Error("Failed to parse structured data response");
  }
}

// ADD: New function for detailed analysis (search agent - no JSON constraints)
export async function getDetailedAnalysis(prompt: string) {
  console.log("Getting detailed analysis from search agent");
  try {
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
    //console.log("Detailed analysis result: ", data);
    
    if (!response.ok) {
      console.error("API Error:", data);
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data.result; // Return raw text, not parsed JSON
  } catch (e) {
    console.error("Detailed analysis failed:", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    throw new Error(`LLM request failed: ${errorMessage}`);
  }
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
      max_tokens: 5000,
      response_format: schema
    }),
  });
  const data = await response.json();
  //console.log("Formatted data result: ", data);
  if (!response.ok) throw new Error(data.error || 'LLM error');
  
  try {
    // ADD: Clean the response before parsing (same as getStructuredData)
    const cleanedResponse = cleanJsonResponse(data.result);
    //console.log("Cleaned response before parsing:", cleanedResponse);
    return JSON.parse(cleanedResponse);
  } catch (e) {
    console.error("Failed to parse formatted data as JSON:", e);
    console.error("Raw response that failed:", data.result);
    throw new Error("Failed to parse formatted data response");
  }
} 