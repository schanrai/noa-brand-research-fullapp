"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Send, Lightbulb, Star, Loader2, Network } from "lucide-react"
import { getLLMResearch, getStructuredData, getDetailedAnalysis, getDetailedAnalysisWithCitations, getFormattedData } from "@/lib/llm-client"
import { overviewSchema, marketingSchema, sponsorshipsSchema, socialMediaSchema } from "@/lib/schemas"
import { validateCompanyName, validateRegionName, validateDivisionName, validateNumericChoice } from "@/lib/input-validator"

interface CoPilotInterfaceProps {
  stage: "initial" | "region" | "region-specific" | "division" | "division-specific" | "confirmation" | "results" | "feedback" | "feedback-clarification" | "processing" | "processing-feedback"
  onResponse: (stage: string, value: string, llmResult?: string) => void
  feedbackMode?: boolean
  onFeedbackComplete?: () => void
}

export default function CoPilotInterface({
  stage,
  onResponse,
  feedbackMode = false,
  onFeedbackComplete,
}: CoPilotInterfaceProps) {
  const [userInput, setUserInput] = useState("")
  const [validationError, setValidationError] = useState("")
  const [conversationHistory, setConversationHistory] = useState([
    {
      role: "assistant",
      content: feedbackMode
        ? "I see you'd like to make some changes to the research results. What specific adjustments would you like me to make to better match what you're looking for?"
        : "Hey there, which company would you like to research today?",
      timestamp: new Date(),
    },
  ])
  const [companyName, setCompanyName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<string[]>([])
  const [currentStage, setCurrentStage] = useState<CoPilotInterfaceProps['stage']>(feedbackMode ? "feedback" : stage)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showConversationHistory, setShowConversationHistory] = useState(false)
  const [llmResult, setLlmResult] = useState<string | null>(null);
  const [structuredData, setStructuredData] = useState<any>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null)

  // Add these state variables at the top with your other state declarations
  const [researchFocus, setResearchFocus] = useState<"comprehensive" | "specific" | "products">("comprehensive")
  const [specificDivision, setSpecificDivision] = useState("")
  const [regionFocus, setRegionFocus] = useState<"global" | "specific">("global")
  const [specificRegion, setSpecificRegion] = useState("")
  
  // Research scope state for tracking user choices and sidebar communication
  const [researchScope, setResearchScope] = useState<{
    companyName: string
    regionFocus: string
    specificRegion: string
    researchFocus: string
    specificDivision: string
    step: number
    totalSteps: number
  } | null>(null)

  // Broadcast research scope updates to sidebar
  const broadcastScopeUpdate = (updates: Partial<NonNullable<typeof researchScope>>) => {
    console.log('🔍 broadcastScopeUpdate called with updates:', updates)
    if (!updates) return
    
    setResearchScope((prev) => {
      const newScope = {
        companyName: "",
        regionFocus: "",
        specificRegion: "",
        researchFocus: "",
        specificDivision: "",
        step: 1,
        totalSteps: 4,
      ...prev,
      ...updates,
    }
    
    console.log('🔔 Research scope update:', newScope)
    
    window.dispatchEvent(new CustomEvent('research-scope-update', { 
      detail: { scope: newScope } 
    }))
      
      return newScope
    })
  }
  
  // Reset conversation when stage changes to initial
  useEffect(() => {
    if (stage === "initial" && !feedbackMode) {
      setConversationHistory([
        {
          role: "assistant",
          content: "Hey there, which company would you like to research today?",
          timestamp: new Date(),
        },
      ])
      setUserInput("")
      setCompanyName("")
      setResearchFocus("comprehensive")
      setSpecificDivision("")
      setRegionFocus("global")
      setSpecificRegion("")
      broadcastScopeUpdate({ companyName: "", step: 1 })
      setIsProcessing(false)
      setProcessingSteps([])
      setCurrentStage("initial")
      setIsCollapsed(false)
      setShowConversationHistory(false)
    }
  }, [stage, feedbackMode])

  // Simulate LLM working in the background
  useEffect(() => {
    if (isProcessing) {
      const steps =
        currentStage === "processing-feedback"
          ? [
              "Processing your feedback... ",
              "Updating research parameters...",
              "Re-analyzing company data with new criteria...",
              "Refining search results...",
              "Generating updated report...",
            ]
          : [
              "Searching for company information...",
              `Finding recent news about ${companyName}...`,
              "Analyzing market position...",
              "Gathering financial data...",
              "Identifying key partnerships...",
              "Compiling sponsorship history...",
              "Analyzing target audience...",
              "Generating comprehensive report...",
            ]

      let currentStep = 0
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setProcessingSteps(steps.slice(0, currentStep + 1));
          currentStep++;
        } else {
          clearInterval(interval);
          // <<== PLACE THE LLM CALL HERE
          let combinedResult: any = null;
          const runLLM = async () => {
            try {
              // Build the region part of the prompt
              const regionText = regionFocus === "specific" ? ` in ${specificRegion}` : "";
              
              // Build the focus part of the prompt
              let focusText = "";
              if (researchFocus === "comprehensive") {
                focusText = "";
              } else if (researchFocus === "specific") {
                focusText = `, specifically their ${specificDivision} division`;
              }
              
              // PASS 1: Basic company info (keep working as-is)
              const structuredPrompt = `I would like to research the company ${companyName}${regionText}${focusText}. 

IMPORTANT: You must respond with ONLY valid JSON. Do not include any other text, explanations, or formatting. Retrieve the information from high quality, verifiable information such as from the company website, press releases, reputable media coverage and high authority publishers

Please provide the company data in this exact JSON format:

{
  "industry": "<value>",
  "founded": "<value>",
  "website": "<value>",
  "headquarters": "<value>",
  "annualRevenue": "<value with appropriate currency symbol for company's primary market>",
  "employees": "<value>"
}

DO NOT add any explanations, dates, parentheses, or additional context to values.`;

              // PASS 2: Company overview sections (shorter, focused searches)
              const overviewPrompt = `Research ${companyName}${regionText} and provide:
              
1. Company Overview (100-150 words): Global footprint, core business divisions and brands, primary service lines, main offices
2. Company Background (150-350 words): Brief history of the company, key milestones, organisational structure, defining values
3. Financial Overview (100-200 words): Key financial performance with specific datapoints, stability indicators, ownership structure, funding and recent acquisitions
4. Audience Segmentation (50-75 words): Target audiences, current customer types, emerging segments

Focus on factual information from company press releases, financial reports, and reputable business sources.

SOURCES REQUIREMENTS (STRICT):
- For EACH section, provide a separate list of 2–8 source URLs that were actually used to write THAT section.
- Include ONLY direct, verifiable URLs (no labels or titles). One URL per line.
- Do NOT reuse links across sections unless the same source was genuinely used for both.
- Do NOT include sources that weren't used for the section's content.
- Prefer primary sources (company filings, newsroom, investor relations) and high-authority media.
- Place the section's sources immediately after its content as:
  "Sources:"
  <URL 1>
  <URL 2>
  ....
- Do not include any additional commentary around the URLs.

Your answer will be reformatted later, so keep each section’s content followed immediately by its own "Sources:" block as specified above.`;

              // PASS 3: Marketing Activity (restored detailed structure)
              const marketingPrompt = `Research ${companyName}${regionText}${focusText} recent and current marketing activities.

Provide a detailed narrative analysis of current and recent global marketing activity. Include at least 5 specific named campaigns. For each campaign, bold the campaign name (e.g., **Christmas Campaign 2024:**) followed by the campaign details. For each campaign describe (where possible) the campaign name, campaign date or period, target audiences, messaging themes, measurable outcomes, creative concepts, channels used, and partnerships or collaborations. Do not make up the details of the campaigns, only use the information you find even if it is not complete.

Write this as flowing narrative text that naturally incorporates all the details about each campaign. Use bold formatting only for campaign names (e.g., **Christmas Campaign 2024:**). Never output ALL CAPS. Focus on high quality, verifiable information from the company website, press releases, reputable media coverage and high authority publishers. Avoid vague descriptions - all examples must reference verifiable sources, initiatives, or announcements.

IMPORTANT: 
- If you cannot find 5 specific campaigns within the last 3-5 years, extend your search beyond this timeframe to find the required 5 campaigns. Do not limit yourself to recent years if insufficient recent examples exist.
- If a region or division was specified, include regional or division-specific marketing details with concrete examples of events, digital campaigns, or key channel activations, including timing, format, target audience, and strategic rationale.

CRITICAL: 
-Include inline source links using markdown format [Link Text](URL) for all verifiable information.
-Do not start your response with generic time phrases like "over the past five years". Instead, use flexible language that reflects the actual timeframe of the content you found.`;

              // PASS 4: Sponsorships & Experiential (dedicated search for depth)
              const sponsorshipsPrompt = `Research ${companyName}${regionText}${focusText} recent and current sponsorship portfolio and experiential initiatives.

Provide a detailed narrative analysis of at least 5 specific named sponsorships in sports, arts, culture, entertainment, or lifestyle. For each sponsorship, bold the sponsorship name (e.g., **McLaren Racing Partnership:**) followed by the details (if available) such as exact or approximate start/end dates, geographic location, event/partner name, activation channels, budget or scale indicators, strategic fit with brand goals, and measurable outcomes (audience reach, media coverage, ROI, engagement metrics). Do not make up the details of the sponsorships, only use the information you find even if it is not complete.

For experiential initiatives, identify and describe at least 3 named initiatives such as VIP/client-only events, curated experiences, global tours, or museum tie-ins. For each initiative, bold the event name in the form **Event Name:** followed by the initiative details (if available) such as the dates and location, purpose/context, audience profile, unique experiential elements, cultural or thought leadership integration, and measurable impact. Do not make up the details of the initiatives, only use the information you find even if it is not complete.

Write this as flowing narrative text. Use bold formatting only for sponsorship and experiential initiative names (e.g., **Cisco Live:**). Do not use any headings (no #, ##, or HTML <h1>–<h6>), lists, or title case; keep everything as normal paragraph text in sentence case. Never output ALL CAPS. Focus on verifiable information from the company website, press releases, high authority news sources and publishers. Avoid vague statements like 'supports local events'. All examples must reference named events, partners, or programs with verifiable details. 

IMPORTANT: 
- If you cannot find 5 specific sponsorships within the last 3-5 years, extend your search beyond this timeframe to find the required 5 sponsorships. Similarly, if you cannot find 3 experiential initiatives within the last 3-5 years, extend your search to find the required 3 initiatives. Do not limit yourself to recent years if insufficient recent examples exist.
- If a region or division was specified, include regional or division-specific sponsorship details with concrete examples of events, partnerships, or initiatives, including timing, format, target audience, and strategic rationale.

CRITICAL: 
-Include inline source links using markdown format [Link Text](URL) for all verifiable information.
-Do not start your response with generic time phrases like "over the past five years". Use flexible language that reflects the actual timeframe found.`;

              // --- PASS 5A: Social Media ONLY (keep your last good social prompt here)
              const socialMediaPrompt = `Research ${companyName}${regionText} social media presence
              
Social Media (250-350 words):

CRITICAL: Your response MUST begin with this exact bullet list format. Do not skip this step and do not write anything before this list:

- YouTube: [handle or link]
- Instagram: [handle or link]
- TikTok: [handle or link]
- Facebook: [handle or link]
- LinkedIn: [handle or link]
- X/Twitter: [handle or link]

ONLY include platforms where you can find the official/verified handle. If not found, omit that line entirely.

After the bullet list, write a flowing narrative analysis focusing on the 2-3 MOST ACTIVE platforms (based on follower count). Describe their content style and tone, posting frequency, audience engagement, visual identity and brand voice, and strategic role in their overall social presence. Write this as continuous prose, not bullet points or subheadings.

MANDATORY:
- Do NOT include links to third-party blogs or websites
- Do NOT include specific post URLs
- Only link to official social media handles in the bullet list
-Focus on high-level, aggregate insights from the last 6-12 months only. 
-Do not make up the details of the platforms, only use the information you find even if it is not complete.`;


              // --- PASS 5B: Strategic Focus ONLY (separate prompt with links required)
              const strategicFocusPrompt = ` 
Mode: show sources — every paragraph must contain at least one inline markdown citation [SourceName](URL).        
              
Research the strategic focus of ${companyName}${regionText}.

Strategic Focus (175-250 words):
- Explain core strategy and differentiation, brand traits and positioning, competitive stance, and 2–3 named growth/communication priorities.

Each factual or strategic statement must include a markdown citation exactly like this:
Apple emphasizes privacy and seamless integration [Reuters](https://www.reuters.com)

Citation Rules (Hard Requirements):
1. Every factual or strategic claim must end with an inline citation [SourceName](URL).
2. No claim may appear without a citation. 
3. Include a minimum of two distinct high-authority sources - more if multiple claims are made.
4. If fewer than two valid sources are found, run another search before generating the summary.
5. Before writing, search again if you cannot locate verifiable sources.

Example pattern (follow exactly):  
 Nike invests in sustainability initiatives [Reuters](https://www.reuters.com) and expands direct-to-consumer channels [Company Press Release](https://news.nike.com). 

Source Quality - Hard Constraints:
-Never use student essays, personal blogs, AI-generated summaries, content farms, or SEO spam.
-Use only the following for citations and factual grounding:
1.The official ${companyName} website
2.Verified press releases from ${companyName} or recognized newswires
3.Major business and news outlets (e.g., bloomberg.com, reuters.com, wsj.com, ft.com, cnbc.com, apnews.com)
4.Trade or industry publications with editorial oversight (e.g., adweek.com, campaignlive.com, techcrunch.com)

Domain Exclusions:
Do not use or cite any source whose domain includes:
scribd, panmore, accelingo, latterly, blogspot, medium.com (unless the official ${companyName} account), wordpress, quora, fandom, slideshare, essay, ai-summary, contentfarm.

If retrieved results include any of these excluded domains, discard them and repeat the search until at least two valid, high-authority sources are found.

Output Format:
- Output only the Strategic Focus section.
- Each factual or strategic sentence must end with an inline citation

Self-Check Before Finalizing:
If any sentence lacks a [SourceName](URL) citation, regenerate that sentence with one.
The final output must contain at least two distinct citations.

Example output:
Nike emphasizes digital transformation to deepen consumer relationships [Reuters](https://www.reuters.com).  
The company invests in sustainable materials and circular-design innovation [Nike Press Release](https://news.nike.com). 
`;

              // Execute all searches in parallel for better performance
              console.log('🚀 Starting multi-pass research...');
              
              const [
                structuredOutput,
                overviewOutput,
                marketingOutput,
                sponsorshipsOutput,
                socialMediaText,          // NEW
                strategicFocusText        // NEW
              ] = await Promise.all([
                getStructuredData(structuredPrompt),
                getDetailedAnalysis(overviewPrompt), // Light search - just company info
                getDetailedAnalysisWithCitations(marketingPrompt), // Heavy search - needs campaign URLs
                getDetailedAnalysisWithCitations(sponsorshipsPrompt), // Heavy search - needs sponsorship URLs
                getDetailedAnalysisWithCitations(socialMediaPrompt),    // Social links OK here
                getDetailedAnalysisWithCitations(strategicFocusPrompt) // Citations allowed here
              ]);

              // Combine the two sections for the existing formatter/schema
              const socialMediaOutput = `${socialMediaText}\n\n${strategicFocusText}`;

              console.log('✅ All search passes completed');

              // DEBUG: Log raw search outputs to see what each section returns
              console.log('🔍 DEBUG: Raw search outputs:');
              console.log('📋 Structured Output:', structuredOutput);
              console.log('📚 Overview Output:', overviewOutput);
              console.log('📈 Marketing Output:', marketingOutput);
              console.log('🎯 Sponsorships Output:', sponsorshipsOutput);
              console.log('📱 Social Media Output:', socialMediaText);
              console.log('📈 Strategic Focus Output:', strategicFocusText);

              // The formatting calls
              const [
                formattedOverview,
                formattedMarketing,
                formattedSponsorships,
                formattedSocialMedia
              ] = await Promise.all([
                getFormattedData(overviewOutput, overviewSchema),        
                getFormattedData(marketingOutput, marketingSchema),     
                getFormattedData(sponsorshipsOutput, sponsorshipsSchema), 
                getFormattedData(socialMediaOutput, socialMediaSchema) // now contains both sections
              ]);

              console.log('✅ All formatting passes completed');
              console.log('🔍 DEBUG: After formatting - what we got back:');
              console.log('�� Overview formatted:', formattedOverview);
              console.log('📈 Marketing formatted:', formattedMarketing);
              console.log('🎯 Sponsorships formatted:', formattedSponsorships);
              console.log('📱 Social Media formatted:', formattedSocialMedia);

              // Create the combined result
              combinedResult = {
                structuredData: structuredOutput,
                detailedAnalysis: {
                  companyOverview: formattedOverview.companyOverview,
                  companyBackground: formattedOverview.companyBackground,
                  financialOverview: formattedOverview.financialOverview,
                  audienceSegmentation: formattedOverview.audienceSegmentation,
                  marketingActivity: formattedMarketing.marketingActivity,
                  sponsorshipsExperiential: formattedSponsorships.sponsorshipsExperiential,
                  socialMediaPresence: formattedSocialMedia.socialMediaPresence,
                  strategicFocus: formattedSocialMedia.strategicFocus
                },
                metadata: {
                  companyName,
                  regionFocus,
                  specificRegion,
                  researchFocus,
                  specificDivision,
                  timestamp: new Date().toISOString(),
                  searchPasses: 5,
                  formattingPasses: 4
                }
              };

              // After creating combinedResult, add this debug log:
              console.log('🔍 DEBUG: combinedResult structure:');
              console.log('�� Marketing Activity:', combinedResult.detailedAnalysis.marketingActivity);
              console.log('🎯 Sponsorships:', combinedResult.detailedAnalysis.sponsorshipsExperiential);
              console.log('📋 Full combinedResult:', JSON.stringify(combinedResult, null, 2));
              

              setLlmResult(JSON.stringify(combinedResult, null, 2));
              setStructuredData(combinedResult);
              
            } catch (e) {
              console.error('Research failed:', e);
              setLlmResult("Error: " + (e as Error).message);
            } finally {
              setIsProcessing(false);
              if (currentStage === "processing-feedback") {
                onFeedbackComplete?.();
              } else {
                // FIX: Check if combinedResult exists before using it
                if (combinedResult) {
                onResponse("results", companyName, JSON.stringify(combinedResult));
                } else {
                  onResponse("results", companyName, "");
                }
              }
            }
          };
  
          setTimeout(runLLM, 1500); // Small delay after steps complete
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isProcessing, companyName, onResponse, currentStage, onFeedbackComplete, setLlmResult, llmResult, researchFocus, specificDivision, regionFocus, specificRegion])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const scrollToBottom = () => {
      if (conversationEndRef.current) {
        conversationEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        })
      }
    }

    // Small delay to ensure DOM has updated
    const timeoutId = setTimeout(scrollToBottom, 100)

    return () => clearTimeout(timeoutId)
  }, [conversationHistory])

  // Extract button options from assistant message content
  const extractOptions = (content: string): Array<{ value: string; label: string; description: string }> => {
    if (!content.includes('1.') || !content.includes('2.')) return []
    
    // Region choice pattern
    if (content.includes('Global overview') && content.includes('Specific region')) {
      return [
        { value: '1', label: 'Global overview', description: 'Worldwide operations' },
        { value: '2', label: 'Specific region', description: 'Focus on one market' }
      ]
    }
    
    // Division choice pattern
    if (content.includes('Comprehensive overview') && content.includes('Specific division')) {
      return [
        { value: '1', label: 'Comprehensive overview', description: 'All business areas' },
        { value: '2', label: 'Specific division', description: 'Focus on one unit' }
      ]
    }
    
    return []
  }

  // Handle quick selection from button cards
  const handleQuickSelect = (value: string) => {
    if (!value) return
    
    setUserInput(value)
    // Trigger form submission after a brief moment
    setTimeout(() => {
      const form = document.querySelector('form')
      form?.requestSubmit()
    }, 50)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    console.log('🔍 handleSubmit called, currentStage:', currentStage)

    // Validate input based on current stage
    const trimmedInput = userInput.trim();
    let validationResult;
    let validatedInput = trimmedInput;

    if (currentStage === "initial") {
      validationResult = validateCompanyName(trimmedInput);
      validatedInput = validationResult.sanitized;
    } else if (currentStage === "region-specific") {
      validationResult = validateRegionName(trimmedInput);
      validatedInput = validationResult.sanitized;
    } else if (currentStage === "division-specific") {
      validationResult = validateDivisionName(trimmedInput);
      validatedInput = validationResult.sanitized;
    } else if (currentStage === "region" || currentStage === "division") {
      validationResult = validateNumericChoice(trimmedInput, ["1", "2"]);
      validatedInput = validationResult.sanitized;
    } else {
      // For other stages, just use trimmed input
      validationResult = { isValid: true, sanitized: trimmedInput, issues: [], blocked: false };
      validatedInput = trimmedInput;
    }

    // If input was completely blocked (only malicious content), show error message and reject
    if (validationResult.blocked || (!validationResult.isValid && validatedInput === "")) {
      setValidationError("Invalid input detected");
      setTimeout(() => setValidationError(""), 3000);
      return; // Silent rejection - input field just doesn't respond
    }

    // Add user message to conversation (use original input for display, validated for processing)
    const newUserMessage = {
      role: "user",
      content: validatedInput, // Use validated/sanitized input for display
      timestamp: new Date(),
    }

    let assistantResponse = ""
    let nextStage = ""

    if (currentStage === "initial") {
      setCompanyName(validatedInput) // Use validated input for state
      console.log('🔍 About to call broadcastScopeUpdate with:', { companyName: validatedInput, step: 2 })
      broadcastScopeUpdate({ companyName: validatedInput, step: 2 })
      assistantResponse = `Great! How would you like me to focus the research on ${validatedInput}?

1. Global overview (worldwide operations)
2. Specific region or market

Please choose 1 or 2, or describe your preference.`
      nextStage = "region"
      setCurrentStage("region")
    } else if (currentStage === "region") {
      const userResponse = validatedInput; // Use validated input
      
      if (userResponse === "1") {
        setRegionFocus("global");
        setSpecificRegion("global");
        console.log('🔍 About to call broadcastScopeUpdate with:', { regionFocus: "Global", specificRegion: "Global", step: 3 })
        broadcastScopeUpdate({ regionFocus: "Global", specificRegion: "Global", step: 3 })
        assistantResponse = `Perfect! Now how would you like me to focus the research on ${companyName}?

1. Comprehensive overview (all business areas)
2. Specific division or business unit

Please choose 1 or 2.`
        nextStage = "division"
        setCurrentStage("division")
      } else if (userResponse === "2") {
        setRegionFocus("specific");
        broadcastScopeUpdate({ regionFocus: "Specific Region", step: 2.5 })
        assistantResponse = `Great! Which specific region or market would you like me to focus on? For example: North America, Europe, Asia Pacific, Latin America, or a specific country.`
        nextStage = "region-specific"
        setCurrentStage("region-specific")
      } else {
        // Invalid input - ask them to choose 1 or 2
        assistantResponse = `Please choose 1 for global overview or 2 for specific region.`
        nextStage = "region"
        setCurrentStage("region")
      }
    } else if (currentStage === "region-specific") {
      setSpecificRegion(validatedInput);
      broadcastScopeUpdate({ specificRegion: validatedInput, step: 3 })
      assistantResponse = `Perfect! Now how would you like me to focus the research on ${companyName} in ${validatedInput}?

1. Comprehensive overview (all business areas)
2. Specific division or business unit

Please choose 1 or 2.`
      nextStage = "division"
      setCurrentStage("division")
    } else if (currentStage === "division") {
      const userResponse = validatedInput; // Use validated input
      
      if (userResponse === "1") {
        setResearchFocus("comprehensive");
        broadcastScopeUpdate({ researchFocus: "Comprehensive", step: 4 })
        // Don't set specificDivision for comprehensive overview
        assistantResponse = `Perfect! I'll provide a research report for ${companyName}${regionFocus === "specific" ? ` in ${specificRegion}` : " globally"}. Sound good?`
        nextStage = "confirmation"
        setCurrentStage("confirmation")
      } else if (userResponse === "2") {
        setResearchFocus("specific");
        broadcastScopeUpdate({ researchFocus: "Specific Division", step: 3.5 })
        assistantResponse = `Great! Which specific division or business unit would you like me to focus on?`
        nextStage = "division-specific"
        setCurrentStage("division-specific")
      } else {
        // Invalid input - ask them to choose 1 or 2
        assistantResponse = `Please choose 1 for comprehensive overview or 2 for specific division.`
        nextStage = "division"
        setCurrentStage("division")
      }
    } else if (currentStage === "division-specific") {
      setSpecificDivision(validatedInput);
      broadcastScopeUpdate({ specificDivision: validatedInput, step: 4 })
      assistantResponse = `Perfect! I'll provide a research report for ${companyName}${regionFocus === "specific" ? ` in ${specificRegion}` : " globally"}, focusing on their ${validatedInput} division. Sound good?`
      nextStage = "confirmation"
      setCurrentStage("confirmation")
    } else if (currentStage === "confirmation") {
      // Handle user's affirmative response
      assistantResponse = "Great! Let me gather all the relevant information for you. This might take a moment..."
      setIsProcessing(true)
      nextStage = "processing"
      setCurrentStage("processing")
    } else if (currentStage === "feedback") {
      // Analyze feedback and potentially ask clarifying questions
      const feedback = validatedInput.toLowerCase()

      if (feedback.includes("industry") || feedback.includes("sector")) {
        assistantResponse =
          "Got it! Which industry would you prefer me to focus on? For example: healthcare, technology, renewable energy, financial services, etc."
        nextStage = "feedback-clarification"
        setCurrentStage("feedback-clarification")
      } else if (feedback.includes("size") || feedback.includes("employee") || feedback.includes("revenue")) {
        assistantResponse =
          "Understood! What company size are you looking for? For example: 'startups under 100 employees', 'mid-size companies 500-5000 employees', or 'large enterprises 10,000+ employees'?"
        nextStage = "feedback-clarification"
        setCurrentStage("feedback-clarification")
      } else if (feedback.includes("region") || feedback.includes("location") || feedback.includes("geographic")) {
        assistantResponse =
          "I see! Which geographic region should I focus on? For example: North America, Europe, Asia Pacific, or a specific country?"
        nextStage = "feedback-clarification"
        setCurrentStage("feedback-clarification")
      } else if (feedback.includes("different company") || feedback.includes("another company")) {
        assistantResponse = "No problem! What company would you like me to research instead?"
        nextStage = "feedback-clarification"
        setCurrentStage("feedback-clarification")
      } else {
        // Generic feedback - ask for more specifics with context from user input
        const contextualSuggestions = []

        if (feedback.includes("more") || feedback.includes("add") || feedback.includes("include")) {
          contextualSuggestions.push("add more detailed information about specific aspects")
        }
        if (feedback.includes("less") || feedback.includes("remove") || feedback.includes("exclude")) {
          contextualSuggestions.push("focus on fewer areas with deeper analysis")
        }
        if (feedback.includes("recent") || feedback.includes("latest") || feedback.includes("current")) {
          contextualSuggestions.push("emphasize more recent developments and news")
        }
        if (feedback.includes("financial") || feedback.includes("revenue") || feedback.includes("profit")) {
          contextualSuggestions.push("expand the financial analysis section")
        }
        if (feedback.includes("competitor") || feedback.includes("competition") || feedback.includes("market")) {
          contextualSuggestions.push("include more competitive landscape analysis")
        }
        if (feedback.includes("partnership") || feedback.includes("collaboration") || feedback.includes("alliance")) {
          contextualSuggestions.push("detail their strategic partnerships and collaborations")
        }

        const baseMessage = `Thanks for the feedback! Based on your input "${validatedInput}", I can help you refine the research.`

        if (contextualSuggestions.length > 0) {
          assistantResponse = `${baseMessage} Would you like me to ${contextualSuggestions.join(", or ")}? Please let me know which specific aspects you'd like me to adjust.`
        } else {
          assistantResponse = `${baseMessage} Could you be more specific about what you'd like me to adjust? For example, would you like me to focus more on their recent developments, expand on their financial performance, include more partnership details, or analyze their competitive position?`
        }

        nextStage = "feedback-clarification"
        setCurrentStage("feedback-clarification")
      }
    } else if (currentStage === "feedback-clarification") {
      assistantResponse = "Perfect! Let me update the research with your requirements. This will take a moment..."
      setIsProcessing(true)
      nextStage = "processing-feedback"
      setCurrentStage("processing-feedback")
    }

    const newAssistantMessage = {
      role: "assistant",
      content: assistantResponse,
      timestamp: new Date(),
    }

    setConversationHistory((prev) => [...prev, newUserMessage, newAssistantMessage])

    if (currentStage !== "confirmation" && currentStage !== "processing") {
      onResponse(nextStage, validatedInput)
    }

    setUserInput("")
  }

  return (
    <>
      {/* Header - moved outside and repositioned */}
      <div className="mb-6 ml-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Network className="h-5 w-5 text-gray-600" />
            <h1 className="text-base font-bold uppercase tracking-wide">AI Research Co-Pilot</h1>
          </div>
          {feedbackMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-600 hover:text-gray-800"
            >
              {isCollapsed ? "Expand" : "Minimize"}
            </Button>
          )}
        </div>
        {!feedbackMode && (
          <p className="text-body text-gray-600">
            Search the web and research your company using our AI-powered co-pilot
          </p>
        )}
      </div>

      <div
        className={`flex flex-col ${feedbackMode && isCollapsed ? "h-auto" : "h-full"} p-6 ${feedbackMode ? "border-2 border-orange-200 rounded-lg bg-orange-50/10" : ""}`}
      >
        {/* Feedback Mode Indicator */}
        {feedbackMode && !isCollapsed && (
          <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-800 uppercase tracking-wide">Feedback Mode Active</p>
                <p className="text-xs text-orange-600">Provide feedback to refine the research results</p>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the content remains the same */}
        {isProcessing ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center space-y-24 max-w-2xl">
              <div className="flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-black" />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-wide">Generating Brand Research</h2>
              <div className="space-y-4 text-left">
                {processingSteps
                  .filter((step) => step && step.trim())
                  .map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-black"></div>
                      <p className="text-body text-gray-800">{step}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Conversation Thread - only show when not collapsed or not in feedback mode */}
            <div className="flex-1 space-y-4 mb-6 overflow-y-auto max-h-[400px] scroll-smooth">
              {/* Show conversation history toggle button in feedback mode */}
              {feedbackMode && conversationHistory.length > 1 && (
                <div className="flex justify-center pb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConversationHistory(!showConversationHistory)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    {showConversationHistory
                      ? "Show less"
                      : `View conversation history (${conversationHistory.length - 1} earlier messages)`}
                  </Button>
                </div>
              )}

              {/* Display messages based on feedback mode and history toggle */}
              {(feedbackMode && !showConversationHistory ? conversationHistory.slice(-1) : conversationHistory).map(
                (message, index, displayedMessages) => (
                  <div
                    key={feedbackMode && !showConversationHistory ? `recent-${index}` : index}
                    className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white">
                        <Lightbulb className="h-4 w-4 text-gray-600" />
                      </div>
                    )}

                    <div className={`max-w-[80%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <p className="text-body text-gray-800 leading-relaxed">{message.content}</p>
                      
                      {/* Add clickable button options for numbered choices */}
                      {message.role === "assistant" && 
                       index === displayedMessages.length - 1 && 
                       extractOptions(message.content).length > 0 && (
                        <div className="mt-4 flex gap-3">
                          {extractOptions(message.content).map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleQuickSelect(option.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleQuickSelect(option.value)}
                              aria-label={`Select ${option.label}`}
                              tabIndex={0}
                              role="button"
                              className="flex-1 text-left bg-white border-2 border-gray-200 hover:border-black hover:bg-gray-50 rounded-lg p-4 transition-all duration-200 group"
                            >
                              <div className="font-semibold text-sm group-hover:text-black">{option.label}</div>
                              <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white">
                        <Star className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ),
              )}

              {/* Invisible element to scroll to */}
              <div ref={conversationEndRef} className="h-1" />
            </div>

            {/* Show current message when collapsed in feedback mode */}
            {feedbackMode && isCollapsed && (
              <div className="mb-6">
                <div className="flex items-start gap-4 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white">
                    <Lightbulb className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="max-w-[80%] text-left">
                    <p className="text-body text-gray-800 leading-relaxed">
                      {conversationHistory[conversationHistory.length - 1]?.content}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Input Area - always visible */}
            <div className="pt-6">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <textarea
                  placeholder={
                    currentStage === "feedback" || currentStage === "feedback-clarification"
                      ? "Try: 'Focus more on their recent partnerships' or 'Include more financial data' or 'Add information about their sustainability initiatives' or 'Expand on their target audience demographics'"
                      : "Type your response..."
                  }
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  maxLength={200}
                  className="flex-1 bg-white border-gray-200 rounded-md px-3 py-2 h-20 resize-none border text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <Button type="submit" size="icon" className="bg-black text-white hover:bg-gray-800">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
              {validationError && (
                <div className="text-red-600 text-sm mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md">
                  {validationError}
                </div>
              )}
            </div>

            {/* Progress Stepper - only show after company name entered */}
            {!feedbackMode && currentStage !== 'initial' && companyName && (
              <div className="mt-6 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide">
                  <span className={currentStage === 'initial' ? 'text-black' : 'text-gray-400'}>
                    1. Company
                  </span>
                  <div className="h-px flex-1 mx-2 bg-gray-300" />
                  <span className={['region', 'region-specific'].includes(currentStage) ? 'text-black' : 'text-gray-400'}>
                    2. Region
                  </span>
                  <div className="h-px flex-1 mx-2 bg-gray-300" />
                  <span className={['division', 'division-specific'].includes(currentStage) ? 'text-black' : 'text-gray-400'}>
                    3. Scope
                  </span>
                  <div className="h-px flex-1 mx-2 bg-gray-300" />
                  <span className={currentStage === 'confirmation' ? 'text-black' : 'text-gray-400'}>
                    4. Confirm
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
