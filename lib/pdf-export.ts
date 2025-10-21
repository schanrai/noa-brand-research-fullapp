/**
 * PDF Export Utility
 * 
 * Generates and downloads PDF reports for brand research data.
 * Uses jsPDF for PDF generation and formats company data into a
 * professional report document.
 */

import { jsPDF } from 'jspdf';

interface CompanyData {
  companyName: string;
  industry?: string;
  hqLocation?: string;
  website?: string;
  foundingDate?: string;
  employees?: number;
  annualRevenue?: string;
  description?: string;
  detailedAnalysis?: {
    companyOverview?: { content: string; sources?: string[] };
    companyBackground?: { content: string; sources?: string[] };
    financialOverview?: { content: string; sources?: string[] };
    audienceSegmentation?: { content: string; sources?: string[] };
    marketingActivity?: { content: string };
    sponsorshipsExperiential?: { content: string };
    socialMediaPresence?: { handles: string; content: string };
    strategicFocus?: { content: string };
  };
}

/**
 * Export company research data to PDF
 * @param company - The company data to export
 */
export async function exportCompanyToPDF(company: CompanyData): Promise<void> {
  try {
    // Create new PDF document (A4 size, portrait)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = doc.splitTextToSize(text, contentWidth);
      const lineHeight = fontSize * 0.5; // keep spacing consistent everywhere

      let index = 0;
      while (index < lines.length) {
        // Lines that can fit on the current page
        const availableHeight = (pageHeight - margin) - yPosition;
        let availableLines = Math.floor(availableHeight / lineHeight);

        // If no space left, go to a new page
        if (availableLines <= 0) {
          doc.addPage();
          yPosition = margin;
          continue;
        }

        const end = Math.min(index + availableLines, lines.length);
        const slice = lines.slice(index, end);
        doc.text(slice, margin, yPosition);
        yPosition += slice.length * lineHeight + 3;
        index = end;
      }
    };

    const addSection = (title: string, content: string) => {
      // Normalize content (remove markdown formatting while keeping URLs visible)
      let processedContent = content
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
        .replace(/#+\s/g, '')
        .replace(/^[\s-]*$/gm, '');

      // Split text upfront to control the first N lines precisely
      const contentLineHeight = 10 * 0.5; // must match addText spacing
      const titleLineHeight = 12 * 0.5;
      const titleLines = doc.splitTextToSize(title, contentWidth);
      const allContentLines = doc.splitTextToSize(processedContent, contentWidth);
      const pinnedLinesCount = Math.min(3, allContentLines.length); // keep 2-3 lines with the title

      // Ensure there is room for: title block + pinned lines
      const requiredSpace = (titleLines.length * titleLineHeight) + 2 + (pinnedLinesCount * contentLineHeight);
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      // Render title directly to avoid any internal page-break decisions
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(titleLines, margin, yPosition);
      yPosition += (titleLines.length * titleLineHeight) + 2;

      // Render the first N content lines directly so they stay with the title
      if (pinnedLinesCount > 0) {
        const pinned = allContentLines.slice(0, pinnedLinesCount);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(pinned, margin, yPosition);
        yPosition += (pinned.length * contentLineHeight) + 3;
      }

      // Flow the remaining lines using addText so normal page breaks and margins apply
      const remaining = allContentLines.slice(pinnedLinesCount).join('\n');
      if (remaining.trim().length > 0) {
        addText(remaining, 10, false);
      }

      // Section spacing
      yPosition += 5;
    };

    const addSourcesList = (sources: string[] | undefined) => {
      if (!sources || sources.length === 0) return;
      
      addText('Sources:', 10, true);
      sources.forEach((source, index) => {
        const truncated = source.length > 80 ? source.substring(0, 77) + '...' : source;
        addText(`${index + 1}. ${truncated}`, 9, false);
      });
      yPosition += 3;
    };

    // === HEADER ===
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(company.companyName || 'Company Report', margin, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Brand Research Report', margin, 32);

    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPosition = 50;

    // === COMPANY INFO SECTION ===
    addText('COMPANY INFORMATION', 14, true);
    yPosition += 2;

    const infoItems = [
      company.industry && `Industry: ${company.industry}`,
      company.hqLocation && `Headquarters: ${company.hqLocation}`,
      company.foundingDate && `Founded: ${new Date(company.foundingDate).getFullYear()}`,
      company.employees && `Employees: ${company.employees.toLocaleString()}`,
      company.annualRevenue && `Annual Revenue: ${company.annualRevenue}`,
      company.website && `Website: ${company.website}`,
    ].filter(Boolean) as string[];

    infoItems.forEach(item => {
      addText(item, 10, false);
    });
    
    yPosition += 5;

    // === DESCRIPTION ===
    if (company.description) {
      addSection('Overview', company.description);
    }

    // === DETAILED ANALYSIS SECTIONS ===
    const analysis = company.detailedAnalysis;

    if (analysis?.companyOverview?.content) {
      addSection('Company Overview', analysis.companyOverview.content);
      addSourcesList(analysis.companyOverview.sources);
    }

    if (analysis?.companyBackground?.content) {
      addSection('Company Background', analysis.companyBackground.content);
      addSourcesList(analysis.companyBackground.sources);
    }

    if (analysis?.financialOverview?.content) {
      addSection('Financial Overview', analysis.financialOverview.content);
      addSourcesList(analysis.financialOverview.sources);
    }

    if (analysis?.audienceSegmentation?.content) {
      addSection('Target Audience', analysis.audienceSegmentation.content);
      addSourcesList(analysis.audienceSegmentation.sources);
    }

    if (analysis?.marketingActivity?.content) {
      addSection('Marketing Activity', analysis.marketingActivity.content);
    }

    if (analysis?.sponsorshipsExperiential?.content) {
      addSection('Sponsorships & Experiential', analysis.sponsorshipsExperiential.content);
    }

    if (analysis?.socialMediaPresence?.content) {
      addSection('Social Media Presence', analysis.socialMediaPresence.content);
      
      // Add social media handles if they exist
      if (analysis.socialMediaPresence.handles) {
        addText('Social Media Handles:', 10, true);
        addText(analysis.socialMediaPresence.handles, 10, false);
        yPosition += 3;
      }
    }

    if (analysis?.strategicFocus?.content) {
      addSection('Strategic Focus', analysis.strategicFocus.content);
    }

    // === FOOTER ON LAST PAGE ===
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // === DOWNLOAD PDF ===
    const fileName = `${company.companyName?.replace(/[^a-z0-9]/gi, '_') || 'company'}_report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report. Please try again.');
  }
}

