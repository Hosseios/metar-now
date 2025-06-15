import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface WeatherData {
  metar: string;
  taf: string;
  airport: string;
  notam: string;
}

interface DataFetchResult {
  data: string;
  error: string | null;
}

export interface NotamItem {
  id: string;
  type: 'A' | 'B' | 'H' | 'J' | 'V';
  category: 'critical' | 'operational' | 'informational';
  text: string;
  effectiveDate?: string;
  expiryDate?: string;
  createdDate?: string;
}

export const useMetarData = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSingleDataSource = async (url: string, dataType: string): Promise<DataFetchResult> => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        return {
          data: "",
          error: `Failed to fetch ${dataType} data: ${response.status}`
        };
      }
      
      const data = await response.json();
      
      if (data.status.http_code !== 200) {
        return {
          data: "",
          error: `Aviation Weather API returned error for ${dataType}: ${data.status.http_code}`
        };
      }

      const content = data.contents.trim();
      if (!content) {
        return {
          data: `No ${dataType} data available for this station`,
          error: null
        };
      }

      return {
        data: content,
        error: null
      };
    } catch (err) {
      return {
        data: "",
        error: err instanceof Error ? err.message : `Failed to fetch ${dataType} data`
      };
    }
  };

  const classifyNotam = (notamId: string, text: string): 'critical' | 'operational' | 'informational' => {
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

  const parseNotams = (htmlContent: string, icaoCode: string): NotamItem[] => {
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

  const formatNotamsForDisplay = (notams: NotamItem[], icaoCode: string): string => {
    if (notams.length === 0) {
      return `No current NOTAMs for ${icaoCode}`;
    }

    const notamsByCategory = {
      critical: notams.filter(n => n.category === 'critical'),
      operational: notams.filter(n => n.category === 'operational'),
      informational: notams.filter(n => n.category === 'informational')
    };

    let formattedOutput = `NOTAMs for ${icaoCode} (${notams.length} active NOTAMs found)\n`;
    formattedOutput += `${'═'.repeat(60)}\n\n`;

    // Add category summary with professional icons
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
        formattedOutput += `${'─'.repeat(40)}\n\n`;

        category.notams.forEach((notam, index) => {
          const overallIndex = notams.findIndex(n => n.id === notam.id) + 1;
          
          formattedOutput += `NOTAM ${overallIndex}: ${notam.id} [${notam.type}-TYPE]\n`;
          formattedOutput += `${'▔'.repeat(50)}\n`;
          
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

  const fetchNotamData = async (icaoCode: string): Promise<DataFetchResult> => {
    try {
      const notamUrl = `https://www.notams.faa.gov/dinsQueryWeb/queryRetrievalMapAction.do?reportType=Report&formatType=ICAO&retrieveLocId=${icaoCode}&actionType=notamRetrievalByICAOs`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(notamUrl)}`;
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        return {
          data: "",
          error: `Failed to fetch NOTAM data: ${response.status}`
        };
      }
      
      const data = await response.json();
      
      if (data.status.http_code !== 200) {
        return {
          data: "",
          error: `FAA NOTAM API returned error: ${data.status.http_code}`
        };
      }

      const htmlContent = data.contents.trim();
      
      if (htmlContent.includes("No NOTAMs match your criteria") || htmlContent.includes("No current NOTAMs")) {
        return {
          data: `No current NOTAMs for ${icaoCode}`,
          error: null
        };
      }
      
      // Parse NOTAMs into structured data
      const parsedNotams = parseNotams(htmlContent, icaoCode);
      
      if (parsedNotams.length === 0) {
        return {
          data: `No current NOTAMs for ${icaoCode}`,
          error: null
        };
      }
      
      // Format for display
      const formattedNotams = formatNotamsForDisplay(parsedNotams, icaoCode);
      
      return {
        data: formattedNotams,
        error: null
      };
    } catch (err) {
      return {
        data: "",
        error: err instanceof Error ? err.message : "Failed to fetch NOTAM data"
      };
    }
  };

  const fetchWeatherData = async (icaoCode: string) => {
    console.log(`Fetching real METAR, TAF, Airport, and NOTAM data for ${icaoCode}`);
    setIsLoading(true);
    setError(null);

    try {
      // Prepare URLs for all data sources
      const metarProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://aviationweather.gov/api/data/metar?ids=${icaoCode}&format=raw`)}`;
      const tafProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://aviationweather.gov/api/data/taf?ids=${icaoCode}&format=raw`)}`;
      const airportProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://aviationweather.gov/api/data/airport?ids=${icaoCode}`)}`;

      // Fetch all data sources in parallel, but handle each independently
      const [metarResult, tafResult, airportResult, notamResult] = await Promise.all([
        fetchSingleDataSource(metarProxyUrl, 'METAR'),
        fetchSingleDataSource(tafProxyUrl, 'TAF'),
        fetchSingleDataSource(airportProxyUrl, 'Airport'),
        fetchNotamData(icaoCode)
      ]);

      // Collect any errors that occurred
      const errors = [
        metarResult.error,
        tafResult.error,
        airportResult.error,
        notamResult.error
      ].filter(Boolean);

      // Create weather data object with available data
      const weatherData: WeatherData = {
        metar: metarResult.data || `Error fetching METAR: ${metarResult.error}`,
        taf: tafResult.data || `Error fetching TAF: ${tafResult.error}`,
        airport: airportResult.data || `Error fetching Airport data: ${airportResult.error}`,
        notam: notamResult.data || `Error fetching NOTAM: ${notamResult.error}`
      };
      
      setWeatherData(weatherData);
      console.log(`Successfully fetched available data for ${icaoCode}`);
      
      // Show toast based on success/partial success
      if (errors.length === 0) {
        toast({
          title: "Data Updated",
          description: `Successfully retrieved METAR, TAF, Airport, and NOTAM data for ${icaoCode}`,
        });
      } else if (errors.length < 4) {
        toast({
          title: "Partial Data Retrieved",
          description: `Retrieved available data for ${icaoCode}. Some data sources may be unavailable.`,
        });
      } else {
        throw new Error("Failed to fetch any data");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
      console.error(`Error fetching data for ${icaoCode}:`, errorMessage);
      
      toast({
        title: "Error",
        description: `Failed to fetch data for ${icaoCode}: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    weatherData,
    isLoading,
    error,
    fetchWeatherData,
    // Keep backward compatibility
    metarData: weatherData?.metar || null,
    fetchMetar: fetchWeatherData,
  };
};

// Helper function to generate realistic METAR and TAF data
const generateMockWeatherData = (icaoCode: string): WeatherData => {
  const timestamp = new Date().toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '');
  const day = new Date().getDate().toString().padStart(2, '0');
  const hour = new Date().getHours().toString().padStart(2, '0');
  const minute = Math.floor(new Date().getMinutes() / 10) * 10;
  const time = `${day}${hour}${minute.toString().padStart(2, '0')}Z`;
  
  // Random weather conditions
  const winds = [
    "27008KT",
    "36012G18KT",
    "09005KT",
    "VRB03KT",
    "CALM"
  ];
  
  const visibility = [
    "10SM",
    "3SM",
    "1/2SM",
    "10SM"
  ];
  
  const weather = [
    "",
    "FEW020",
    "SCT015 BKN030",
    "BKN008 OVC015",
    "CLR",
    "-RA BKN012 OVC020",
    "BR FEW003 BKN006"
  ];
  
  const temp = Math.floor(Math.random() * 30) - 5;
  const dewpoint = temp - Math.floor(Math.random() * 15);
  const altimeter = (29.50 + Math.random() * 1.0).toFixed(2);
  
  const wind = winds[Math.floor(Math.random() * winds.length)];
  const vis = visibility[Math.floor(Math.random() * visibility.length)];
  const wx = weather[Math.floor(Math.random() * weather.length)];
  
  const metar = `METAR ${icaoCode} ${time} ${wind} ${vis} ${wx} ${temp.toString().padStart(2, '0')}/${dewpoint.toString().padStart(2, '0')} A${altimeter} RMK AO2 SLP${Math.floor(Math.random() * 100).toString().padStart(3, '0')} T${temp.toString().padStart(4, '0')}${dewpoint.toString().padStart(4, '0')}`;
  
  // Generate TAF data
  const tafValidPeriod = `${day}${(parseInt(hour) + 1).toString().padStart(2, '0')}/${(parseInt(day) + 1).toString().padStart(2, '0')}${hour}`;
  const futureWeather = weather[Math.floor(Math.random() * weather.length)];
  const futureWind = winds[Math.floor(Math.random() * winds.length)];
  
  const taf = `TAF ${icaoCode} ${day}${hour}${minute.toString().padStart(2, '0')}Z ${tafValidPeriod} ${futureWind} ${vis} ${futureWeather} 
TEMPO ${day}${(parseInt(hour) + 2).toString().padStart(2, '0')}/${day}${(parseInt(hour) + 6).toString().padStart(2, '0')} ${winds[Math.floor(Math.random() * winds.length)]} ${visibility[Math.floor(Math.random() * visibility.length)]} ${weather[Math.floor(Math.random() * weather.length)]}
FM${day}${(parseInt(hour) + 6).toString().padStart(2, '0')}00 ${winds[Math.floor(Math.random() * winds.length)]} ${vis} ${weather[Math.floor(Math.random() * weather.length)]}`;

  // Generate basic airport data
  const airport = `Airport: ${icaoCode}
Type: Public Use Airport
Coordinates: ${(Math.random() * 180 - 90).toFixed(4)}°, ${(Math.random() * 360 - 180).toFixed(4)}°
Elevation: ${Math.floor(Math.random() * 5000)} ft MSL
Runways: ${Math.floor(Math.random() * 3) + 1}
Control Tower: ${Math.random() > 0.5 ? 'Yes' : 'No'}`;

  // Generate sample NOTAM data
  const notam = `No current NOTAMs for ${icaoCode}`;

  return {
    metar,
    taf,
    airport,
    notam
  };
};
