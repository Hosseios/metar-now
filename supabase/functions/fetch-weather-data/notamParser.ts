
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
    
    // Clean HTML and extract text content
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
    
    // Look for NOTAM patterns in the cleaned text
    // Pattern 1: Standard NOTAM format with ID
    const notamPattern1 = /([ABHJV]\d{4}\/\d{2})\s*[-\s]*([^]*?)(?=\s*[ABHJV]\d{4}\/\d{2}\s*[-\s]*|$)/gi;
    let matches1 = [...textContent.matchAll(notamPattern1)];
    
    console.log(`Found ${matches1.length} NOTAMs with pattern 1`);
    
    if (matches1.length > 0) {
      matches1.forEach((match, index) => {
        const notamId = match[1];
        let notamText = match[2].trim();
        
        // Clean up the NOTAM text
        notamText = notamText
          .replace(/\s+/g, ' ')
          .replace(/^\s*[-\s]*/, '')
          .trim();
        
        if (notamText.length > 20) { // Only process substantial content
          const type = notamId.charAt(0) as 'A' | 'B' | 'H' | 'J' | 'V';
          const category = categorizeNotam(notamId, notamText);
          
          // Extract dates if present
          const dateMatches = notamText.match(/(\d{2}\s+\w{3}\s+\d{2}:\d{2}\s+\d{4})/g);
          
          console.log(`Processing NOTAM ${index + 1}: ${notamId} (${notamText.length} chars)`);
          
          notams.push({
            id: notamId,
            type,
            category,
            text: notamText,
            ...(dateMatches && dateMatches.length > 0 && { effectiveDate: dateMatches[0] }),
            ...(dateMatches && dateMatches.length > 1 && { expiryDate: dateMatches[1] })
          });
        }
      });
    }
    
    // Pattern 2: Look for NOTAMs in table format or line-by-line
    if (notams.length === 0) {
      console.log('Trying alternative parsing method...');
      
      // Split by common delimiters and look for NOTAM IDs
      const lines = textContent.split(/[\n\r]+/);
      let currentNotam = '';
      let currentId = '';
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Check if line contains a NOTAM ID
        const idMatch = trimmedLine.match(/([ABHJV]\d{4}\/\d{2})/);
        
        if (idMatch) {
          // Save previous NOTAM if exists
          if (currentId && currentNotam.length > 20) {
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
          currentNotam = trimmedLine.replace(idMatch[0], '').replace(/^[-\s]*/, '').trim();
        } else if (currentId && trimmedLine.length > 5) {
          // Continue building current NOTAM
          currentNotam += ' ' + trimmedLine;
        }
      }
      
      // Don't forget the last NOTAM
      if (currentId && currentNotam.length > 20) {
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
    
    // Pattern 3: Look for any text that mentions runway closures, etc. even without proper IDs
    if (notams.length === 0) {
      console.log('Trying content-based NOTAM detection...');
      
      const criticalKeywords = [
        'runway closed', 'rwy closed', 'runway clsd', 'rwy clsd',
        'taxiway closed', 'twy closed', 'taxiway clsd', 'twy clsd',
        'approach unavailable', 'ils out of service', 'ils u/s',
        'navigation aid out of service', 'navaid u/s'
      ];
      
      const lowerText = textContent.toLowerCase();
      let foundCritical = false;
      
      for (const keyword of criticalKeywords) {
        if (lowerText.includes(keyword)) {
          foundCritical = true;
          break;
        }
      }
      
      if (foundCritical) {
        console.log('Found critical NOTAM content without proper ID format');
        
        // Create a generic NOTAM entry
        notams.push({
          id: 'GENERIC-001',
          type: 'A',
          category: 'critical',
          text: `Important operational information found for ${icaoCode}. ${textContent.substring(0, 500)}...`
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
      text: `NOTAM data received but could not be parsed properly for ${icaoCode}. This may indicate NOTAMs are available but in an unexpected format.`
    });
  }
  
  return notams;
}

function categorizeNotam(id: string, text: string): 'critical' | 'operational' | 'informational' {
  const upperText = text.toUpperCase();
  const type = id.charAt(0);
  
  // Critical NOTAMs (safety-related)
  const criticalKeywords = [
    'CLOSED', 'CLSD', 'DANGEROUS', 'HAZARD', 'EMERGENCY', 'CRANE', 'OBSTACLE',
    'SLIPPERY', 'LIGHTS U/S', 'OUT OF SERVICE', 'INOP', 'UNSERVICEABLE'
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
