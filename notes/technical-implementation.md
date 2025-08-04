
What’s the best pattern or approach to:

Send those two distinct prompts to the LLM,

Receive back two JSON objects,

And map each object’s fields into the correct UI components (overview fields vs. accordion panels) in our code?

Recommended Approach
1. Create Two Separate LLM Functions
First, let's create two specialized functions in lib/llm-client.ts:

// ... existing code ...

export async function getBrandOverview(companyName: string, model: string = "openai/gpt-4o-mini") {
  const prompt = `Extract key data points for ${companyName} and return ONLY a JSON object with these exact fields:
  {
    "industry": "string",
    "foundingDate": "YYYY-MM-DD",
    "website": "string", 
    "hqLocation": "string",
    "annualRevenue": "string",
    "employees": number,
    "sponsorshipTypes": ["string"],
    "lastUpdated": "YYYY-MM-DD"
  }
  
  Return ONLY the JSON object, no additional text.`;

  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'LLM error');
  
  // Parse the JSON response
  try {
    return JSON.parse(data.result);
  } catch (e) {
    throw new Error('Invalid JSON response from LLM');
  }
}

export async function getBrandFullReport(companyName: string, model: string = "openai/gpt-4o-mini") {
  const prompt = `Generate a detailed brand report for ${companyName} and return ONLY a JSON object with these exact fields:
  {
    "companyBackground": "detailed text about company history and background",
    "financialOverview": "detailed text about financial performance, funding, etc.",
    "marketingActivity": "detailed text about marketing strategies and campaigns", 
    "sponsorshipHistory": "detailed text about key sponsorships and experiential activities",
    "strategicFocus": "detailed text about market position and strategic focus",
    "targetAudience": "detailed text about target audience and engagement strategies"
  }
  
  Return ONLY the JSON object, no additional text.`;

  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'LLM error');
  
  // Parse the JSON response
  try {
    return JSON.parse(data.result);
  } catch (e) {
    throw new Error('Invalid JSON response from LLM');
  }
}

2. Update the Co-Pilot Interface
Modify the co-pilot interface to make both calls and combine the results:

// ... existing imports ...
import { getBrandOverview, getBrandFullReport } from "@/lib/llm-client"

// ... existing code ...

const runLLM = async () => {
  try {
    const model = "openai/gpt-4o-mini-search-preview";
    
    // Make both calls in parallel for better performance
    const [overviewData, reportData] = await Promise.all([
      getBrandOverview(companyName, model),
      getBrandFullReport(companyName, model)
    ]);
    
    // Combine the data into a single object that matches your UI structure
    const combinedResult = {
      ...overviewData,
      ...reportData,
      companyName: companyName,
      // Add any additional fields that might be needed
      contacts: [], // You might want to populate this separately
      regions: [], // You might want to populate this separately
      division: "", // You might want to populate this separately
      lastFunding: "", // You might want to populate this separately
      totalFunding: "", // You might want to populate this separately
      keySponsorships: [], // You might want to populate this separately
      strategicFocus: reportData.strategicFocus || "",
    };
    
    setLlmResult(JSON.stringify(combinedResult, null, 2));
  } catch (e) {
    setLlmResult("Error: " + (e as Error).message);
  } finally {
    setIsProcessing(false);
    if (currentStage === "processing-feedback") {
      onFeedbackComplete?.();
    } else {
      onResponse("results", companyName);
    }
  }
};

3. Update the Brand Profile Panel
The brand profile panel can remain largely the same since it will receive the combined data structure, but you might want to add some error handling:

// ... existing code ...

// In the accordion sections, you can now use the structured data:
<AccordionContent>
  <p className="text-sm text-muted-foreground">
    {company.companyBackground || "No company background available."}
  </p>
</AccordionContent>

// ... and similarly for other sections:
<AccordionContent>
  <p className="text-sm text-muted-foreground">
    {company.financialOverview || "No financial overview available."}
  </p>
</AccordionContent>



Stage 5: Add the Second Call
Once Stage 4 is working, add the second call:

// ... existing imports ...
import { getStructuredData, getDetailedReport } from "@/lib/llm-client"

// In the runLLM function:
const runLLM = async () => {
  try {
    // First call: Structured data
    const structuredPrompt = `Search for company: ${companyName}. Return a comprehensive summary including industry, location, annual revenue, funding, headquarters, employees, target audiences and key sponsorships and marketing campaigns in JSON format.`;
    const structuredOutput = await getStructuredData(structuredPrompt);
    
    // Second call: Detailed report
    const detailedPrompt = `Generate a detailed brand report for ${companyName} including company background, financial overview, marketing activity, sponsorship history, strategic focus, and target audience.`;
    const detailedOutput = await getDetailedReport(detailedPrompt);
    
    // Combine the outputs
    const combinedResult = {
      structured: structuredOutput,
      detailed: detailedOutput
    };
    
    setLlmResult(JSON.stringify(combinedResult, null, 2));
  } catch (e) {
    setLlmResult("Error: " + (e as Error).message);
  } finally {
    setIsProcessing(false);
    if (currentStage === "processing-feedback") {
      onFeedbackComplete?.();
    } else {
      onResponse("results", companyName);
    }
  }
};

Test this stage:
Verify both calls work
Check that you get both structured and detailed outputs
Verify the structured output is concise and the detailed output is more comprehensive

Stage 6: Add Error Handling and Loading States
Add proper error handling for individual calls: