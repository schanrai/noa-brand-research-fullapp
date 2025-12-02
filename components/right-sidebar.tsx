"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import brandsData from "@/data/brands.json"
import { isReportOnlyMode } from "@/lib/feature-flags"

const STORAGE_KEY = 'recently-viewed-companies'

export default function RightSidebar() {
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [recentCompanies, setRecentCompanies] = useState<any[]>([])
  const [isRecentExpanded, setIsRecentExpanded] = useState(false)

  // Simple sessionStorage functions
  const getRecentCompanies = (): any[] => {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  }

  const addRecentCompany = (company: any) => {
    if (!company?.id || !company?.companyName) return
    
    const recent = getRecentCompanies()
    const updated = [
      company,
      ...recent.filter(c => c.id !== company.id)
    ].slice(0, 5) // Keep only last 5
    
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setRecentCompanies(updated)
    } catch (error) {
      console.error('Error saving recent companies:', error)
    }
  }

  // Handle recent company clicks
  const handleRecentCompanyClick = (company: any) => {
    // Dispatch event to show company in main area
    window.dispatchEvent(new CustomEvent('show-company', { detail: { company } }))
  }

  useEffect(() => {
    setChatHistory(brandsData.chatHistory)
    setRecentCompanies(getRecentCompanies())

    // Listen for company viewed events
    const handleCompanyViewed = (event: CustomEvent) => {
      const company = event.detail.company
      addRecentCompany(company)
    }

    window.addEventListener('company-viewed', handleCompanyViewed as EventListener)
    
    return () => {
      window.removeEventListener('company-viewed', handleCompanyViewed as EventListener)
    }
  }, [])

  return (
    <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-200 bg-edge pt-6 md:pt-24 px-4 md:px-24 pb-6 md:pb-24">
      <div className="space-y-6 md:space-y-48">
        {!isReportOnlyMode() && (
          <>
            <div>
              <h2 className="mb-4 md:mb-24 text-sm font-bold uppercase tracking-wide">AI Co-pilot History</h2>
              <ScrollArea className="h-[200px] md:h-[300px] rounded-lg border border-gray-200 bg-white p-4 md:p-16">
                <div className="space-y-16">
                  {chatHistory.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-16 ${
                          message.role === "assistant" ? "bg-deep text-gray-600" : "bg-black text-white"
                        }`}
                      >
                        <p className="text-sm text-body leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator className="bg-gray-200" />
          </>
        )}

        <div>
          <div className="flex items-center justify-between mb-4 md:mb-24">
            <h2 className="text-sm font-bold uppercase tracking-wide">Recently Viewed Companies</h2>
            {/* Mobile-only collapse/expand button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRecentExpanded(!isRecentExpanded)}
              className="md:hidden h-8 w-8 p-0"
            >
              {isRecentExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
              <span className="sr-only">{isRecentExpanded ? 'Collapse' : 'Expand'}</span>
            </Button>
          </div>
          
          {/* Desktop: Always show, Mobile: Collapsible */}
          <div className={`space-y-8 ${!isRecentExpanded ? 'hidden md:block' : ''}`}>
            {recentCompanies.length > 0 ? (
              recentCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleRecentCompanyClick(company)}
                  className="flex items-center gap-16 rounded-lg p-16 hover:bg-white transition-all duration-200 cursor-pointer hover-scale"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={company.logo} alt={company.companyName} />
                    <AvatarFallback className="bg-deep text-black font-bold text-xs">
                      {company.companyName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide">{company.companyName}</p>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">{company.industry}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">No recently viewed companies</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
