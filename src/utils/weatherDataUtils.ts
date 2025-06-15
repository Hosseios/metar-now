
export const isDataAvailable = (data: string) => {
  if (!data || data.trim() === '') return false;
  if (data.includes('Error fetching')) return false;
  if (data.includes('No ') && (data.includes(' data available') || data.includes('current NOTAMs'))) return false;
  return true;
};

export const getDisplayContent = (
  type: 'raw' | 'airport' | 'notam',
  isLoading: boolean,
  error: string | null,
  weatherData: any,
  icaoCode: string
) => {
  if (isLoading) {
    return `Fetching ${type.toUpperCase()} data for ${icaoCode}...\n\nPlease wait while we retrieve the latest information.`;
  }
  
  if (error) {
    return `Unable to connect to weather services for ${icaoCode}\n\nPlease check your internet connection and try again.`;
  }
  
  if (type === 'raw' && weatherData) {
    const metarContent = weatherData.metar || '';
    const tafContent = weatherData.taf || '';
    
    let combinedContent = '';
    
    if (isDataAvailable(metarContent)) {
      combinedContent += `=== CURRENT WEATHER (METAR) ===\n\n${metarContent}\n\n`;
    } else {
      combinedContent += `=== CURRENT WEATHER (METAR) ===\n\nNo current weather report available for ${icaoCode}\n\nThis airport may not provide real-time weather updates, or the data is temporarily unavailable.\n\n`;
    }
    
    if (isDataAvailable(tafContent)) {
      combinedContent += `=== FORECAST (TAF) ===\n\n${tafContent}`;
    } else {
      combinedContent += `=== FORECAST (TAF) ===\n\nNo weather forecast available for ${icaoCode}\n\nThis airport may not issue forecasts, or the forecast data is temporarily unavailable.`;
    }
    
    return combinedContent;
  }
  
  if (weatherData && weatherData[type === 'raw' ? 'metar' : type]) {
    const data = weatherData[type === 'raw' ? 'metar' : type];
    
    if (data.includes('Error fetching') || (data.includes('No ') && (data.includes(' data available') || data.includes('current NOTAMs')))) {
      if (type === 'airport') {
        return `No airport information available for ${icaoCode}\n\nThe airport database may not have details for this facility, or the information is temporarily unavailable.`;
      } else if (type === 'notam') {
        return `No current NOTAMs for ${icaoCode}\n\nThis means there are no active Notices to Airmen for this airport at this time.`;
      }
    }
    
    return data;
  }
  
  if (type === 'raw') {
    return "Enter an ICAO code to view weather conditions and forecasts\n\nMETAR provides current weather observations and TAF provides detailed forecasts for airports worldwide.";
  } else if (type === 'airport') {
    return "Enter an ICAO code to view airport information\n\nAirport data includes facility details and operational status.";
  } else if (type === 'notam') {
    return "Enter an ICAO code to view NOTAMs\n\nNOTAMs provide critical information about airport conditions.";
  }
};
