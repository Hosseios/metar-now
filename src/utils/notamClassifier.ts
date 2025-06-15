
export const classifyNotam = (notamId: string, text: string): 'critical' | 'operational' | 'informational' => {
  const upperText = text.toUpperCase();
  const type = notamId.charAt(0);
  
  // Critical NOTAMs (safety-related)
  if (
    upperText.includes('RUNWAY') && (upperText.includes('CLOSED') || upperText.includes('CLSD')) ||
    upperText.includes('RWY') && (upperText.includes('CLOSED') || upperText.includes('CLSD')) ||
    upperText.includes('CRANE') ||
    upperText.includes('OBSTACLE') ||
    upperText.includes('SLIPPERY') ||
    upperText.includes('LIGHTS U/S') ||
    upperText.includes('HAZARD') ||
    type === 'B' // Airspace and procedures
  ) {
    return 'critical';
  }
  
  // Operational NOTAMs (affects operations)
  if (
    upperText.includes('TAXIWAY') ||
    upperText.includes('TWY') ||
    upperText.includes('APPROACH') ||
    upperText.includes('DEPARTURE') ||
    upperText.includes('RESTRICTED AREA') ||
    upperText.includes('NAVIGATION') ||
    upperText.includes('APCH') ||
    upperText.includes('DEP') ||
    upperText.includes('PROCEDURAL') ||
    type === 'H' || type === 'J' || type === 'V' // Hazards, restrictions, and procedures
  ) {
    return 'operational';
  }
  
  // Informational NOTAMs
  return 'informational';
};
