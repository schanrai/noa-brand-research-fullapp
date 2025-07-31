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