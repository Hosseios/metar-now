
interface NotamItem {
  id: string;
  type: 'A' | 'B' | 'H' | 'J' | 'V';
  category: 'critical' | 'operational' | 'informational';
  text: string;
  effectiveDate?: string;
  expiryDate?: string;
  createdDate?: string;
}

export function parseNotams(htmlContent: string, icaoCode: string): NotamItem[] {
  const notams: NotamItem[] = [];
  
  try {
    // Look for NOTAM blocks in the HTML
    const notamPattern = /NOTAM\s+([A-Z]\d{4}\/\d{2})[^]*?(?=NOTAM\s+[A-Z]\d{4}\/\d{2}|$)/gi;
    const matches = htmlContent.match(notamPattern);
    
    if (!matches) {
      // Try alternative parsing for different HTML formats
      const lines = htmlContent.split('\n');
      let currentNotam = '';
      let notamId = '';
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.match(/^[A-Z]\d{4}\/\d{2}/)) {
          // Save previous NOTAM if exists
          if (currentNotam && notamId) {
            notams.push(createNotamItem(notamId, currentNotam));
          }
          
          // Start new NOTAM
          notamId = trimmedLine.match(/^([A-Z]\d{4}\/\d{2})/)?.[1] || '';
          currentNotam = trimmedLine;
        } else if (notamId && trimmedLine) {
          currentNotam += ' ' + trimmedLine;
        }
      }
      
      // Don't forget the last NOTAM
      if (currentNotam && notamId) {
        notams.push(createNotamItem(notamId, currentNotam));
      }
      
      return notams;
    }
    
    matches.forEach((match, index) => {
      const idMatch = match.match(/NOTAM\s+([A-Z]\d{4}\/\d{2})/i);
      const id = idMatch ? idMatch[1] : `NOTAM-${index + 1}`;
      
      notams.push(createNotamItem(id, match.trim()));
    });
    
  } catch (error) {
    console.error('Error parsing NOTAMs:', error);
    // Return a basic NOTAM indicating parsing issues
    notams.push({
      id: 'PARSE-ERROR',
      type: 'A',
      category: 'informational',
      text: `Unable to parse NOTAM data for ${icaoCode}. Raw data may be available.`
    });
  }
  
  return notams;
}

function createNotamItem(id: string, text: string): NotamItem {
  // Determine NOTAM type from ID
  const type = (id.match(/^([A-Z])/)?.[1] as 'A' | 'B' | 'H' | 'J' | 'V') || 'A';
  
  // Categorize based on content keywords
  let category: 'critical' | 'operational' | 'informational' = 'informational';
  
  const criticalKeywords = ['CLOSED', 'CLSD', 'DANGEROUS', 'HAZARD', 'EMERGENCY'];
  const operationalKeywords = ['RWY', 'RUNWAY', 'TWY', 'TAXIWAY', 'FREQ', 'FREQUENCY'];
  
  const upperText = text.toUpperCase();
  
  if (criticalKeywords.some(keyword => upperText.includes(keyword))) {
    category = 'critical';
  } else if (operationalKeywords.some(keyword => upperText.includes(keyword))) {
    category = 'operational';
  }
  
  // Try to extract dates (basic parsing)
  const datePattern = /(\d{2})(\d{2})(\d{2})(\d{4})/g;
  const dates = text.match(datePattern);
  
  return {
    id,
    type,
    category,
    text: text.replace(/\s+/g, ' ').trim(),
    ...(dates && dates.length > 0 && { effectiveDate: dates[0] }),
    ...(dates && dates.length > 1 && { expiryDate: dates[1] })
  };
}
