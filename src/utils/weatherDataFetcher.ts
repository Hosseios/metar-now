
import { DataFetchResult, WeatherData } from "@/types/weather";
import { parseNotams } from "./notamParser";
import { formatNotamsForDisplay } from "./notamFormatter";

// CORS proxy services with fallback
const CORS_PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

const fetchWithProxyRetry = async (targetUrl: string, dataType: string): Promise<DataFetchResult> => {
  for (let proxyIndex = 0; proxyIndex < CORS_PROXIES.length; proxyIndex++) {
    try {
      const proxy = CORS_PROXIES[proxyIndex];
      const proxyUrl = proxy + encodeURIComponent(targetUrl);
      
      console.log(`Attempting to fetch ${dataType} data using proxy ${proxyIndex + 1}:`, proxy);
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      // Get response as text first, then try to parse as JSON if it looks like JSON
      const responseText = await response.text();
      let content = '';
      let data = null;
      
      // Try to parse as JSON if the response looks like JSON
      if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
        try {
          data = JSON.parse(responseText);
          
          // Handle different proxy response formats
          if (data.contents) {
            // allorigins format
            content = data.contents;
          } else if (typeof data === 'string') {
            // corsproxy format or direct string response
            content = data;
          } else if (data.content) {
            // codetabs format
            content = data.content;
          } else {
            // fallback to stringified JSON
            content = JSON.stringify(data);
          }
        } catch (jsonError) {
          // If JSON parsing fails, use the raw text
          content = responseText;
        }
      } else {
        // Response is plain text (like METAR/TAF data)
        content = responseText;
      }
      
      // Check if we got valid response content
      if (data && data.status && data.status.http_code !== 200) {
        throw new Error(`Aviation Weather API returned error for ${dataType}: ${data.status.http_code}`);
      }
      
      const trimmedContent = content.trim();
      if (!trimmedContent) {
        return {
          data: `No ${dataType} data available for this station`,
          error: null
        };
      }
      
      console.log(`Successfully fetched ${dataType} data using proxy ${proxyIndex + 1}`);
      return {
        data: trimmedContent,
        error: null
      };
      
    } catch (err) {
      console.warn(`Proxy ${proxyIndex + 1} failed for ${dataType}:`, err);
      
      // If this is the last proxy, return the error
      if (proxyIndex === CORS_PROXIES.length - 1) {
        return {
          data: "",
          error: err instanceof Error ? err.message : `Failed to fetch ${dataType} data`
        };
      }
      
      // Wait a bit before trying the next proxy
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return {
    data: "",
    error: `All CORS proxies failed for ${dataType} data`
  };
};

export const fetchSingleDataSource = async (url: string, dataType: string): Promise<DataFetchResult> => {
  // Extract the target URL from the proxy URL if it's already proxied
  let targetUrl = url;
  if (url.includes('api.allorigins.win/get?url=')) {
    targetUrl = decodeURIComponent(url.split('url=')[1]);
  }
  
  return await fetchWithProxyRetry(targetUrl, dataType);
};

export const fetchNotamData = async (icaoCode: string): Promise<DataFetchResult> => {
  try {
    const notamUrl = `https://www.notams.faa.gov/dinsQueryWeb/queryRetrievalMapAction.do?reportType=Report&formatType=ICAO&retrieveLocId=${icaoCode}&actionType=notamRetrievalByICAOs`;
    
    console.log(`Fetching NOTAM data for ${icaoCode}`);
    
    for (let proxyIndex = 0; proxyIndex < CORS_PROXIES.length; proxyIndex++) {
      try {
        const proxy = CORS_PROXIES[proxyIndex];
        const proxyUrl = proxy + encodeURIComponent(notamUrl);
        
        console.log(`Attempting to fetch NOTAM data using proxy ${proxyIndex + 1}:`, proxy);
        
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        // Get response as text first, then try to parse as JSON if it looks like JSON
        const responseText = await response.text();
        let htmlContent = '';
        let data = null;
        
        // Try to parse as JSON if the response looks like JSON
        if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
          try {
            data = JSON.parse(responseText);
            
            // Handle different proxy response formats
            if (data.contents) {
              // allorigins format
              htmlContent = data.contents;
            } else if (typeof data === 'string') {
              // corsproxy format or direct string response
              htmlContent = data;
            } else if (data.content) {
              // codetabs format
              htmlContent = data.content;
            } else {
              // fallback to stringified JSON
              htmlContent = JSON.stringify(data);
            }
          } catch (jsonError) {
            // If JSON parsing fails, use the raw text
            htmlContent = responseText;
          }
        } else {
          // Response is plain text (HTML from NOTAM service)
          htmlContent = responseText;
        }
        
        // Check if we got valid response
        if (data && data.status && data.status.http_code !== 200) {
          throw new Error(`FAA NOTAM API returned error: ${data.status.http_code}`);
        }
        
        const trimmedContent = htmlContent.trim();
        
        if (trimmedContent.includes("No NOTAMs match your criteria") || trimmedContent.includes("No current NOTAMs")) {
          console.log(`No NOTAMs found for ${icaoCode}`);
          return {
            data: `No current NOTAMs for ${icaoCode}`,
            error: null
          };
        }
        
        // Parse NOTAMs into structured data
        const parsedNotams = parseNotams(trimmedContent, icaoCode);
        
        if (parsedNotams.length === 0) {
          return {
            data: `No current NOTAMs for ${icaoCode}`,
            error: null
          };
        }
        
        // Format for display
        const formattedNotams = formatNotamsForDisplay(parsedNotams, icaoCode);
        
        console.log(`Successfully fetched NOTAM data using proxy ${proxyIndex + 1}`);
        return {
          data: formattedNotams,
          error: null
        };
        
      } catch (err) {
        console.warn(`Proxy ${proxyIndex + 1} failed for NOTAM:`, err);
        
        // If this is the last proxy, return the error
        if (proxyIndex === CORS_PROXIES.length - 1) {
          return {
            data: "",
            error: err instanceof Error ? err.message : "Failed to fetch NOTAM data"
          };
        }
        
        // Wait a bit before trying the next proxy
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return {
      data: "",
      error: "All CORS proxies failed for NOTAM data"
    };
  } catch (err) {
    return {
      data: "",
      error: err instanceof Error ? err.message : "Failed to fetch NOTAM data"
    };
  }
};

// Helper function to generate realistic METAR and TAF data
export const generateMockWeatherData = (icaoCode: string): WeatherData => {
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
