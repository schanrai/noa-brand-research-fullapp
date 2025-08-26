"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ContactInfoPanel from "./contact-info-panel"
import { marked } from 'marked';

interface BrandProfilePanelProps {
  company: any
}

export default function BrandProfilePanel({ company }: BrandProfilePanelProps) {
  // Determine if contacts tab should be shown (only when contacts exist)
  const hasContacts = company.contacts && company.contacts.length > 0;
  
  // Set initial active tab - always start with overview
  const [activeTab, setActiveTab] = useState("overview")

  // Ensure activeTab is valid - if contacts tab is selected but no contacts, default to overview
  const validActiveTab = hasContacts ? activeTab : (activeTab === "contacts" ? "overview" : activeTab);

  function renderMarkdownContent(content: string) {
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
        <Tabs value={validActiveTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-edge border border-gray-200 p-1 rounded-lg">
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
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Marketing Activity */}
              {company.detailedAnalysis?.marketingActivity && (
                <AccordionItem value="marketing-activity">
                  <AccordionTrigger>Marketing Activity</AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className="text-sm text-muted-foreground prose prose-sm max-w-none"
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
                      className="text-sm text-muted-foreground prose prose-sm max-w-none"
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
