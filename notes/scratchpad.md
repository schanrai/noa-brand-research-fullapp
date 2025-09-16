
prompt: `Convert the following research into structured JSON format according to the schema.

IMPORTANT: If the input contains structured data (like campaigns, initiatives, etc.), convert it into a readable, flowing narrative text that maintains all the key information but presents it in a natural, readable format.

For example, if you see structured campaign data, convert it to narrative text like:
"Dow's Digital Transformation Initiative targets business customers across various industries, emphasizing convenience and efficiency. The campaign achieved a 40% increase in digital channel sales by end of 2023, with a 450% increase in repeat visitors and 200% increase in online orders."

RESEARCH CONTENT:
${content}

Please format this as clean, readable narrative text that follows the schema requirements.`










`Research ${companyName}${regionText}${focusText} recent and current marketing activities.

Provide detailed analysis of current and recent global marketing activity. Include at least 5 specific named campaigns with:
- Target audience segments
- Messaging themes  
- Measurable outcomes (engagement metrics, ROI, media coverage)
- Creative concepts
- Channels used
- Partnerships or collaborations

If a region was specified, include regional marketing details with concrete examples of events, digital campaigns, or key channel activations, including timing, format, target audience, and strategic rationale.

Focus on high quality, verifiable information from the company website, press releases, reputable media coverage and high authority publishers. Avoid vague descriptions - all examples must reference verifiable sources, initiatives, or announcements.`;







              // PASS 4: Sponsorships & Experiential (dedicated search for depth)
              const sponsorshipsPrompt = `Research ${companyName}${regionText}${focusText} recent and currentsponsorship portfolio and experiential initiatives.

Identify and describe at least 5 specific sponsorships within the last 3-5 years in sports, arts, culture, entertainment, or lifestyle. For each provide:
- Sponsorship name
- Exact or approximate start/end dates
- Geographic location
- Event/partner name
- Activation channels
- Budget or scale indicators (if available)
- Strategic fit with brand goals
- Measurable outcomes (audience reach, media coverage, ROI, engagement metrics)

For experiential initiatives, identify at least 3 named initiatives within the last 3-5 years such as VIP/client-only events, curated experiences, global tours, or museum tie-ins. For each provide:
- Event name
- Dates and location
- Purpose/context
- Audience profile
- Unique experiential elements
- Cultural or thought leadership integration
- Measurable impact

Focus on verifiable information from the company website, press releases, high authority news sources and publishers.Avoid vague statements like 'supports local events'. All examples must reference named events, partners, or programs with verifiable details. `;


const socialMediaPrompt = `Research ${companyName}${regionText} social media presence and strategic focus.

Social Media (350-450 words): Recent platform activity, engagement tactics, and brand tone across LinkedIn, Twitter, Instagram, TikTok, YouTube and other relevant platforms.

Strategic Focus (200-350 words): How the company differentiates itself, brand traits, competitive stance, and risk considerations.

Focus on recent activity and verifiable information from company announcements and social media presence.`;





const overviewPrompt = `Research ${companyName}${regionText} and provide:

1. Company Overview (100-150 words): Global footprint, core business divisions and brands, primary service lines, main offices
2. Company Background (150-350 words): Brief history of the company, key milestones, organisational structure, defining values
3. Financial Overview (100-200 words): Key financial performance with specific datapoints, stability indicators, ownership structure, funding and recent acquisitions
4. Audience Segmentation (50-75 words): Target audiences, current customer types, emerging segments

Focus on factual information from company press releases, financial reports, and reputable business sources.

SOURCES REQUIREMENTS:
- Collect ALL sources used in your research
- Provide full URLs for verification
- Minimum 5 sources, include as many relevant sources as found`;





const structuredPrompt = `I would like to research the company ${companyName}${regionText}${focusText}. 

IMPORTANT: You must respond with ONLY valid JSON. Do not include any other text, explanations, or formatting. Retrieve the information from high quality, verifiable information such as from the company website, press releases, reputable media coverage and high authority publishers

Please provide the company data in this exact JSON format:

{
  "industry": "<value>",
  "founded": "<value>",
  "website": "<value>",
  "headquarters": "<value>",
  "annualRevenue": "<value>",
  "employees": "<value>"
}

DO NOT add any explanations, dates, parentheses, or additional context to values.`;







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