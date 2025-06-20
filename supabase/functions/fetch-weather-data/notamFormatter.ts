
interface NotamItem {
  id: string;
  type: 'A' | 'B' | 'H' | 'J' | 'V';
  category: 'critical' | 'operational' | 'informational';
  text: string;
  effectiveDate?: string;
  expiryDate?: string;
  createdDate?: string;
}

export function formatNotamsForDisplay(notams: NotamItem[], icaoCode: string): string {
  if (!notams || notams.length === 0) {
    return `No current NOTAMs for ${icaoCode}`;
  }
  
  console.log(`Formatting ${notams.length} NOTAMs for display`);
  
  let output = `NOTAMs for ${icaoCode} (${notams.length} active NOTAMs found)\n`;
  output += '═'.repeat(60) + '\n\n';
  
  // Group NOTAMs by category
  const critical = notams.filter(n => n.category === 'critical');
  const operational = notams.filter(n => n.category === 'operational');
  const informational = notams.filter(n => n.category === 'informational');
  
  // Add category summary
  if (critical.length > 0) {
    output += `[CRITICAL] ${critical.length} NOTAMs (Safety-related)\n`;
  }
  if (operational.length > 0) {
    output += `[OPERATIONAL] ${operational.length} NOTAMs (Affects operations)\n`;
  }
  if (informational.length > 0) {
    output += `[INFORMATIONAL] ${informational.length} NOTAMs (General info)\n`;
  }
  output += '\n';
  
  // Display critical NOTAMs first
  const categories = [
    { name: 'CRITICAL', notams: critical, prefix: '[CRITICAL]' },
    { name: 'OPERATIONAL', notams: operational, prefix: '[OPERATIONAL]' },
    { name: 'INFORMATIONAL', notams: informational, prefix: '[INFORMATIONAL]' }
  ];
  
  categories.forEach(category => {
    if (category.notams.length > 0) {
      output += `${category.prefix} ${category.name} NOTAMs\n`;
      output += '─'.repeat(40) + '\n\n';
      
      category.notams.forEach((notam, index) => {
        output += `NOTAM ${index + 1}: ${notam.id} [${notam.type}-TYPE]\n`;
        output += '▔'.repeat(35) + '\n';
        
        // Format the text with better line breaks
        const formattedText = formatNotamText(notam.text);
        output += `${formattedText}\n\n`;
        
        if (notam.effectiveDate && notam.expiryDate) {
          output += `[TIME] Effective: ${notam.effectiveDate} - ${notam.expiryDate}\n`;
        } else if (notam.effectiveDate) {
          output += `[TIME] Effective: ${notam.effectiveDate}\n`;
        }
        
        if (notam.createdDate) {
          output += `[CREATED] Created: ${notam.createdDate}\n`;
        }
        
        output += '\n';
      });
    }
  });
  
  return output;
}

function formatNotamText(text: string): string {
  // Clean up and format NOTAM text for better readability
  return text
    .replace(/\. (?=[A-Z])/g, '.\n• ')
    .replace(/(\d{2} \w{3} \d{2}:\d{2} \d{4} UNTIL \d{2} \w{3} \d{2}:\d{2} \d{4})/g, '\n[TIME] $1')
    .replace(/(CREATED: \d{2} \w{3} \d{2}:\d{2} \d{4})/g, '\n[CREATED] $1')
    .replace(/\s+/g, ' ')
    .trim();
}
