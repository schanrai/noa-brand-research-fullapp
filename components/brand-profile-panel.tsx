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
  const [activeTab, setActiveTab] = useState("overview")

  // REMOVE THESE DEBUG LOGS:
  //console.log("🔍 BrandProfilePanel - sources:", company?.detailedAnalysis?.sources);
  //console.log("🔍 BrandProfilePanel - sources length:", company?.detailedAnalysis?.sources?.length);

  const renderSourceWithLinks = (source: string) => {
    // Check if it's a plain URL
    const urlRegex = /^https?:\/\/.+/;
    
    if (urlRegex.test(source.trim())) {
      // It's a plain URL, make it clickable
      return (
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {source}
        </a>
      );
    }
    
    // Otherwise, handle markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(source)) !== null) {
      if (match.index > lastIndex) {
        parts.push(source.slice(lastIndex, match.index));
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < source.length) {
      parts.push(source.slice(lastIndex));
    }
    return parts.length > 0 ? parts : source;
  };

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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
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
            <TabsTrigger
              value="contacts"
              className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-600 hover:text-black transition-colors"
            >
              Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Company Overview</h3>
              <p className="mt-2 text-muted-foreground">{company.description}</p>
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
              <div>
                <h4 className="text-sm font-medium">Website</h4>
                <p className="text-sm text-muted-foreground">{company.website}</p>
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
                    <p className="text-sm text-muted-foreground">
                      {company.detailedAnalysis.companyOverview.content}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Company Background */}
              {company.detailedAnalysis?.companyBackground && (
                <AccordionItem value="company-background">
                  <AccordionTrigger>Company Background</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      {company.detailedAnalysis.companyBackground.content}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Financial Overview */}
              {company.detailedAnalysis?.financialOverview && (
                <AccordionItem value="financial-overview">
                  <AccordionTrigger>Financial Overview</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      {company.detailedAnalysis.financialOverview.content}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Audience Segmentation */}
              {company.detailedAnalysis?.audienceSegmentation && (
                <AccordionItem value="audience-segmentation">
                  <AccordionTrigger>Target Audience</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      {company.detailedAnalysis.audienceSegmentation.content}
                    </p>
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
                    <p className="text-sm text-muted-foreground">
                      {company.detailedAnalysis.strategicFocus.content}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {company.detailedAnalysis?.sources && company.detailedAnalysis.sources.length > 0 && (
              <div className="mt-8 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">SOURCES</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {company.detailedAnalysis.sources.map((source: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {renderSourceWithLinks(source)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="contacts">
            {company.contacts.map((contact: any, index: number) => (
              <ContactInfoPanel key={index} contact={contact} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
