import React from 'react';

"use client"

import { useState } from "react"
import TopNavigation from "@/components/top-navigation"
import LeftSidebar from "@/components/left-sidebar"
import MainContent from "@/components/main-content"
import RightSidebar from "@/components/right-sidebar"
import ConfirmationToast from "@/components/confirmation-toast"
import brandsData from "@/data/brands.json"

export default function Home() {
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [searchStage, setSearchStage] = useState<"initial" | "region" | "division" | "results">("initial")
  const [filters, setFilters] = useState({
    region: "",
    industry: "",
    sponsorshipType: "",
    size: "",
    revenue: "",
  })

  // Toast notification state
  const [toastNotification, setToastNotification] = useState<{
    show: boolean
    type: "success" | "error" | "pending"
    company?: any
    message: string
  }>({
    show: false,
    type: "success",
    message: "",
  })

  const handleSearch = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters })

    // Check if all filters are empty (this indicates a reset/clear all action)
    const allFiltersEmpty =
      !newFilters.query &&
      !newFilters.region &&
      !newFilters.industry &&
      !newFilters.sponsorshipType &&
      !newFilters.size &&
      !newFilters.revenue

    if (allFiltersEmpty) {
      // Reset to initial state
      setSearchStage("initial")
      setSearchResults([])
      setSelectedCompany(null)
      return
    }

    // Filter companies based on the selected filters - only show companies already in CRM
    let results = brandsData.companies.filter((company) => company.inCRM)

    if (newFilters.query) {
      results = results.filter(
        (company) =>
          company.companyName.toLowerCase().includes(newFilters.query.toLowerCase()) ||
          company.description.toLowerCase().includes(newFilters.query.toLowerCase()),
      )
    }

    if (newFilters.region) {
      results = results.filter((company) =>
        company.regions.some((region: string) => region.toLowerCase().includes(newFilters.region.toLowerCase())),
      )
    }

    if (newFilters.industry) {
      results = results.filter((company) => company.industry.toLowerCase().includes(newFilters.industry.toLowerCase()))
    }

    if (newFilters.sponsorshipType) {
      results = results.filter((company) =>
        company.sponsorshipTypes.some((type: string) =>
          type.toLowerCase().includes(newFilters.sponsorshipType.toLowerCase()),
        ),
      )
    }

    if (newFilters.size) {
      // Add size filtering logic based on employee count
      const sizeRanges = {
        "1-10": [1, 10],
        "11-50": [11, 50],
        "51-200": [51, 200],
        "201-500": [201, 500],
        "501-1000": [501, 1000],
        "1001-5000": [1001, 5000],
        "5001-10000": [5001, 10000],
        "10001+": [10001, Number.POSITIVE_INFINITY],
      }

      const range = sizeRanges[newFilters.size as keyof typeof sizeRanges]
      if (range) {
        results = results.filter((company) => company.employees >= range[0] && company.employees <= range[1])
      }
    }

    if (newFilters.revenue) {
      // Add revenue filtering logic - this would need more sophisticated parsing
      // For now, we'll do a simple string match
      results = results.filter((company) =>
        company.annualRevenue.toLowerCase().includes(newFilters.revenue.toLowerCase()),
      )
    }

    setSearchResults(results)
    setSearchStage("results")
  }

  const handleCompanySelect = (company: any) => {
    setSelectedCompany(company)
  }

  const handleApprove = (companyId: string) => {
    const company = searchResults.find((c) => c.id === companyId)
    if (company) {
      // Show success toast notification
      setToastNotification({
        show: true,
        type: "success",
        company: company,
        message: company.inCRM
          ? `${company.companyName} has been updated in your CRM.`
          : `${company.companyName} has been added to your CRM.`,
      })

      // Update the company's CRM status in the results
      setSearchResults((prevResults) => prevResults.map((c) => (c.id === companyId ? { ...c, inCRM: true } : c)))
    }
  }

  const handleReject = (companyId: string) => {
    const company = searchResults.find((c) => c.id === companyId)
    if (company) {
      // Show rejection confirmation
      setToastNotification({
        show: true,
        type: "success",
        company: company,
        message: `${company.companyName} has been rejected.`,
      })

      // Remove the company from search results after a delay
      setTimeout(() => {
        setSearchResults((prevResults) => prevResults.filter((c) => c.id !== companyId))
      }, 2000)
    }
  }

  const handleToastDismiss = () => {
    setToastNotification({ ...toastNotification, show: false })

    // Reset to initial search state after toast is dismissed
    setTimeout(() => {
      setSearchStage("initial")
      setSearchResults([])
      setSelectedCompany(null)
      setFilters({
        region: "",
        industry: "",
        sponsorshipType: "",
        size: "",
        revenue: "",
      })
    }, 300) // Small delay to allow toast fade-out animation
  }

  const handleChatResponse = (stage: string, value: string) => {
    if (stage === "reset-to-initial") {
      // Handle reset from top navigation
      setSearchStage("initial")
      setSearchResults([])
      setSelectedCompany(null)
      setFilters({
        region: "",
        industry: "",
        sponsorshipType: "",
        size: "",
        revenue: "",
      })
    } else if (stage === "region") {
      setSearchStage("region")
      // In a real app, this would update the chat history
    } else if (stage === "division") {
      setSearchStage("division")
      // In a real app, this would update the chat history
    } else if (stage === "results") {
      // Create a mock company based on the user's input or find existing one
      let companyResult = brandsData.companies.find((company) =>
        company.companyName.toLowerCase().includes(value.toLowerCase()),
      )

      // If no existing company matches, create a mock one
      if (!companyResult) {
        companyResult = {
          id: "generated-1",
          companyName: value,
          industry: "Technology",
          hqLocation: "San Francisco, CA",
          division: "Consumer Electronics",
          description: `${value} is a leading global company with operations across multiple markets and divisions. The company has established itself as a key player in its industry with a focus on innovation and strategic partnerships.`,
          foundingDate: "2010-01-01",
          regions: ["North America", "Europe", "Asia Pacific"],
          annualRevenue: "$3.2B",
          lastFunding: "$200M Series D (2023)",
          totalFunding: "$500M",
          website: `https://${value.toLowerCase().replace(/\s+/g, "")}.com`,
          employees: 4200,
          targetAudience: "Global consumers and enterprise clients",
          sponsorshipTypes: ["Sports Events", "Tech Conferences", "Community Programs"],
          keySponsorships: ["Innovation Summit", "Global Partnership Awards", "Technology Excellence Program"],
          strategicFocus: "Expanding global market presence and strategic partnerships",
          profileURL: `/companies/${value.toLowerCase().replace(/\s+/g, "-")}`,
          outreachProfile: "Actively seeking strategic partnerships and sponsorship opportunities",
          lastUpdated: new Date().toISOString().split("T")[0],
          logo: "/placeholder.svg?height=80&width=80",
          inCRM: false,
          contacts: [
            {
              name: "John Smith",
              email: `john.smith@${value.toLowerCase().replace(/\s+/g, "")}.com`,
              title: "VP of Strategic Partnerships",
              source: "AI Research",
              relationshipNotes: "Generated contact based on company research",
            },
          ],
        }
      }

      setSearchResults([companyResult])
      setSearchStage("results")
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <TopNavigation onTabChange={handleChatResponse} />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar onSearch={handleSearch} />
        <MainContent
          searchResults={searchResults}
          selectedCompany={selectedCompany}
          onSelectCompany={handleCompanySelect}
          onApprove={handleApprove}
          onReject={handleReject}
          searchStage={searchStage}
          onChatResponse={(tab: string) => handleChatResponse(tab, "")}
        />
        <RightSidebar />
      </div>

      {/* Toast Notification */}
      {toastNotification.show && (
        <ConfirmationToast
          type={toastNotification.type}
          company={toastNotification.company}
          message={toastNotification.message}
          onDismiss={handleToastDismiss}
          autoHide={true}
          duration={5000}
        />
      )}
    </div>
  )
}