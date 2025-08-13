"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ContactInfoPanel from "./contact-info-panel"

interface BrandProfilePanelProps {
  company: any
}

export default function BrandProfilePanel({ company }: BrandProfilePanelProps) {
  const [activeTab, setActiveTab] = useState("overview")

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
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-sm">Global Marketing</h5>
                        <p className="text-sm text-muted-foreground">
                          {company.detailedAnalysis.marketingActivity.globalMarketing}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">Regional Marketing</h5>
                        <p className="text-sm text-muted-foreground">
                          {company.detailedAnalysis.marketingActivity.regionalMarketing}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Sponsorships & Experiential */}
              {company.detailedAnalysis?.sponsorshipsExperiential && (
                <AccordionItem value="sponsorships-experiential">
                  <AccordionTrigger>Sponsorships & Experiential</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-sm">Sponsorships</h5>
                        <p className="text-sm text-muted-foreground">
                          {company.detailedAnalysis.sponsorshipsExperiential.sponsorships}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">Experiential Events</h5>
                        <p className="text-sm text-muted-foreground">
                          {company.detailedAnalysis.sponsorshipsExperiential.experientialEvents}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Social Media Presence */}
              {company.detailedAnalysis?.socialMediaPresence && (
                <AccordionItem value="social-media-presence">
                  <AccordionTrigger>Social Media Presence</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      {company.detailedAnalysis.socialMediaPresence.content}
                    </p>
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

            <div>
              <h3 className="mb-2 text-lg font-semibold">Sources</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>
                  Company website: <span className="text-primary">{company.website}</span>
                </li>
                <li>Annual report (2023)</li>
                <li>Industry analysis by Market Research Firm</li>
                <li>Press releases and news articles</li>
              </ul>
            </div>
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
