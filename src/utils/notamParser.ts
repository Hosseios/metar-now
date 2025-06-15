
import { NotamItem } from "@/types/weather";
import { classifyNotam } from "./notamClassifier";

export const parseNotams = (htmlContent: string, icaoCode: string): NotamItem[] => {
  const notams: NotamItem[] = [];
  
  // Clean the HTML content
  let cleanContent = htmlContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#8203;/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Enhanced regex to capture complete NOTAMs with better text extraction
  const notamPattern = /([ABHJV]\d{4}\/\d{2})\s*-\s*(.*?)(?=\s+[ABHJV]\d{4}\/\d{2}\s*-|$)/gs;
  let match;

  while ((match = notamPattern.exec(cleanContent)) !== null) {
    const notamId = match[1];
    let notamText = match[2].trim();
    
    // Clean up the NOTAM text more thoroughly
    notamText = notamText
      .replace(/CREATED:\s*\d{2}\s+\w{3}\s+\d{2}:\d{2}\s+\d{4}.*$/g, '') // Remove CREATED timestamp
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Extract dates if present
    const effectiveMatch = notamText.match(/(\d{2}\s+\w{3}\s+\d{2}:\d{2}\s+\d{4})\s+UNTIL/);
    const expiryMatch = notamText.match(/UNTIL\s+(\d{2}\s+\w{3}\s+\d{2}:\d{2}\s+\d{4})/);
    const createdMatch = htmlContent.match(new RegExp(`${notamId}.*?CREATED:\\s*(\\d{2}\\s+\\w{3}\\s+\\d{2}:\\d{2}\\s+\\d{4})`));

    if (notamText.length > 10) {
      const type = notamId.charAt(0) as 'A' | 'B' | 'H' | 'J' | 'V';
      const category = classifyNotam(notamId, notamText);
      
      notams.push({
        id: notamId,
        type,
        category,
        text: notamText,
        effectiveDate: effectiveMatch ? effectiveMatch[1] : undefined,
        expiryDate: expiryMatch ? expiryMatch[1] : undefined,
        createdDate: createdMatch ? createdMatch[1] : undefined
      });
    }
  }

  // If regex didn't work well, try alternative parsing
  if (notams.length === 0) {
    const lines = cleanContent.split(/\s+/);
    let currentNotam = '';
    let notamId = '';
    
    for (let i = 0; i < lines.length; i++) {
      const word = lines[i];
      
      if (/^[ABHJV]\d{4}\/\d{2}$/.test(word)) {
        // Save previous NOTAM if exists
        if (notamId && currentNotam.trim()) {
          const cleanedNotam = currentNotam.replace(/CREATED:.*$/, '').trim();
          if (cleanedNotam.length > 10) {
            const type = notamId.charAt(0) as 'A' | 'B' | 'H' | 'J' | 'V';
            const category = classifyNotam(notamId, cleanedNotam);
            
            notams.push({
              id: notamId,
              type,
              category,
              text: cleanedNotam
            });
          }
        }
        
        notamId = word;
        currentNotam = '';
        
        if (i + 1 < lines.length && lines[i + 1] === '-') {
          i++;
        }
      } else if (notamId && !word.startsWith('CREATED:')) {
        currentNotam += ' ' + word;
      }
    }
    
    // Add the last NOTAM
    if (notamId && currentNotam.trim()) {
      const cleanedNotam = currentNotam.replace(/CREATED:.*$/, '').trim();
      if (cleanedNotam.length > 10) {
        const type = notamId.charAt(0) as 'A' | 'B' | 'H' | 'J' | 'V';
        const category = classifyNotam(notamId, cleanedNotam);
        
        notams.push({
          id: notamId,
          type,
          category,
          text: cleanedNotam
        });
      }
    }
  }

  // Sort NOTAMs by priority: critical first, then operational, then informational
  return notams.sort((a, b) => {
    const priorityOrder = { critical: 0, operational: 1, informational: 2 };
    return priorityOrder[a.category] - priorityOrder[b.category];
  });
};
