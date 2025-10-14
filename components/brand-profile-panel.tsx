"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ContactInfoPanel from "./contact-info-panel"
import { marked } from 'marked'
import { FileDown } from "lucide-react"
import { exportCompanyToPDF } from "@/lib/pdf-export"
import { isReportOnlyMode } from "@/lib/feature-flags"

interface BrandProfilePanelProps {
  company: any
}

export default function BrandProfilePanel({ company }: BrandProfilePanelProps) {
  // Simple check for contacts - don't interfere with other logic
  const hasContacts = company.contacts && company.contacts.length > 0;
  
  // Keep the original activeTab logic simple
  const [activeTab, setActiveTab] = useState("overview")

  const handlePDFDownload = async () => {
    try {
      await exportCompanyToPDF(company)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  function renderMarkdownContent(content: string) {
    // Add null check to prevent crashes
    if (!content) {
      return '<p>No content available</p>';
    }

    try {
      // Configure marked for safe rendering
      marked.setOptions({
        breaks: true, // Convert line breaks to <br>
        gfm: true,    // GitHub Flavored Markdown
      });
      
      // Convert markdown to HTML - handle both sync and async cases 
      let htmlContent = marked(content);
      
      // If it's a Promise, we need to handle it differently
      if (htmlContent instanceof Promise) {
        // For now, return the original content if it's async
        // In a real app, you'd want to make this function async
        return content;
      }
      
      // Add Tailwind classes to all links for styling and new window behavior
      htmlContent = htmlContent.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors" ');
      
      return htmlContent;
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return content.replace(/[<>]/g, '');
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-edge border border-gray-200 p-1 rounded-lg">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-600 hover:text-black transition-colors"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="report"
                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-600 hover:text-black transition-colors"
              >
                Full Report
              </TabsTrigger>
              {/* Only show contacts tab when there are actual contacts */}
              {hasContacts && (
                <TabsTrigger
                  value="contacts"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-600 hover:text-black transition-colors"
                >
                  Contacts
                </TabsTrigger>
              )}
            </TabsList>
            
            {isReportOnlyMode() && (
              <Button
                size="sm"
                onClick={handlePDFDownload}
                className="bg-black text-white hover:bg-gray-800"
              >
                <FileDown className="mr-2 h-4 w-4" />
                <span className="text-xs">Download as PDF</span>
              </Button>
            )}
          </div>

          {/* Keep all the existing TabsContent exactly as they were */}
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Company Overview</h3>
              <div
                className="mt-2 text-muted-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdownContent(company.description),
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Industry</h4>
                <p className="text-sm text-muted-foreground">{company.industry}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Founded</h4>
                <p className="text-sm text-muted-foreground">{new Date(company.foundingDate).toLocaleDateString()}</p>
              </div>
              {/* Website */}
              <div>
                <h4 className="text-sm font-medium">Website</h4>
                <p className="text-sm text-muted-foreground">
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors"
                  >
                    {company.website}
                  </a>
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Headquarters</h4>
                <p className="text-sm text-muted-foreground">{company.hqLocation}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Annual Revenue</h4>
                <p className="text-sm text-muted-foreground">{company.annualRevenue}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Employees</h4>
                <p className="text-sm text-muted-foreground">{company.employees.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Sponsorship Type</h4>
              <p className="text-sm text-muted-foreground">
                {company.sponsorshipTypes?.join(", ") || "Sports event, Conference, Non-profit"}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Last Updated:</span> {new Date(company.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="report" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {/* Company Overview */}
              {company.detailedAnalysis?.companyOverview && (
                <AccordionItem value="company-overview">
                  <AccordionTrigger>Company Overview</AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className="text-sm text-muted-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: renderMarkdownContent(company.detailedAnalysis.companyOverview.content) 
                      }}
                    />
                    {Array.isArray(company.detailedAnalysis.companyOverview.sources) && company.detailedAnalysis.companyOverview.sources.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-xs font-medium text-muted-foreground">Sources</h5>
                        <ul className="mt-1 space-y-1">
                          {company.detailedAnalysis.companyOverview.sources.map((src: string, i: number) => (
                            <li key={i}>
                              <a 
                                href={src} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors"
                              >
                                {src}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Company Background */}
              {company.detailedAnalysis?.companyBackground && (
                <AccordionItem value="company-background">
                  <AccordionTrigger>Company Background</AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className="text-sm text-muted-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: renderMarkdownContent(company.detailedAnalysis.companyBackground.content) 
                      }}
                    />
                    {Array.isArray(company.detailedAnalysis.companyBackground.sources) && company.detailedAnalysis.companyBackground.sources.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-xs font-medium text-muted-foreground">Sources</h5>
                        <ul className="mt-1 space-y-1">
                          {company.detailedAnalysis.companyBackground.sources.map((src: string, i: number) => (
                            <li key={i}>
                              <a 
                                href={src} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors"
                              >
                                {src}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Financial Overview */}
              {company.detailedAnalysis?.financialOverview && (
                <AccordionItem value="financial-overview">
                  <AccordionTrigger>Financial Overview</AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className="text-sm text-muted-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: renderMarkdownContent(company.detailedAnalysis.financialOverview.content) 
                      }}
                    />
                    {Array.isArray(company.detailedAnalysis.financialOverview.sources) && company.detailedAnalysis.financialOverview.sources.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-xs font-medium text-muted-foreground">Sources</h5>
                        <ul className="mt-1 space-y-1">
                          {company.detailedAnalysis.financialOverview.sources.map((src: string, i: number) => (
                            <li key={i}>
                              <a 
                                href={src} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors"
                              >
                                {src}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Audience Segmentation */}
              {company.detailedAnalysis?.audienceSegmentation && (
                <AccordionItem value="audience-segmentation">
                  <AccordionTrigger>Target Audience</AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className="text-sm text-muted-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: renderMarkdownContent(company.detailedAnalysis.audienceSegmentation.content) 
                      }}
                    />
                    {Array.isArray(company.detailedAnalysis.audienceSegmentation.sources) && company.detailedAnalysis.audienceSegmentation.sources.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-xs font-medium text-muted-foreground">Sources</h5>
                        <ul className="mt-1 space-y-1">
                          {company.detailedAnalysis.audienceSegmentation.sources.map((src: string, i: number) => (
                            <li key={i}>
                              <a 
                                href={src} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors"
                              >
                                {src}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Marketing Activity */}
              {company.detailedAnalysis?.marketingActivity && (
                <AccordionItem value="marketing-activity">
                  <AccordionTrigger>Marketing Activity</AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className="text-sm text-muted-foreground prose prose-sm prose-readable max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: renderMarkdownContent(company.detailedAnalysis.marketingActivity.content) 
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Sponsorships & Experiential */}
              {company.detailedAnalysis?.sponsorshipsExperiential && (
                <AccordionItem value="sponsorships-experiential">
                  <AccordionTrigger>Sponsorships & Experiential</AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className="text-sm text-muted-foreground prose prose-sm prose-readable max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: renderMarkdownContent(company.detailedAnalysis.sponsorshipsExperiential.content) 
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Social Media Presence */}
              {company.detailedAnalysis?.socialMediaPresence && (
                <AccordionItem value="social-media-presence">
                  <AccordionTrigger>Social Media Presence</AccordionTrigger>
                  <AccordionContent>
                    {/* Render handles first if they exist (null-safe for older results) */}
                    {company.detailedAnalysis.socialMediaPresence.handles && (
                      <div 
                        className="text-sm text-muted-foreground prose prose-sm max-w-none mb-4"
                        dangerouslySetInnerHTML={{ 
                          __html: renderMarkdownContent(company.detailedAnalysis.socialMediaPresence.handles) 
                        }}
                      />
                    )}
                    {/* Always render content (works for both old and new results) */}
                    <div 
                      className="text-sm text-muted-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: renderMarkdownContent(company.detailedAnalysis.socialMediaPresence.content) 
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Strategic Focus */}
              {company.detailedAnalysis?.strategicFocus && (
                <AccordionItem value="strategic-focus">
                  <AccordionTrigger>Strategic Focus</AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className="text-sm text-muted-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: renderMarkdownContent(company.detailedAnalysis.strategicFocus.content) 
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </TabsContent>

          {/* Only render contacts tab content when contacts exist */}
          {hasContacts && (
            <TabsContent value="contacts">
              {company.contacts.map((contact: any, index: number) => (
                <ContactInfoPanel key={index} contact={contact} />
              ))}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
