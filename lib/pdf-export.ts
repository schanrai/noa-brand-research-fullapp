/**
 * PDF Export Utility
 * 
 * Generates and downloads PDF reports for brand research data.
 * Uses jsPDF for PDF generation and formats company data into a
 * professional report document.
 */

import { jsPDF } from 'jspdf';
import { normalizeCurrencyFormat } from '@/lib/utils';

// === UI-MATCHING COLOR SCHEME ===
const colors = {
  primary: [0, 0, 0],           // Black
  background: [248, 245, 240],  // #f8f5f0 - More visible cream
  cardBackground: [255, 255, 255], // White (card background)
  accent: [242, 239, 234],      // #f2efea (accent background)
  textPrimary: [0, 0, 0],       // Black text
  textSecondary: [82, 82, 82],  // #525252 (gray-600)
  textMuted: [163, 163, 163],   // #a3a3a3 (gray-400)
  border: [229, 229, 229],      // #e5e5e5 (gray-200)
};

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
    const contentWidth = pageWidth - (margin * 2) - 10; // Added 10mm buffer for right margin
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

    // Enhanced typography helper matching UI styling
    const addStyledText = (text: string, fontSize: number = 10, isBold: boolean = false, color: number[] = colors.textPrimary, isUppercase: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(color[0], color[1], color[2]);
      
      const processedText = isUppercase ? text.toUpperCase() : text;
      
      const lines = doc.splitTextToSize(processedText, contentWidth);
      const lineHeight = fontSize * 0.5;

      let index = 0;
      while (index < lines.length) {
        const availableHeight = (pageHeight - margin) - yPosition;
        let availableLines = Math.floor(availableHeight / lineHeight);

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
      // IMPORTANT: Replace newlines with spaces to ensure proper word wrapping
      let processedContent = content
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
        .replace(/#+\s/g, '')
        .replace(/\n+/g, ' ')  // Replace newlines with spaces for better flow
        .replace(/\s+/g, ' ')  // Normalize multiple spaces to single space
        .replace(/^[\s-]*$/gm, '')
        .trim();

      // Split text upfront
      const contentLineHeight = 10 * 0.5; // must match addText spacing
      const titleLineHeight = 12 * 0.5;
      const titleLines = doc.splitTextToSize(title, contentWidth);
      const allContentLines = doc.splitTextToSize(processedContent, contentWidth);

      // Ensure there is room for: title block + at least 1 line of content
      const requiredSpace = (titleLines.length * titleLineHeight) + 2 + contentLineHeight;
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      // Render title directly to avoid any internal page-break decisions
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(titleLines, margin, yPosition);
      yPosition += (titleLines.length * titleLineHeight) + 2;

      // Render ALL content lines together (no pinned/remaining split to avoid gaps)
      if (allContentLines.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        let idx = 0;
        while (idx < allContentLines.length) {
          const availableHeight = (pageHeight - margin) - yPosition;
          const availableLines = Math.floor(availableHeight / contentLineHeight);
          
          if (availableLines <= 0) {
            doc.addPage();
            yPosition = margin;
            continue;
          }
          
          const end = Math.min(idx + availableLines, allContentLines.length);
          const slice = allContentLines.slice(idx, end);
          
          // Render each line with URL styling
          slice.forEach((line: string) => {
            renderLineWithURLs(line, margin, yPosition, 10);
            yPosition += contentLineHeight;
          });
          
          yPosition += 3;
          idx = end;
        }
      }

      // Section spacing
      yPosition += 5;
    };

    // Helper function to check if a string is a URL
    const isURL = (str: string): boolean => {
      try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    };

    // Helper function to clean and truncate URLs
    const cleanURL = (url: string, maxLength: number = 70): string => {
      try {
        // Remove tracking parameters (utm_source, utm_medium, etc.)
        const urlObj = new URL(url);
        
        // Remove common tracking parameters
        const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'source'];
        trackingParams.forEach(param => {
          urlObj.searchParams.delete(param);
        });
        
        // Reconstruct URL without tracking params
        let cleaned = urlObj.toString();
        
        // Remove trailing ? if no params left
        if (cleaned.endsWith('?')) {
          cleaned = cleaned.slice(0, -1);
        }
        
        // Truncate if too long
        if (cleaned.length > maxLength) {
          return cleaned.substring(0, maxLength - 3) + '...';
        }
        
        return cleaned;
      } catch {
        // If URL parsing fails, just truncate the original
        return url.length > maxLength ? url.substring(0, maxLength - 3) + '...' : url;
      }
    };

    // Helper function to render a single line with styled URLs
    const renderLineWithURLs = (line: string, x: number, y: number, fontSize: number = 10): void => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');
      
      // Pattern to match URLs in various formats:
      // 1. (https://...) - URL in parentheses
      // 2. https://... - Standalone URL
      // 3. (text (https://...)) - Text followed by URL in nested parentheses
      const urlPattern = /(\([^)]*\s*\(https?:\/\/[^\s)]+\)\)|\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+)/gi;
      
      let currentX = x;
      let lastIndex = 0;
      let match;
      
      // Find all URLs in the line
      const matches: Array<{ index: number; originalLength: number; text: string; url: string }> = [];
      while ((match = urlPattern.exec(line)) !== null) {
        let urlMatch = match[0];
        const originalLength = match[0].length;
        let hasParentheses = false;
        let hasNestedFormat = false;
        let url = urlMatch;
        
        // Check for nested format: (text (https://...))
        const nestedPattern = /\(([^)]+)\s*\((https?:\/\/[^\s)]+)\)\)/;
        const nestedMatch = urlMatch.match(nestedPattern);
        
        if (nestedMatch) {
          // Extract the URL from nested format
          url = nestedMatch[2]; // The actual URL
          hasNestedFormat = true;
          hasParentheses = true;
        } else if (urlMatch.startsWith('(') && urlMatch.endsWith(')')) {
          // Simple parentheses format: (https://...)
          url = urlMatch.slice(1, -1);
          hasParentheses = true;
        }
        
        // Clean the URL
        const cleanedURL = cleanURL(url);
        
        // Reconstruct text with cleaned URL
        let cleanedText: string;
        if (hasNestedFormat && nestedMatch) {
          // For nested format, show: (domain.com (cleanedURL))
          const domainText = nestedMatch[1].trim();
          cleanedText = `(${domainText} (${cleanedURL}))`;
        } else if (hasParentheses) {
          cleanedText = `(${cleanedURL})`;
        } else {
          cleanedText = cleanedURL;
        }
        
        matches.push({
          index: match.index,
          originalLength: originalLength,
          text: cleanedText,
          url: cleanedURL
        });
      }
      
      // If no URLs, render normally
      if (matches.length === 0) {
        doc.setTextColor(0, 0, 0);
        doc.text(line, currentX, y);
        return;
      }
      
      // Render segments: text and URLs
      matches.forEach((urlMatch) => {
        // Render text before URL
        if (urlMatch.index > lastIndex) {
          const textBefore = line.substring(lastIndex, urlMatch.index);
          doc.setTextColor(0, 0, 0);
          doc.text(textBefore, currentX, y);
          currentX += doc.getTextWidth(textBefore);
        }
        
        // Render URL in blue and clickable
        doc.setTextColor(37, 99, 235); // Blue color matching text-blue-600 (#2563eb)
        doc.textWithLink(urlMatch.text, currentX, y, { url: urlMatch.url });
        currentX += doc.getTextWidth(urlMatch.text);
        
        // Use original length to maintain correct index for next segment
        lastIndex = urlMatch.index + urlMatch.originalLength;
      });
      
      // Render remaining text after last URL
      if (lastIndex < line.length) {
        const textAfter = line.substring(lastIndex);
        doc.setTextColor(0, 0, 0);
        doc.text(textAfter, currentX, y);
      }
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
    };

    const addSourcesList = (sources: string[] | undefined) => {
      if (!sources || sources.length === 0) return;
      
      addText('Sources:', 10, true);
      sources.forEach((source, index) => {
        // Clean URL if it's a URL
        const cleanedSource = isURL(source) ? cleanURL(source, 80) : source;
        const truncated = cleanedSource.length > 80 ? cleanedSource.substring(0, 77) + '...' : cleanedSource;
        
        // Check if source is a URL and style it accordingly
        if (isURL(source)) {
          // Render number prefix in black
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          doc.text(`${index + 1}. `, margin, yPosition);
          
          // Calculate x position after the number
          const numberWidth = doc.getTextWidth(`${index + 1}. `);
          const urlX = margin + numberWidth;
          
          // Render URL in blue and clickable (use cleaned URL for display, original for link)
          doc.setFontSize(9);
          doc.setTextColor(37, 99, 235); // Blue color matching text-blue-600 (#2563eb)
          const urlLines = doc.splitTextToSize(truncated, contentWidth - numberWidth);
          
          urlLines.forEach((line: string, lineIndex: number) => {
            const currentY = yPosition + (lineIndex * 9 * 0.5);
            // Use original source URL for the link, but display cleaned version
            doc.textWithLink(line, urlX, currentY, { url: source });
          });
          
          yPosition += urlLines.length * 9 * 0.5 + 3;
          
          // Reset text color
          doc.setTextColor(0, 0, 0);
        } else {
          // Not a URL, render normally
          addText(`${index + 1}. ${truncated}`, 9, false);
        }
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
      company.annualRevenue && `Annual Revenue: ${normalizeCurrencyFormat(company.annualRevenue)}`,
      company.website && `Website: ${company.website}`,
    ].filter(Boolean) as string[];

    infoItems.forEach(item => {
      // Check if item contains a URL (for website field)
      const urlPattern = /(https?:\/\/[^\s]+)/gi;
      const urlMatch = urlPattern.exec(item);
      
      if (urlMatch && isURL(urlMatch[1])) {
        // Render with URL styling
        renderLineWithURLs(item, margin, yPosition, 10);
        yPosition += 10 * 0.5 + 3;
      } else {
        // Render normally
        addText(item, 10, false);
      }
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

