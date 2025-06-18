
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
  
  let output = `NOTAMs for ${icaoCode}\n`;
  output += '='.repeat(20) + '\n\n';
  
  // Sort NOTAMs by category priority
  const sortedNotams = notams.sort((a, b) => {
    const priorityOrder = { 'critical': 0, 'operational': 1, 'informational': 2 };
    return priorityOrder[a.category] - priorityOrder[b.category];
  });
  
  sortedNotams.forEach((notam, index) => {
    // Add category indicator
    const categorySymbol = getCategorySymbol(notam.category);
    
    output += `${categorySymbol} ${notam.id} [${notam.type}]\n`;
    output += `Category: ${notam.category.toUpperCase()}\n`;
    
    if (notam.effectiveDate) {
      output += `Effective: ${formatNotamDate(notam.effectiveDate)}\n`;
    }
    
    if (notam.expiryDate) {
      output += `Expires: ${formatNotamDate(notam.expiryDate)}\n`;
    }
    
    output += `\nText: ${notam.text}\n`;
    
    if (index < sortedNotams.length - 1) {
      output += '\n' + '-'.repeat(40) + '\n\n';
    }
  });
  
  return output;
}

function getCategorySymbol(category: string): string {
  switch (category) {
    case 'critical':
      return '⚠️';
    case 'operational':
      return '🔧';
    case 'informational':
      return 'ℹ️';
    default:
      return '📋';
  }
}

function formatNotamDate(dateStr: string): string {
  // Handle NOTAM date format (DDHHMMYYYY or similar)
  if (dateStr.length === 8) {
    const day = dateStr.substring(0, 2);
    const hour = dateStr.substring(2, 4);
    const minute = dateStr.substring(4, 6);
    const year = dateStr.substring(6, 8);
    
    return `${day}/${hour}:${minute} (20${year})`;
  }
  
  if (dateStr.length === 10) {
    const day = dateStr.substring(0, 2);
    const hour = dateStr.substring(2, 4);
    const minute = dateStr.substring(4, 6);
    const year = dateStr.substring(6, 10);
    
    return `${day}/${hour}:${minute} (${year})`;
  }
  
  return dateStr; // Return as-is if format is not recognized
}
