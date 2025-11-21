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
      // Step 1: Find all URLs in original content
      const originalUrls = findURLsInContent(content);
      
      // Step 2: Replace URLs with truncated/cleaned versions BEFORE processing
      let processedContent = content;
      const sortedUrls = [...originalUrls].sort((a, b) => b.start - a.start);
      
      for (const urlInfo of sortedUrls) {
        let replacement: string;
        if (urlInfo.hasNested && urlInfo.domainText) {
          replacement = `(${urlInfo.domainText} (${urlInfo.cleaned}))`;
        } else if (urlInfo.original.startsWith('(') && urlInfo.original.endsWith(')')) {
          replacement = `(${urlInfo.cleaned})`;
        } else {
          replacement = urlInfo.cleaned;
        }
        
        processedContent = 
          processedContent.substring(0, urlInfo.start) + 
          replacement + 
          processedContent.substring(urlInfo.end);
      }
      
      // Step 3: Process markdown and formatting
      processedContent = processedContent
        .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove bold markers
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')  // Convert markdown links
        .replace(/#+\s/g, '')  // Remove heading markers
        .replace(/\n+/g, ' ')  // Replace newlines with spaces for better flow
        .replace(/\s+/g, ' ')  // Normalize multiple spaces to single space
        .replace(/^[\s-]*$/gm, '')
        .trim();

      // Split text upfront
      const contentLineHeight = 10 * 0.5; // must match addText spacing
      const titleLineHeight = 12 * 0.5;
      const titleLines = doc.splitTextToSize(title, contentWidth);
      const allContentLines = doc.splitTextToSize(processedContent, contentWidth);

      // Ensure there is room for: title block + at least 3 lines of content (to avoid orphans)
      const minContentLines = Math.min(3, allContentLines.length);
      const requiredSpace = (titleLines.length * titleLineHeight) + 2 + (minContentLines * contentLineHeight);
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
          
          // renderLineWithURLs will style URLs and use fullCleaned for link targets
          slice.forEach((line: string) => {
            renderLineWithURLs(line, margin, yPosition, 10, undefined, originalUrls);
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

    // Helper function to clean and optionally truncate URLs
    const cleanURL = (url: string, maxLength: number = 70, truncate: boolean = true): string => {
      try {
        // Remove spaces that might have been introduced from line breaks
        // URLs shouldn't have spaces - they should be URL-encoded
        const urlWithoutSpaces = url.replace(/\s+/g, '');
        
        // Remove tracking parameters (utm_source, utm_medium, etc.)
        const urlObj = new URL(urlWithoutSpaces);
        
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
        
        // Truncate if too long (only if truncate is true)
        if (truncate && cleaned.length > maxLength) {
          return cleaned.substring(0, maxLength - 3) + '...';
        }
        
        return cleaned;
      } catch {
        // If URL parsing fails, try removing spaces and truncate
        const urlWithoutSpaces = url.replace(/\s+/g, '');
        if (truncate && urlWithoutSpaces.length > maxLength) {
          return urlWithoutSpaces.substring(0, maxLength - 3) + '...';
        }
        return urlWithoutSpaces;
      }
    };

    // Helper function to find all URLs in content, handling multi-line URLs
    const findURLsInContent = (content: string): Array<{ start: number; end: number; original: string; cleaned: string; fullCleaned: string; hasNested: boolean; domainText?: string }> => {
      const urls: Array<{ start: number; end: number; original: string; cleaned: string; fullCleaned: string; hasNested: boolean; domainText?: string }> = [];
      
      // Pattern 1: Nested format with multi-line support: (domain.com (https://...))
      // This pattern uses [\s\S] to match any character including newlines, until we find ))
      const nestedPattern = /\(([^)]+)\s*\((https?:\/\/[\s\S]*?)\)\)/gi;
      let match: RegExpExecArray | null;
      
      while ((match = nestedPattern.exec(content)) !== null) {
        const domainText = match[1].trim();
        let url = match[2];
        
        // Remove all whitespace (including newlines and spaces) from URL
        // URLs shouldn't have whitespace - it's likely from line breaks
        url = url.replace(/\s+/g, '').trim();
        
        const cleanedURL = cleanURL(url); // Truncated for display
        const fullCleanedURL = cleanURL(url, 70, false); // Full for link target
        
        urls.push({
          start: match.index,
          end: match.index + match[0].length,
          original: match[0],
          cleaned: cleanedURL,
          fullCleaned: fullCleanedURL,
          hasNested: true,
          domainText: domainText
        });
      }
      
      // Pattern 2: Simple parentheses format with multi-line support: (https://...)
      // Reset regex lastIndex
      nestedPattern.lastIndex = 0;
      const simpleParenPattern = /\((https?:\/\/[\s\S]*?)\)/gi;
      
      while ((match = simpleParenPattern.exec(content)) !== null) {
        // Skip if this was already captured as part of a nested format
        const isPartOfNested = urls.some(u => 
          match!.index >= u.start && match!.index < u.end
        );
        
        if (!isPartOfNested) {
          let url = match![1];
          // Remove all whitespace (including newlines and spaces) from URL
          url = url.replace(/\s+/g, '').trim();
          
          const cleanedURL = cleanURL(url); // Truncated for display
          const fullCleanedURL = cleanURL(url, 70, false); // Full for link target
          
          urls.push({
            start: match!.index,
            end: match!.index + match![0].length,
            original: match![0],
            cleaned: cleanedURL,
            fullCleaned: fullCleanedURL,
            hasNested: false,
            domainText: undefined
          });
        }
      }
      
      // Pattern 3: Standalone URLs: https://... (no parentheses)
      // Reset regex lastIndex
      simpleParenPattern.lastIndex = 0;
      const standalonePattern = /(https?:\/\/[^\s)]+)/gi;
      
      while ((match = standalonePattern.exec(content)) !== null) {
        // Skip if this was already captured as part of a nested or simple format
        const isPartOfOther = urls.some(u => 
          match!.index >= u.start && match!.index < u.end
        );
        
        if (!isPartOfOther) {
          let url = match[1];
          const cleanedURL = cleanURL(url); // Truncated for display
          const fullCleanedURL = cleanURL(url, 70, false); // Full for link target
          
          urls.push({
            start: match!.index,
            end: match!.index + match![0].length,
            original: match![0],
            cleaned: cleanedURL,
            fullCleaned: fullCleanedURL,
            hasNested: false,
            domainText: undefined
          });
        }
      }
      
      return urls;
    };

    // Helper function to reconstruct URLs that span multiple lines
    const reconstructMultiLineURL = (lines: string[], startIndex: number, urlInfo: { original: string; cleaned: string; hasNested: boolean; domainText?: string }): { endIndex: number; reconstructedText: string } | null => {
      // Look for URL start patterns
      const startPatterns = [
        urlInfo.hasNested && urlInfo.domainText ? new RegExp(`\\(${urlInfo.domainText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(https?://`, 'i') : null,
        /\(https?:\/\//i,
        /https?:\/\//i
      ].filter(Boolean) as RegExp[];
      
      let startLine = lines[startIndex];
      let urlStartIndex = -1;
      
      // Find where URL starts in the first line
      for (const pattern of startPatterns) {
        const match = startLine.match(pattern);
        if (match && match.index !== undefined) {
          urlStartIndex = match.index;
          break;
        }
      }
      
      if (urlStartIndex === -1) return null;
      
      // Reconstruct URL by looking ahead through lines
      let reconstructed = startLine.substring(urlStartIndex);
      let endIndex = startIndex;
      
      // Check if URL is complete in first line
      const completePattern = /(\([^)]*\s*\(https?:\/\/[^\s)]+\)\)|\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+)/i;
      if (completePattern.test(reconstructed)) {
        return { endIndex: startIndex, reconstructedText: reconstructed };
      }
      
      // URL spans multiple lines - reconstruct it
      for (let i = startIndex + 1; i < lines.length; i++) {
        const nextLine = lines[i];
        reconstructed += ' ' + nextLine;
        endIndex = i;
        
        // Check if we've found the end of the URL
        // For nested format: look for double closing parens ))
        // For simple format: look for single closing paren )
        // Also check if we have a complete URL pattern now
        const hasDoubleClose = reconstructed.match(/\)\s*\)/);
        const hasSingleClose = reconstructed.match(/\)(?!\s*\()/);
        const isComplete = completePattern.test(reconstructed);
        
        if (hasDoubleClose || (hasSingleClose && !urlInfo.hasNested) || isComplete) {
          // Check if this line ends with the closing paren(s)
          if (nextLine.match(/\)\s*\)$/) || (nextLine.match(/\)$/) && !urlInfo.hasNested)) {
            break;
          }
        }
        
        // Safety limit to prevent infinite loops
        if (i - startIndex > 10) break;
      }
      
      return { endIndex, reconstructedText: reconstructed };
    };

    // Helper function to render content with multi-line URL awareness
    const renderContentWithURLs = (originalContent: string, lines: string[], fontSize: number = 10, preFoundUrls?: Array<{ start: number; end: number; original: string; cleaned: string; fullCleaned: string; hasNested: boolean; domainText?: string }>): void => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');
      
      // Use pre-found URLs if provided, otherwise find them in the content
      const urls = preFoundUrls || findURLsInContent(originalContent);
      
      if (urls.length === 0) {
        // No URLs, render normally
        lines.forEach((line: string) => {
          doc.setTextColor(0, 0, 0);
          doc.text(line, margin, yPosition);
          yPosition += fontSize * 0.5;
        });
        return;
      }
      
      // Track which lines have been processed (for multi-line URLs)
      const processedLines = new Set<number>();
      
      // For each line, check if it contains any URL patterns
      lines.forEach((line: string, lineIndex: number) => {
        if (processedLines.has(lineIndex)) {
          // This line was already processed as part of a multi-line URL
          return;
        }
        
        // Check if this line contains any URL (by checking against found URLs)
        let matchedUrl: typeof urls[0] | null = null;
        
        for (const urlInfo of urls) {
          // Check multiple ways the URL might appear in the line:
          const lineLower = line.toLowerCase();
          const hasUrlPattern = 
            lineLower.includes(urlInfo.cleaned.toLowerCase()) ||
            (urlInfo.domainText && lineLower.includes(urlInfo.domainText.toLowerCase())) ||
            /https?:\/\//i.test(line) ||
            (urlInfo.hasNested && /\([^)]+\s*\(https?:\/\//i.test(line));
          
          if (hasUrlPattern) {
            matchedUrl = urlInfo;
            break;
          }
        }
        
        if (matchedUrl) {
          // Try to reconstruct multi-line URL
          const multiLineResult = reconstructMultiLineURL(lines, lineIndex, matchedUrl);
          
          if (multiLineResult && multiLineResult.endIndex > lineIndex) {
            // URL spans multiple lines - render preserving original line structure
            const urlStartInLine = line.match(/(\([^)]*\s*\(https?:\/\/|\(https?:\/\/|https?:\/\/)/i);
            const urlStartIndex = urlStartInLine ? (urlStartInLine.index || 0) : 0;
            
            // Render first line: text before URL + URL start
            let currentX = margin;
            if (urlStartIndex > 0) {
              const textBefore = line.substring(0, urlStartIndex);
              doc.setTextColor(0, 0, 0);
              doc.text(textBefore, currentX, yPosition);
              currentX += doc.getTextWidth(textBefore);
            }
            
            // Render URL part from first line in blue
            doc.setTextColor(37, 99, 235);
            const firstLineUrlPart = line.substring(urlStartIndex);
            doc.textWithLink(firstLineUrlPart, currentX, yPosition, { url: matchedUrl.fullCleaned });
            yPosition += fontSize * 0.5;
            
            // Render middle lines (if any) - these are all URL
            for (let i = lineIndex + 1; i < multiLineResult.endIndex; i++) {
              doc.setTextColor(37, 99, 235);
              doc.textWithLink(lines[i], margin, yPosition, { url: matchedUrl.fullCleaned });
              processedLines.add(i);
              yPosition += fontSize * 0.5;
            }
            
            // Render last line: URL end + text after (if any)
            const lastLine = lines[multiLineResult.endIndex];
            // Check if there's text after the URL
            // For nested format, look for double closing parens ))
            // For simple format, look for single closing paren )
            let urlEndIndex = lastLine.length;
            if (matchedUrl.hasNested) {
              const doubleCloseMatch = lastLine.match(/\)\s*\)/);
              if (doubleCloseMatch && doubleCloseMatch.index !== undefined) {
                urlEndIndex = doubleCloseMatch.index + doubleCloseMatch[0].length;
              }
            } else {
              const singleCloseMatch = lastLine.match(/\)(?!\s*\()/);
              if (singleCloseMatch && singleCloseMatch.index !== undefined) {
                urlEndIndex = singleCloseMatch.index + singleCloseMatch[0].length;
              }
            }
            
            currentX = margin;
            if (urlEndIndex < lastLine.length) {
              // Has text after URL
              const urlPart = lastLine.substring(0, urlEndIndex);
              const textAfter = lastLine.substring(urlEndIndex);
              
              doc.setTextColor(37, 99, 235);
              doc.textWithLink(urlPart, currentX, yPosition, { url: matchedUrl.fullCleaned });
              currentX += doc.getTextWidth(urlPart);
              doc.setTextColor(0, 0, 0);
              doc.text(textAfter, currentX, yPosition);
            } else {
              // Entire line is URL
              doc.setTextColor(37, 99, 235);
              doc.textWithLink(lastLine, currentX, yPosition, { url: matchedUrl.fullCleaned });
            }
            
            // Mark all processed lines
            for (let i = lineIndex; i <= multiLineResult.endIndex; i++) {
              processedLines.add(i);
            }
            
            // Reset text color
            doc.setTextColor(0, 0, 0);
            yPosition += fontSize * 0.5;
          } else {
            // Single line URL - render normally
            renderLineWithURLs(line, margin, yPosition, fontSize, matchedUrl);
            yPosition += fontSize * 0.5;
          }
        } else {
          // No URL in this line, render normally
          doc.setTextColor(0, 0, 0);
          doc.text(line, margin, yPosition);
          yPosition += fontSize * 0.5;
        }
      });
    };

    // Helper function to render a single line with styled URLs
    const renderLineWithURLs = (line: string, x: number, y: number, fontSize: number = 10, knownUrl?: { original: string; cleaned: string; fullCleaned: string; hasNested: boolean; domainText?: string }, urlLookup?: Array<{ cleaned: string; fullCleaned: string; domainText?: string }>): void => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');
      
      // Pattern to match URLs in various formats (URLs are already cleaned, may have spaces from line breaks):
      // 1. (https://...) - URL in parentheses (may have spaces)
      // 2. https://... - Standalone URL (may have spaces)
      // 3. (text (https://...)) - Text followed by URL in nested parentheses (may have spaces)
      // Note: We allow spaces in URLs because splitTextToSize may break them across lines
      const urlPattern = /(\([^)]*\s*\(https?:\/\/[^)]+\)\)|\(https?:\/\/[^)]+\)|https?:\/\/[^\s)]+)/gi;
      
      let currentX = x;
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      
      // Find all URLs in the line
      const matches: Array<{ index: number; originalLength: number; text: string; url: string }> = [];
      while ((match = urlPattern.exec(line)) !== null) {
        let urlMatch = match[0];
        const originalLength = match[0].length;
        let hasParentheses = false;
        let hasNestedFormat = false;
        let url = urlMatch;
        
        // Check for nested format: (text (https://...))
        const nestedPattern = /\(([^)]+)\s*\((https?:\/\/[^)]+)\)\)/;
        const nestedMatch = urlMatch.match(nestedPattern);
        
        if (nestedMatch) {
          // Extract the URL from nested format
          url = nestedMatch[2]; // The actual URL (may have spaces from line breaks)
          hasNestedFormat = true;
          hasParentheses = true;
        } else if (urlMatch.startsWith('(') && urlMatch.endsWith(')')) {
          // Simple parentheses format: (https://...)
          url = urlMatch.slice(1, -1);
          hasParentheses = true;
        }
        
        // Remove spaces from URL (they're from line breaks, URLs are already cleaned)
        const urlWithoutSpaces = url.replace(/\s+/g, '');
        // URLs are already cleaned, so we can use them directly
        // But we need to remove spaces that might have been introduced by line breaks
        const cleanedURL = urlWithoutSpaces;
        
        // Use the original match text for display (preserves formatting, may be truncated)
        // But use full cleaned URL (without spaces) for the link target
        let displayText = urlMatch;
        
          matches.push({
            index: match.index,
            originalLength: originalLength,
            text: displayText,
            url: (() => {
              // The URL we found might be truncated (ends with ...)
              // Look it up in urlLookup to get the full version
              if (urlLookup) {
                const found = urlLookup.find(u => 
                  cleanedURL.startsWith(u.cleaned.replace('...', ''))
                );
                if (found) return found.fullCleaned;
              }
              return cleanedURL; // Fallback to what we found
            })()
          });
      }
      
      // If no URLs found by regex but we have knownUrl, try to find it in the line
      if (matches.length === 0 && knownUrl) {
        // Check for partial URL patterns (URL might be split across lines)
        const partialPatterns = [
          // Pattern for nested format start: (domain.com (https://
          knownUrl.hasNested && knownUrl.domainText ? new RegExp(`\\(${knownUrl.domainText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(https?://`, 'i') : null,
          // Pattern for URL start: https:// or (https://
          /(\(?https?:\/\/)/i,
          // Pattern for domain text: (domain.com
          knownUrl.domainText ? new RegExp(`\\(${knownUrl.domainText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') : null
        ].filter(Boolean) as RegExp[];
        
        for (const pattern of partialPatterns) {
          const partialMatch = line.match(pattern);
          if (partialMatch) {
            // Found partial URL - render the line with the known URL info
            const matchIndex = partialMatch.index || 0;
            
            // Render text before URL
            if (matchIndex > 0) {
              const textBefore = line.substring(0, matchIndex);
              doc.setTextColor(0, 0, 0);
              doc.text(textBefore, currentX, y);
              currentX += doc.getTextWidth(textBefore);
            }
            
            // Render URL part in blue (render only what's in this line, but link to cleaned URL)
            doc.setTextColor(37, 99, 235);
            
            // Render the URL part that's actually in this line
            const urlPart = line.substring(matchIndex);
            // Use full cleaned URL for the link target, but display what's actually in the line
            doc.textWithLink(urlPart, currentX, y, { url: knownUrl.fullCleaned });
            
            // Reset text color
            doc.setTextColor(0, 0, 0);
            return;
          }
        }
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

    /**
     * Measures the height a campaign block would take up (without rendering)
     * @returns height in mm
     */
    const measureCampaignBlockHeight = (campaignName: string, content: string): number => {
      const titleFontSize = 10; // Changed to 10pt for proper hierarchy
      const contentFontSize = 10;
      const titleLineHeight = titleFontSize * 0.5;
      const contentLineHeight = contentFontSize * 0.5;
      
      // Measure title (no "Campaign:" prefix)
      doc.setFontSize(titleFontSize);
      const titleLines = doc.splitTextToSize(campaignName, contentWidth);
      const titleHeight = titleLines.length * titleLineHeight + 3; // +3mm spacing after title
      
      // Measure content (no indent, full width)
      doc.setFontSize(contentFontSize);
      const contentLines = doc.splitTextToSize(content, contentWidth);
      const contentHeight = contentLines.length * contentLineHeight;
      
      // Total: title + content + bottom spacing
      return titleHeight + contentHeight + 10; // +10mm spacing after block
    };

    /**
     * Renders Marketing/Sponsorship sections with campaign block detection
     * and keep-together pagination
     */
    const addCampaignSection = (title: string, content: string) => {
      // Step 1: Parse campaign blocks from content
      // Pattern matches: **bold text** (colon optional) OR plain text WITH colon
      // This prevents matching random capitalized sentences or inline bold emphasis
      const campaignPattern = /\*\*([A-Z][A-Za-z0-9\s\-&'()]{10,79})\*\*:?\s*|([A-Z][A-Za-z0-9\s\-&'()]{10,79}):\s*/g;
      const campaigns: Array<{ name: string; content: string }> = [];
      
      const matches: Array<{ name: string; startIndex: number; endIndex: number }> = [];
      let match: RegExpExecArray | null;
      
      // Find all campaign markers
      while ((match = campaignPattern.exec(content)) !== null) {
        // match[1] = bold text, match[2] = plain text with colon
        const campaignName = (match[1] || match[2]).trim();
        matches.push({
          name: campaignName,
          startIndex: match.index,
          endIndex: match.index + match[0].length
        });
      }
      
      // Smart filter: Distinguish campaign titles from inline emphasis using context
      const filteredMatches = matches.filter((match, index) => {
        // Filter 1: Lead-in phrases that precede numbered lists
        if (index === 0) {
          const contentAfter = content.substring(match.endIndex, match.endIndex + 100);
          if (/^\s*1\.\s+/.test(contentAfter)) {
            return false; // Exclude - it's a lead-in phrase
          }
        }
        
        // Filter 2: Check context BEFORE the match
        const contentBefore = content.substring(Math.max(0, match.startIndex - 50), match.startIndex);
        
        // If preceded by structural boundary (newline, `))`, or start of content) → likely campaign
        const isAtStructuralBoundary = 
          match.startIndex === 0 || // Start of content
          /\n\s*$/.test(contentBefore) || // Preceded by newline
          /\)\)\s*$/.test(contentBefore); // Preceded by `))` (end of URL)
        
        // If preceded by lowercase letter → likely inline emphasis
        const isPrecededByLowercase = /[a-z]\s*$/.test(contentBefore);
        
        // Filter 3: Check context AFTER the match
        const contentAfter = content.substring(match.endIndex, Math.min(content.length, match.endIndex + 200));
        // If followed by substantial content (long paragraph) → likely campaign
        const hasSubstantialContent = contentAfter.trim().length > 50;
        
        // Check if the original match included a colon (strong signal for campaign)
        const matchedText = content.substring(match.startIndex, match.endIndex);
        const hasColon = matchedText.includes(':');
        
        // Decision logic:
        // - If preceded by lowercase AND no colon → inline emphasis ❌
        // - If at structural boundary AND has substantial content → campaign ✅
        // - If has colon → likely campaign ✅ (colon is strong signal)
        // - Otherwise, be conservative and include it
        
        if (isPrecededByLowercase && !hasColon) {
          return false; // Inline emphasis - exclude
        }
        
        if (isAtStructuralBoundary && hasSubstantialContent) {
          return true; // Campaign title - include
        }
        
        if (hasColon) {
          return true; // Campaign with colon - include
        }
        
        // Default: include (conservative approach - let other filters catch false positives)
        return true;
      });
      
      // Extract campaign blocks and preserve introduction
      let introContent = '';
      if (filteredMatches.length > 0) {
        // Preserve content before first match as introduction
        introContent = content.substring(0, filteredMatches[0].startIndex).trim();
        
        filteredMatches.forEach((match, index) => {
          const contentStart = match.endIndex;
          const contentEnd = index < filteredMatches.length - 1 
            ? filteredMatches[index + 1].startIndex 
            : content.length;
          
          // Get block content and strip orphaned numbers (both leading and trailing)
          let blockContent = content.substring(contentStart, contentEnd).trim();
          // Remove leading numbers like "2. " or "3. " that are orphaned from titles
          blockContent = blockContent.replace(/^\d+\.\s*/, '');
          // Remove trailing patterns like "))2." or ")) 3." from end of content
          blockContent = blockContent.replace(/\)\s*\)?\s*\d+\.\s*$/, ')');
          // Remove orphaned bold markers at start of content
          blockContent = blockContent.replace(/^\*\*\s*/, '');
          
          campaigns.push({
            name: match.name,
            content: blockContent
          });
        });
      }
      
      // Fallback: If no campaigns detected, use standard section rendering
      if (campaigns.length === 0) {
        console.warn(`No campaigns detected in "${title}". Using standard rendering.`);
        addSection(title, content);
        return;
      }
      
      // Step 2: Render section title
      const titleLineHeight = 12 * 0.5;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.textPrimary[0], colors.textPrimary[1], colors.textPrimary[2]);
      
      const titleLines = doc.splitTextToSize(title, contentWidth);
      const titleHeight = titleLines.length * titleLineHeight + 2;
      
      // Ensure space for title
      if (yPosition + titleHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.text(titleLines, margin, yPosition);
      yPosition += titleHeight + 3;
      
      // Step 3: Render introduction if it exists
      if (introContent) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.textPrimary[0], colors.textPrimary[1], colors.textPrimary[2]);
        
        // Find URLs in original intro content
        const introUrls = findURLsInContent(introContent);
        
        // Replace URLs with truncated/cleaned versions BEFORE processing
        let processedIntro = introContent;
        const sortedIntroUrls = [...introUrls].sort((a, b) => b.start - a.start);
        
        for (const urlInfo of sortedIntroUrls) {
          let replacement: string;
          if (urlInfo.hasNested && urlInfo.domainText) {
            replacement = `(${urlInfo.domainText} (${urlInfo.cleaned}))`;
          } else if (urlInfo.original.startsWith('(') && urlInfo.original.endsWith(')')) {
            replacement = `(${urlInfo.cleaned})`;
          } else {
            replacement = urlInfo.cleaned;
          }
          
          processedIntro = 
            processedIntro.substring(0, urlInfo.start) + 
            replacement + 
            processedIntro.substring(urlInfo.end);
        }
        
        // Process markdown and formatting
        processedIntro = processedIntro
          .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove bold markers
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')  // Convert markdown links
          .replace(/#+\s/g, '')  // Remove heading markers
          .replace(/\n+/g, ' ')  // Replace newlines with spaces
          .replace(/\s+/g, ' ')  // Normalize whitespace
          .trim();
        
        // Split at contentWidth (now with accurate display widths)
        const introLines = doc.splitTextToSize(processedIntro, contentWidth);
        
        introLines.forEach((line: string) => {
          // Check if we need a new page
          if (yPosition > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }
          // renderLineWithURLs will style URLs and use fullCleaned for link targets
          renderLineWithURLs(line, margin, yPosition, 10, undefined, introUrls);
          yPosition += 5;
        });
        yPosition += 8; // Extra spacing after intro before first initiative
      }
      
      // Step 4: Render each campaign block
      campaigns.forEach((campaign, campaignIndex) => {
        // Find URLs in original content
        const originalUrls = findURLsInContent(campaign.content);
        
        // Replace URLs with truncated/cleaned versions BEFORE processing
        let processedContent = campaign.content;
        const sortedUrls = [...originalUrls].sort((a, b) => b.start - a.start);
        
        for (const urlInfo of sortedUrls) {
          let replacement: string;
          if (urlInfo.hasNested && urlInfo.domainText) {
            replacement = `(${urlInfo.domainText} (${urlInfo.cleaned}))`;
          } else if (urlInfo.original.startsWith('(') && urlInfo.original.endsWith(')')) {
            replacement = `(${urlInfo.cleaned})`;
          } else {
            replacement = urlInfo.cleaned;
          }
          
          processedContent = 
            processedContent.substring(0, urlInfo.start) + 
            replacement + 
            processedContent.substring(urlInfo.end);
        }
        
        // Process markdown and formatting
        processedContent = processedContent
          .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove bold markers
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')  // Convert markdown links
          .replace(/\n+/g, ' ')  // Replace newlines with spaces
          .replace(/\s+/g, ' ')  // Normalize whitespace
          .trim();
        
        // Measure this campaign block
        const blockHeight = measureCampaignBlockHeight(campaign.name, processedContent);
        const safetyBuffer = 10; // 10mm buffer for safety
        
        // Keep-together pagination: if block won't fit, move to next page
        if (yPosition + blockHeight + safetyBuffer > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Render campaign title (bold body text, same size as content for proper hierarchy)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.textPrimary[0], colors.textPrimary[1], colors.textPrimary[2]);
        
        // Just use the campaign name without "Campaign:" prefix
        const campaignTitleLines = doc.splitTextToSize(campaign.name, contentWidth);
        doc.text(campaignTitleLines, margin, yPosition);
        yPosition += campaignTitleLines.length * (10 * 0.5) + 3; // +3mm for spacing after title
        
        // Split content at contentWidth (URLs already replaced with truncated versions)
        const contentLineHeight = 10 * 0.5;
        const contentLines = doc.splitTextToSize(processedContent, contentWidth);
        
        // Reset to normal font for content
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // renderLineWithURLs will style URLs and use fullCleaned for link targets
        contentLines.forEach((line: string) => {
          renderLineWithURLs(line, margin, yPosition, 10, undefined, originalUrls);
          yPosition += contentLineHeight;
        });
        
        // Add paragraph spacing between campaigns (larger gap for clear separation)
        yPosition += (campaignIndex < campaigns.length - 1) ? 10 : 5;
      });
      
      // Section spacing
      yPosition += 5;
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
      addCampaignSection('Marketing Activity', analysis.marketingActivity.content);
    }

    if (analysis?.sponsorshipsExperiential?.content) {
      addCampaignSection('Sponsorships & Experiential', analysis.sponsorshipsExperiential.content);
    }

    if (analysis?.socialMediaPresence?.content) {
      addSection('Social Media Presence', analysis.socialMediaPresence.content);
      
      // Add social media handles if they exist
      if (analysis.socialMediaPresence.handles) {
        // Render title
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.textPrimary[0], colors.textPrimary[1], colors.textPrimary[2]);
        
        const titleLines = doc.splitTextToSize('Social Media Handles', contentWidth);
        if (yPosition + titleLines.length * (12 * 0.5) + 5 > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(titleLines, margin, yPosition);
        yPosition += titleLines.length * (12 * 0.5) + 5;
        
        // Split handles by newline to preserve line-by-line structure
        const handleLines = analysis.socialMediaPresence.handles.split('\n').filter(line => line.trim());
        
        handleLines.forEach(line => {
          // Find URLs for this line
          const lineUrls = findURLsInContent(line);
          
          // Check if we need a new page
          if (yPosition > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }
          
          // Render line with URL styling
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(colors.textPrimary[0], colors.textPrimary[1], colors.textPrimary[2]);
          renderLineWithURLs(line.trim(), margin, yPosition, 10, undefined, lineUrls);
          yPosition += 10 * 0.5 + 2;
        });
        
        yPosition += 5;
      }
    }

    if (analysis?.strategicFocus?.content) {
      addCampaignSection('Strategic Focus', analysis.strategicFocus.content);
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

