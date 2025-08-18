"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Send, Lightbulb, Star, Loader2, Network } from "lucide-react"
import { getLLMResearch, getStructuredData, getDetailedReport } from "@/lib/llm-client"

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
              "Processing your feedback...",
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
              
              // Update the structured data prompt to request JSON format
              const structuredPrompt = `I would like to research the company ${companyName}${regionText}${focusText}. 

IMPORTANT: You must respond with ONLY valid JSON. Do not include any other text, explanations, or formatting.

Please provide the company data in this exact JSON format:

{
  "industry": "<value>",
  "founded": "<value>",
  "website": "<value>",
  "headquarters": "<value>",
  "annualRevenue": "<value>",
  "employees": "<value>"
}`;
              
              // Update the detailed analysis prompt to request JSON format
              const detailedRegionText = regionFocus === "specific" ? `specifically their ${specificRegion} and ` : "";
              const detailedDivisionText = researchFocus === "comprehensive" ? "overall operations" : 
                                          researchFocus === "specific" ? `${specificDivision}` : "overall operations";
              
              const detailedPrompt = `I would like to research the company ${companyName}, ${detailedRegionText}${detailedDivisionText}.

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
    "globalMarketing": "<300-450 words about global marketing campaigns, strategies, and initiatives>",
    "regionalMarketing": "<300-450 words about regional marketing activities, local campaigns, and market-specific strategies>"
  },
  "sponsorshipsExperiential": {
    "sponsorships": "<300-450 words about sponsorship portfolio, partnerships, and brand collaborations>",
    "experientialEvents": "<300-450 words about experiential initiatives, events, and customer engagement programs>"
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
  }
}`;
              
              // Update the response handling to work with JSON data
              const structuredOutput = await getStructuredData(structuredPrompt);
              const detailedOutput = await getDetailedReport(detailedPrompt);

              // Combine both results into a single JSON object
              combinedResult = {
                structuredData: structuredOutput,
                detailedAnalysis: detailedOutput,
                metadata: {
                  companyName,
                  regionFocus,
                  specificRegion,
                  researchFocus,
                  specificDivision,
                  timestamp: new Date().toISOString()
                }
              };
              
              setLlmResult(JSON.stringify(combinedResult, null, 2));
              setStructuredData(combinedResult);
              
            } catch (e) {
              setLlmResult("Error: " + (e as Error).message);
            } finally {
              setIsProcessing(false);
              if (currentStage === "processing-feedback") {
                onFeedbackComplete?.();
              } else {
                // Pass the structured JSON data to the parent component
                onResponse("results", companyName, JSON.stringify(combinedResult));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    // Add user message to conversation
    const newUserMessage = {
      role: "user",
      content: userInput,
      timestamp: new Date(),
    }

    let assistantResponse = ""
    let nextStage = ""

    if (currentStage === "initial") {
      setCompanyName(userInput)
      assistantResponse = `Great! How would you like me to focus the research on ${userInput}?

1. Global overview (worldwide operations)
2. Specific region or market

Please choose 1 or 2, or describe your preference.`
      nextStage = "region"
      setCurrentStage("region")
    } else if (currentStage === "region") {
      const userResponse = userInput.trim();
      
      if (userResponse === "1") {
        setRegionFocus("global");
        setSpecificRegion("global");
        assistantResponse = `Perfect! Now how would you like me to focus the research on ${companyName}?

1. Comprehensive overview (all business areas)
2. Specific division or business unit

Please choose 1 or 2.`
        nextStage = "division"
        setCurrentStage("division")
      } else if (userResponse === "2") {
        setRegionFocus("specific");
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
      setSpecificRegion(userInput);
      assistantResponse = `Perfect! Now how would you like me to focus the research on ${companyName} in ${userInput}?

1. Comprehensive overview (all business areas)
2. Specific division or business unit

Please choose 1 or 2.`
      nextStage = "division"
      setCurrentStage("division")
    } else if (currentStage === "division") {
      const userResponse = userInput.trim();
      
      if (userResponse === "1") {
        setResearchFocus("comprehensive");
        // Don't set specificDivision for comprehensive overview
        assistantResponse = `Perfect! I'll provide a research report for ${companyName}${regionFocus === "specific" ? ` in ${specificRegion}` : " globally"}. Sound good?`
        nextStage = "confirmation"
        setCurrentStage("confirmation")
      } else if (userResponse === "2") {
        setResearchFocus("specific");
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
      setSpecificDivision(userInput);
      assistantResponse = `Perfect! I'll provide a research report for ${companyName}${regionFocus === "specific" ? ` in ${specificRegion}` : " globally"}, focusing on their ${userInput} division. Sound good?`
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
      const feedback = userInput.toLowerCase()

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

        const baseMessage = `Thanks for the feedback! Based on your input "${userInput}", I can help you refine the research.`

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
      onResponse(nextStage, userInput)
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
            <div className="flex-1 space-y-6 mb-6 overflow-y-auto max-h-[400px] scroll-smooth">
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
            </div>
          </>
        )}
      </div>
    </>
  )
}
