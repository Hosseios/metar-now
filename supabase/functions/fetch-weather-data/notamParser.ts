
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
    console.log(`Starting NOTAM parsing for ${icaoCode}, content length: ${htmlContent.length}`);
    
    // Clean HTML and extract text content more aggressively
    let textContent = htmlContent
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();

    console.log(`Cleaned text content length: ${textContent.length}`);
    
    // Early exit if content is too short or contains common "no data" indicators
    if (textContent.length < 100 || 
        textContent.toLowerCase().includes('no notams') ||
        textContent.toLowerCase().includes('no current notams') ||
        textContent.toLowerCase().includes('no notams match')) {
      console.log(`Early exit: No NOTAMs indicated in content for ${icaoCode}`);
      return [];
    }
    
    // Enhanced regex patterns for NOTAM detection
    const notamPatterns = [
      // Pattern 1: Standard format with clear separators
      /([ABHJV]\d{4}\/\d{2})\s*[-–—]\s*([^]*?)(?=\s*[ABHJV]\d{4}\/\d{2}\s*[-–—]|$)/gi,
      // Pattern 2: With whitespace variations
      /([ABHJV]\d{4}\/\d{2})\s*[:\-–—]\s*([^]*?)(?=\s*[ABHJV]\d{4}\/\d{2}|CREATED:|$)/gi,
      // Pattern 3: Simple space separation
      /([ABHJV]\d{4}\/\d{2})\s+([^]*?)(?=\s+[ABHJV]\d{4}\/\d{2}|$)/gi
    ];
    
    let totalMatches = 0;
    
    // Try each pattern
    for (let i = 0; i < notamPatterns.length && notams.length === 0; i++) {
      const pattern = notamPatterns[i];
      let matches = [...textContent.matchAll(pattern)];
      totalMatches += matches.length;
      
      console.log(`Pattern ${i + 1} found ${matches.length} potential NOTAMs`);
      
      if (matches.length > 0) {
        matches.forEach((match, index) => {
          const notamId = match[1];
          let notamText = match[2].trim();
          
          // Clean up the NOTAM text more thoroughly
          notamText = notamText
            .replace(/CREATED:\s*\d{2}\s+\w{3}\s+\d{2}:\d{2}\s+\d{4}.*$/gi, '') // Remove CREATED timestamp
            .replace(/\s+/g, ' ') // Normalize whitespace
            .replace(/^\s*[-–—:]\s*/, '') // Remove leading separators
            .trim();
          
          // Only process NOTAMs with substantial content
          if (notamText.length > 15 && !notamText.toLowerCase().includes('no notam')) {
            const type = notamId.charAt(0) as 'A' | 'B' | 'H' | 'J' | 'V';
            const category = categorizeNotam(notamId, notamText);
            
            // Extract dates if present
            const effectiveMatch = notamText.match(/(\d{2}\s+\w{3}\s+\d{2}:\d{2}\s+\d{4})\s+UNTIL/i);
            const expiryMatch = notamText.match(/UNTIL\s+(\d{2}\s+\w{3}\s+\d{2}:\d{2}\s+\d{4})/i);
            
            console.log(`Processing NOTAM ${index + 1}: ${notamId} (${notamText.length} chars)`);
            
            notams.push({
              id: notamId,
              type,
              category,
              text: notamText,
              ...(effectiveMatch && { effectiveDate: effectiveMatch[1] }),
              ...(expiryMatch && { expiryDate: expiryMatch[1] })
            });
          }
        });
        
        // If we found NOTAMs with this pattern, stop trying other patterns
        if (notams.length > 0) break;
      }
    }
    
    // Alternative line-by-line parsing if regex patterns failed
    if (notams.length === 0 && totalMatches === 0) {
      console.log('Trying line-by-line parsing method...');
      
      const lines = textContent.split(/[\n\r]+/).map(line => line.trim()).filter(line => line.length > 0);
      let currentNotam = '';
      let currentId = '';
      
      for (const line of lines) {
        // Check if line contains a NOTAM ID
        const idMatch = line.match(/\b([ABHJV]\d{4}\/\d{2})\b/);
        
        if (idMatch) {
          // Save previous NOTAM if exists
          if (currentId && currentNotam.length > 15) {
            const type = currentId.charAt(0) as 'A' | 'B' | 'H' | 'J' | 'V';
            const category = categorizeNotam(currentId, currentNotam);
            
            console.log(`Found NOTAM via line parsing: ${currentId}`);
            
            notams.push({
              id: currentId,
              type,
              category,
              text: currentNotam.trim()
            });
          }
          
          // Start new NOTAM
          currentId = idMatch[1];
          currentNotam = line.replace(idMatch[0], '').replace(/^[-–—:\s]*/, '').trim();
        } else if (currentId && line.length > 5 && !line.toLowerCase().includes('created:')) {
          // Continue building current NOTAM
          currentNotam += ' ' + line;
        }
      }
      
      // Don't forget the last NOTAM
      if (currentId && currentNotam.length > 15) {
        const type = currentId.charAt(0) as 'A' | 'B' | 'H' | 'J' | 'V';
        const category = categorizeNotam(currentId, currentNotam);
        
        console.log(`Found final NOTAM via line parsing: ${currentId}`);
        
        notams.push({
          id: currentId,
          type,
          category,
          text: currentNotam.trim()
        });
      }
    }
    
    // Final content-based detection for critical keywords
    if (notams.length === 0) {
      console.log('Trying content-based NOTAM detection...');
      
      const criticalKeywords = [
        /runway\s+(closed|clsd)/i,
        /rwy\s+(closed|clsd)/i,
        /taxiway\s+(closed|clsd)/i,
        /twy\s+(closed|clsd)/i,
        /approach\s+unavailable/i,
        /ils\s+(out\s+of\s+service|u\/s)/i,
        /navigation\s+aid.*(out\s+of\s+service|u\/s)/i,
        /navaid.*(out\s+of\s+service|u\/s)/i
      ];
      
      let foundCritical = false;
      let matchedKeyword = '';
      
      for (const keyword of criticalKeywords) {
        if (keyword.test(textContent)) {
          foundCritical = true;
          matchedKeyword = keyword.source;
          break;
        }
      }
      
      if (foundCritical) {
        console.log(`Found critical NOTAM content without proper ID format: ${matchedKeyword}`);
        
        // Create a generic NOTAM entry
        notams.push({
          id: 'GENERIC-001',
          type: 'A',
          category: 'critical',
          text: `Important operational information found for ${icaoCode}. ${textContent.substring(0, 300)}...`
        });
      }
    }
    
    console.log(`Successfully parsed ${notams.length} NOTAMs for ${icaoCode}`);
    
  } catch (error) {
    console.error('Error parsing NOTAMs:', error);
    
    // Return a basic NOTAM indicating parsing issues
    notams.push({
      id: 'PARSE-ERROR',
      type: 'A',
      category: 'informational',
      text: `NOTAM data received but could not be parsed properly for ${icaoCode}. Raw data may contain NOTAMs in an unexpected format.`
    });
  }
  
  // Sort NOTAMs by priority: critical first, then operational, then informational
  return notams.sort((a, b) => {
    const priorityOrder = { critical: 0, operational: 1, informational: 2 };
    return priorityOrder[a.category] - priorityOrder[b.category];
  });
}

function categorizeNotam(id: string, text: string): 'critical' | 'operational' | 'informational' {
  const upperText = text.toUpperCase();
  const type = id.charAt(0);
  
  // Critical NOTAMs (safety-related)
  const criticalKeywords = [
    'CLOSED', 'CLSD', 'DANGEROUS', 'HAZARD', 'EMERGENCY', 'CRANE', 'OBSTACLE',
    'SLIPPERY', 'LIGHTS U/S', 'OUT OF SERVICE', 'INOP', 'UNSERVICEABLE', 'U/S'
  ];
  
  // Operational NOTAMs (affects operations)
  const operationalKeywords = [
    'RWY', 'RUNWAY', 'TWY', 'TAXIWAY', 'APCH', 'APPROACH', 'DEP', 'DEPARTURE',
    'FREQ', 'FREQUENCY', 'RESTRICTED', 'NAVIGATION', 'PROCEDURAL'
  ];
  
  if (criticalKeywords.some(keyword => upperText.includes(keyword)) || type === 'B') {
    return 'critical';
  } else if (operationalKeywords.some(keyword => upperText.includes(keyword)) || ['H', 'J', 'V'].includes(type)) {
    return 'operational';
  }
  
  return 'informational';
}
