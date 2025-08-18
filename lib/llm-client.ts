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
  
  // Remove any trailing commas before closing braces/brackets
  jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
  
  // Try to parse as-is first
  try {
    JSON.parse(jsonString);
    return jsonString.trim();
  } catch (parseError) {
    console.warn("Initial JSON parsing failed, attempting to clean response:", parseError);
    
    // Fix the main issue: unescaped quotes in content fields
    let cleanedString = jsonString;
    
    // Find and fix content fields with unescaped quotes
    const contentRegex = /"content":\s*"([^"]*(?:\\"|[^"])*?)"/g;
    let match;
    
    while ((match = contentRegex.exec(jsonString)) !== null) {
      const originalContent = match[1];
      // Escape quotes and other problematic characters
      const escapedContent = originalContent
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
      
      cleanedString = cleanedString.replace(originalContent, escapedContent);
    }
    
    // Try parsing again
    try {
      JSON.parse(cleanedString);
      return cleanedString.trim();
    } catch (secondError) {
      console.error("Failed to clean JSON response:", secondError);
      
      // Last resort: try to extract just the JSON structure
      return attemptJsonRecovery(jsonString);
    }
  }
}

// Emergency JSON recovery function
function attemptJsonRecovery(jsonString: string): string {
  console.log("Attempting JSON recovery...");
  
  // Try to find the JSON structure and extract valid parts
  const startBrace = jsonString.indexOf('{');
  const endBrace = jsonString.lastIndexOf('}');
  
  if (startBrace === -1 || endBrace === -1 || startBrace >= endBrace) {
    throw new Error("Cannot find valid JSON structure");
  }
  
  // Extract the content between braces
  let extracted = jsonString.substring(startBrace, endBrace + 1);
  
  // Try to fix common issues
  extracted = extracted
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
    .replace(/"([^"]*?)(\n|\r|\t)([^"]*?)"/g, '"$1\\n$3"') // Fix newlines in strings
    .replace(/"([^"]*?)([^\\])"([^"]*?)"/g, '"$1\\"$3"'); // Fix unescaped quotes
  
  // Try parsing the recovered JSON
  try {
    JSON.parse(extracted);
    return extracted;
  } catch (finalError) {
    console.error("JSON recovery parsing failed:", finalError);
    
    // If all else fails, return a minimal valid JSON structure
    return JSON.stringify({
      error: "Failed to parse LLM response",
      originalLength: jsonString.length,
      timestamp: new Date().toISOString()
    });
  }
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