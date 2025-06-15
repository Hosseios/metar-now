
import { NotamItem } from "@/types/weather";

export const formatNotamsForDisplay = (notams: NotamItem[], icaoCode: string): string => {
  if (notams.length === 0) {
    return `No current NOTAMs for ${icaoCode}`;
  }

  const notamsByCategory = {
    critical: notams.filter(n => n.category === 'critical'),
    operational: notams.filter(n => n.category === 'operational'),
    informational: notams.filter(n => n.category === 'informational')
  };

  // Use shorter lines for mobile-friendly display
  const isMobile = window.innerWidth <= 768;
  const mainSeparator = isMobile ? '═'.repeat(30) : '═'.repeat(60);
  const categorySeparator = isMobile ? '─'.repeat(25) : '─'.repeat(40);
  const notamSeparator = isMobile ? '▔'.repeat(30) : '▔'.repeat(50);

  let formattedOutput = `NOTAMs for ${icaoCode} (${notams.length} active NOTAMs found)\n`;
  formattedOutput += `${mainSeparator}\n\n`;

  // Add category summary with professional text markers
  if (notamsByCategory.critical.length > 0) {
    formattedOutput += `[CRITICAL] ${notamsByCategory.critical.length} NOTAMs (Safety-related)\n`;
  }
  if (notamsByCategory.operational.length > 0) {
    formattedOutput += `[OPERATIONAL] ${notamsByCategory.operational.length} NOTAMs (Affects operations)\n`;
  }
  if (notamsByCategory.informational.length > 0) {
    formattedOutput += `[INFORMATIONAL] ${notamsByCategory.informational.length} NOTAMs (General info)\n`;
  }
  formattedOutput += '\n';

  // Display NOTAMs by category
  const categories = [
    { name: 'CRITICAL', notams: notamsByCategory.critical, prefix: '[CRITICAL]' },
    { name: 'OPERATIONAL', notams: notamsByCategory.operational, prefix: '[OPERATIONAL]' },
    { name: 'INFORMATIONAL', notams: notamsByCategory.informational, prefix: '[INFORMATIONAL]' }
  ];

  categories.forEach(category => {
    if (category.notams.length > 0) {
      formattedOutput += `${category.prefix} NOTAMs\n`;
      formattedOutput += `${categorySeparator}\n\n`;

      category.notams.forEach((notam, index) => {
        const overallIndex = notams.findIndex(n => n.id === notam.id) + 1;
        
        formattedOutput += `NOTAM ${overallIndex}: ${notam.id} [${notam.type}-TYPE]\n`;
        formattedOutput += `${notamSeparator}\n`;
        
        // Format the main text with better line breaks
        const formattedText = notam.text
          .replace(/\. (?=[A-Z])/g, '.\n• ')
          .replace(/(\d{2} \w{3} \d{2}:\d{2} \d{4} UNTIL \d{2} \w{3} \d{2}:\d{2} \d{4})/g, '\n[TIME] $1')
          .replace(/(CREATED: \d{2} \w{3} \d{2}:\d{2} \d{4})/g, '\n[CREATED] $1');

        formattedOutput += `${formattedText}\n\n`;
        
        if (notam.effectiveDate && notam.expiryDate) {
          formattedOutput += `[TIME] Effective: ${notam.effectiveDate} - ${notam.expiryDate}\n`;
        }
        if (notam.createdDate) {
          formattedOutput += `[CREATED] Created: ${notam.createdDate}\n`;
        }
        
        formattedOutput += '\n';
      });
    }
  });

  return formattedOutput;
};
