I would like to research the company ${companyName}, ${detailedRegionText}${detailedDivisionText}.

The research should be crafted in a concise, professional and insight-rich style, suitable for displaying onscreen in a dedicated research application for evaluating potential partnership opportunities, and for populating in a CRM thereafter. Use information from at least 8 or more distinct sources.  Use data only from verifiable sources such as company press releases, reputable media coverage, case studies, and event listings.

IMPORTANT: You must respond with ONLY valid JSON. Do not include any other text, explanations, or formatting. 

Please provide the research in this exact JSON format:

{
  "companyOverview": {
    "content": "<100-150 words about company overview including global footprint, core business divisions and primary service lines>"
  },
  "companyBackground": {
    "content": "<150-350 words about core divisions, key milestones, main offices, structure, and defining values>"
  },
  "financialOverview": {
    "content": "<100-200 words about key financial milestones, stability indicators, ownership structure, funding, and recent acquisitions>"
  },
  "audienceSegmentation": {
    "content": "<50-75 words about target audiences, current customer types, and emerging segments>"
  },
  "marketingActivity": {
    "content": "<600-850 words providing a detailed analysis of current and recent global marketing activity. Include at least 5 specific named campaigns from the last three years, with target audience segments, messaging themes, and measurable outcomes (e.g., engagement metrics, ROI, media coverage). Describe the campaign’s creative concept, channels used, and any partnerships or collaborations. Then, if a region has been specified in the request, provide a regional marketing section covering the specific region. For this region, Include concrete examples of events, digital campaigns, or key channel activations, with timing, format, target audience, and strategic rationale. Avoid vague or generic descriptions — all examples must be tied to verifiable actions, initiatives, or announcements from the company. Prioritize details such as campaign names, dates, target audience, key messages, partners, budgets (if available), and outcomes. Do not rely on generic descriptions or third-party speculation.>"
  },
  "sponsorshipsExperiential": {
    "content": "<600-850 words covering the company’s sponsorship portfolio and experiential initiatives within the last three years. 
  Identify and describe at least 5 specific sponsorships in sports, arts, culture, entertainment, or lifestyle only. For each, provide the sponsorship name, exact or approximate start/end dates, geographic location, event/partner name, activation channels, budget or scale indicators (if available), strategic fit with brand goals, and measurable outcomes such as audience reach, media coverage, ROI, or engagement metrics. Avoid vague statements such as 'supports local events'. All examples must reference a named event, partner, or program with verifiable details.  
  For the experiential initiatives section: Identify and describe at least 3 named initiatives such as VIP/client-only events, curated experiences, global tours, or museum tie-ins. For each, provide the event name, dates, location, purpose/context, audience profile, unique experiential elements, cultural or thought leadership integration, and measurable impact.  If no examples exist for either sponsorships or experiential initiatives, explicitly state so.>"
  },
  "socialMediaPresence": {
    "content": "<350-450 words about recent platform activity, engagement tactics, and brand tone across LinkedIn, Twitter, Instagram, TikTok, YouTube and other relevant platforms>"
  },
  "strategicFocus": {
    "content": "<200-350 words about how the company differentiates itself, brand traits, competitive stance, and risk considerations>"
  },
  "contacts": {
    "leadership": [
      {
        "name": "<name>",
        "title": "<title>",
        "email": "<email>",
        "phone": "<phone>"
      }
    ],
    "marketingContacts": [
      {
        "name": "<name>",
        "title": "<title>",
        "email": "<email>",
        "phone": "<phone>"
      }
    ],
    "sponsorshipContacts": [
      {
        "name": "<name>",
        "title": "<title>",
        "email": "<email>",
        "phone": "<phone>"
      }
      },
    ]

















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





Two-LLM Approach Benefits:
1. Solves the API Error Issue
Search LLM: Your current GPT-4o Search Preview (no format constraints)
Formatting LLM: Different model that can handle JSON mode safely
No more API errors: Each LLM does what it's designed for

2. Preserves Search Quality
Search LLM: Focuses purely on web search and content gathering
No JSON constraints: Can return rich, narrative content with multiple sources
Multiple queries: Each section can trigger independent searches

3. Guaranteed Structure
Formatting LLM: Takes the search results and converts to exact accordion structure
JSON mode: Can use strict formatting without compromising search
Reliable parsing: No more JSON parsing issues


Two-LLM Approach Test:
Phase 1: Search Agent (No Format Constraints)
Apply to technical-im...
 
Phase 2: Formatting Agent (JSON Mode)
Apply to technical-im...
}
Why This Approach Works:
Search Agent: No JSON constraints, can focus purely on content and sources
Formatting Agent: Uses JSON mode, guaranteed valid output
No API errors: Each agent has a single, clear responsibility
Better parsing: JSON is easier to parse than custom tagged blocks
Testing Strategy:
Test the search prompt first - should work without API errors
Test the formatting prompt - should return valid JSON
Combine both - search agent gets content, formatting agent structures it
My Recommendation:
Let's test the search agent prompt first (the one above without any formatting requirements). This should work without the API errors you were experiencing.
If that works, then we can test the formatting agent approach. The two-LLM approach eliminates the tagged blocks issues entirely.
Want to test the search agent prompt first to see if it works without API errors?

The Sweet Spot for Search (gpt 4o search preview parameters):
Recommended Settings:

{
  temperature: 0.7,    // Balanced creativity and reliability
  top_p: 0.95,        // High flexibility without being too random
  max_tokens: 8000,    // Sufficient for detailed responses
  stop: ["END_SECTION", "```", "END"]  // Prevent runaway responses
}

Why These Work Better:
Temperature 0.7: Enough creativity for diverse search strategies, but not too random
Top_p 0.95: High flexibility for response format adaptation
Balanced approach: Gets search quality without forcing rigid message structures
Takeaway:
Your default settings worked because they gave the model enough flexibility to adapt to OpenRouter's expected message format. The restrictive settings (0.3, 0.9) were forcing the model into a rigid response pattern that conflicted with OpenRouter's parsing.
Recommendation: Use temperature 0.7 and top_p 0.95 for the best balance of search quality and platform compatibility. This gives you the search depth you want without the API errors.

## **Formatting Agent Model Selection:**

### **Primary Recommendation: GPT-4o-mini**
- **Model ID**: `openai/gpt-4o-mini`
- **Why**: Excellent JSON mode support, cost-effective, reliable
- **JSON Mode**: ✅ Full support with `response_format: { type: "json_object" }`

### **Alternative: Claude 3 Haiku**
- **Model ID**: `anthropic/claude-3-haiku-20240307`
- **Why**: Very good at structured output, cost-effective
- **JSON Mode**: ✅ Good support

## **Testing Strategy in OpenRouter Chat:**

### **Step 1: Test Basic JSON Mode**
```
Convert this text to JSON format:

Company: Apple Inc.
Industry: Technology
Founded: 1976
Revenue: $394.3 billion

Return ONLY valid JSON.
```

**Expected Output:**
```json
{
  "company": "Apple Inc.",
  "industry": "Technology",
  "founded": 1976,
  "revenue": "$394.3 billion"
}
```

### **Step 2: Test with Your Actual Data Structure**
```
Convert this research into structured JSON format:

Adobe's global marketing strategy centers around creative empowerment and digital transformation. The "Creativity for All" campaign, launched in 2022, targets creative professionals and businesses seeking digital transformation. This campaign generated 2.5 billion impressions globally and resulted in 18% increase in Creative Cloud subscriptions.

The "Adobe MAX" annual conference, running from 2021-2024, serves as a cornerstone of Adobe's global marketing efforts. The 2023 event attracted over 500,000 virtual attendees and featured partnerships with major brands like Nike and Disney.

Return ONLY valid JSON in this exact format:
{
  "section": "marketingActivity.globalMarketing",
  "content": "[The detailed marketing analysis]",
  "sources": ["url1", "url2", "url3", "url4", "url5", "url6"]
}
```

### **Step 3: Test Complex Nested Structure**
```
Convert this into structured JSON for accordion tabs:

Company Overview: Adobe is a global software company focused on creative and digital marketing tools.

Financial Overview: Adobe reported $19.4 billion in revenue for 2023, with strong growth in Creative Cloud subscriptions.

Marketing Activity: Adobe's global marketing includes the "Creativity for All" campaign and Adobe MAX conference.

Return ONLY valid JSON in this format:
{
  "companyOverview": {
    "content": "[Company overview text]"
  },
  "financialOverview": {
    "content": "[Financial overview text]"
  },
  "marketingActivity": {
    "globalMarketing": "[Marketing activity text]"
  }
}
```

## **What to Look For:**

### **✅ Good Formatting Agent:**
- Returns valid JSON without extra text
- Follows the exact structure you specify
- No parsing errors
- Consistent output format

### **❌ Poor Formatting Agent:**
- Adds explanatory text before/after JSON
- Malformed JSON structure
- Inconsistent formatting
- Parsing errors

## **Testing Order:**

1. **Start with GPT-4o-mini** - test basic JSON conversion
2. **If that works well** - test with your actual data structure
3. **If still good** - test the complex nested structure
4. **If any issues** - try Claude 3 Haiku as alternative

## **Expected Results:**

With a good formatting agent, you should get:
- **Clean JSON output** with no extra text
- **Exact structure matching** your specifications
- **No parsing errors** when you copy the JSON
- **Consistent formatting** across multiple tests

## **Next Steps:**

1. **Test GPT-4o-mini first** with the basic JSON conversion
2. **If successful** - test with your marketing data structure
3. **Report back** on which model works best and any issues you encounter

This will help us identify the most reliable formatting agent for your two-LLM approach. Want to start with the basic JSON conversion test?