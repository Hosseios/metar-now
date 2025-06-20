import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { parseNotams } from "./notamParser.ts"
import { formatNotamsForDisplay } from "./notamFormatter.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WeatherRequest {
  icaoCode: string;
}

interface WeatherResponse {
  metar: string;
  taf: string;
  airport: string;
  notam: string;
  decoded: string;
  errors?: string[];
}

// In-memory cache for responses (5 minute TTL)
const cache = new Map<string, { data: WeatherResponse; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithTimeout(url: string, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Aviation-Weather-App/1.0'
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchMetarData(icaoCode: string): Promise<{ data: string; error: string | null }> {
  try {
    console.log(`Fetching METAR data for ${icaoCode}`);
    const url = `https://aviationweather.gov/api/data/metar?ids=${icaoCode}&format=raw`;
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    if (!text.trim()) {
      return { data: `No METAR data available for ${icaoCode}`, error: null };
    }
    
    console.log(`Successfully fetched METAR data for ${icaoCode}`);
    return { data: text.trim(), error: null };
  } catch (error) {
    console.error(`Error fetching METAR for ${icaoCode}:`, error);
    return { data: "", error: error instanceof Error ? error.message : "Failed to fetch METAR data" };
  }
}

async function fetchTafData(icaoCode: string): Promise<{ data: string; error: string | null }> {
  try {
    console.log(`Fetching TAF data for ${icaoCode}`);
    const url = `https://aviationweather.gov/api/data/taf?ids=${icaoCode}&format=raw`;
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    if (!text.trim()) {
      return { data: `No TAF data available for ${icaoCode}`, error: null };
    }
    
    console.log(`Successfully fetched TAF data for ${icaoCode}`);
    return { data: text.trim(), error: null };
  } catch (error) {
    console.error(`Error fetching TAF for ${icaoCode}:`, error);
    return { data: "", error: error instanceof Error ? error.message : "Failed to fetch TAF data" };
  }
}

async function fetchAirportData(icaoCode: string): Promise<{ data: string; error: string | null }> {
  try {
    console.log(`Fetching Airport data for ${icaoCode}`);
    const url = `https://aviationweather.gov/api/data/airport?ids=${icaoCode}`;
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    if (!text.trim()) {
      return { data: `No airport data available for ${icaoCode}`, error: null };
    }
    
    // Try to parse as JSON first, then fall back to text
    try {
      const jsonData = JSON.parse(text);
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        const airport = jsonData[0];
        const formattedData = `Airport: ${airport.icaoId || icaoCode}
Name: ${airport.name || 'Unknown'}
Type: ${airport.type || 'Unknown'}
Coordinates: ${airport.lat || 'Unknown'}°, ${airport.lon || 'Unknown'}°
Elevation: ${airport.elev || 'Unknown'} ft MSL
State: ${airport.state || 'Unknown'}
Country: ${airport.country || 'Unknown'}`;
        
        console.log(`Successfully fetched Airport data for ${icaoCode}`);
        return { data: formattedData, error: null };
      }
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      console.log(`Successfully fetched Airport data for ${icaoCode} (raw text)`);
      return { data: text.trim(), error: null };
    }
    
    return { data: text.trim(), error: null };
  } catch (error) {
    console.error(`Error fetching Airport data for ${icaoCode}:`, error);
    return { data: "", error: error instanceof Error ? error.message : "Failed to fetch Airport data" };
  }
}

async function fetchNotamData(icaoCode: string): Promise<{ data: string; error: string | null }> {
  try {
    console.log(`Fetching NOTAM data for ${icaoCode}`);
    
    // Try multiple NOTAM sources with different timeout strategies
    const notamSources = [
      {
        name: 'FAA NOTAM Service',
        url: `https://www.notams.faa.gov/dinsQueryWeb/queryRetrievalMapAction.do?reportType=Report&formatType=ICAO&retrieveLocId=${icaoCode}&actionType=notamRetrievalByICAOs`,
        timeout: 20000 // 20 seconds for FAA
      },
      {
        name: 'Alternative NOTAM Service',
        url: `https://pilotweb.nas.faa.gov/PilotWeb/notamRetrievalByICAOAction.do?method=displayByICAOs&reportType=RAW&formatType=ICAO&retrieveLocId=${icaoCode}`,
        timeout: 15000 // 15 seconds for alternative
      }
    ];

    let lastError = null;
    
    for (const source of notamSources) {
      try {
        console.log(`Trying ${source.name} for ${icaoCode} (timeout: ${source.timeout}ms)`);
        const response = await fetchWithTimeout(source.url, source.timeout);
        
        if (!response.ok) {
          console.log(`${source.name} returned ${response.status}: ${response.statusText}`);
          continue;
        }
        
        const htmlContent = await response.text();
        console.log(`${source.name} returned ${htmlContent.length} characters for ${icaoCode}`);
        
        if (htmlContent.includes("No NOTAMs match your criteria") || 
            htmlContent.includes("No current NOTAMs") ||
            htmlContent.includes("No NOTAMs were found")) {
          console.log(`No NOTAMs found via ${source.name} for ${icaoCode}`);
          return { data: `No current NOTAMs for ${icaoCode}`, error: null };
        }
        
        // Parse NOTAMs into structured data
        const parsedNotams = parseNotams(htmlContent, icaoCode);
        console.log(`Parsed ${parsedNotams.length} NOTAMs from ${source.name} for ${icaoCode}`);
        
        if (parsedNotams.length === 0) {
          console.log(`No parseable NOTAMs found via ${source.name} for ${icaoCode}`);
          continue; // Try next source
        }
        
        // Format for display
        const formattedNotams = formatNotamsForDisplay(parsedNotams, icaoCode);
        
        console.log(`Successfully fetched and formatted NOTAM data via ${source.name} for ${icaoCode}`);
        return { data: formattedNotams, error: null };
        
      } catch (sourceError) {
        console.error(`${source.name} failed for ${icaoCode}:`, sourceError);
        lastError = sourceError;
        continue; // Try next source
      }
    }
    
    // If all sources failed
    console.error(`All NOTAM sources failed for ${icaoCode}. Last error:`, lastError);
    return { 
      data: `No current NOTAMs for ${icaoCode}`, 
      error: null // Don't treat as error if we can't fetch NOTAMs - just return empty
    };
    
  } catch (error) {
    console.error(`Critical error fetching NOTAM data for ${icaoCode}:`, error);
    return { 
      data: `No current NOTAMs for ${icaoCode}`, 
      error: null // Don't treat as error - NOTAMs are often unavailable
    };
  }
}

async function fetchDecodedData(icaoCode: string): Promise<{ data: string; error: string | null }> {
  try {
    console.log(`Fetching Decoded weather data for ${icaoCode}`);
    const url = `https://aviationweather.gov/api/data/taf?ids=${icaoCode}&format=html&metar=true`;
    const response = await fetchWithTimeout(url, 15000); // 15 second timeout
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const htmlContent = await response.text();
    if (!htmlContent.trim()) {
      return { data: `No decoded weather data available for ${icaoCode}`, error: null };
    }
    
    console.log(`Successfully fetched decoded weather data for ${icaoCode}`);
    return { data: htmlContent.trim(), error: null };
  } catch (error) {
    console.error(`Error fetching decoded weather for ${icaoCode}:`, error);
    return { data: "", error: error instanceof Error ? error.message : "Failed to fetch decoded weather data" };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { icaoCode }: WeatherRequest = await req.json();
    
    if (!icaoCode || typeof icaoCode !== 'string' || icaoCode.length !== 4) {
      return new Response(
        JSON.stringify({ error: 'Valid 4-character ICAO code is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const upperIcaoCode = icaoCode.toUpperCase();
    
    // Check cache first
    const cacheKey = upperIcaoCode;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL) {
      console.log(`Returning cached data for ${upperIcaoCode}`);
      return new Response(
        JSON.stringify({ ...cachedData.data, cached: true }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300'
          }
        }
      );
    }
    
    console.log(`Fetching fresh data for ${upperIcaoCode}`);
    
    // Fetch all data sources in parallel including decoded
    const [metarResult, tafResult, airportResult, notamResult, decodedResult] = await Promise.all([
      fetchMetarData(upperIcaoCode),
      fetchTafData(upperIcaoCode),
      fetchAirportData(upperIcaoCode),
      fetchNotamData(upperIcaoCode),
      fetchDecodedData(upperIcaoCode)
    ]);
    
    // Collect errors
    const errors = [
      metarResult.error,
      tafResult.error,
      airportResult.error,
      notamResult.error,
      decodedResult.error
    ].filter(Boolean) as string[];
    
    // Build response
    const weatherResponse: WeatherResponse = {
      metar: metarResult.data || `Error fetching METAR: ${metarResult.error}`,
      taf: tafResult.data || `Error fetching TAF: ${tafResult.error}`,
      airport: airportResult.data || `Error fetching Airport data: ${airportResult.error}`,
      notam: notamResult.data || `Error fetching NOTAM: ${notamResult.error}`,
      decoded: decodedResult.data || `Error fetching decoded weather: ${decodedResult.error}`,
      ...(errors.length > 0 && { errors })
    };
    
    // Cache the response
    cache.set(cacheKey, { data: weatherResponse, timestamp: Date.now() });
    
    // Clean up old cache entries (simple cleanup)
    if (cache.size > 100) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    
    console.log(`Successfully processed request for ${upperIcaoCode}`);
    
    return new Response(
      JSON.stringify(weatherResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300'
        }
      }
    );
    
  } catch (error) {
    console.error('Error in fetch-weather-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        metar: 'Error fetching data',
        taf: 'Error fetching data', 
        airport: 'Error fetching data',
        notam: 'Error fetching data',
        decoded: 'Error fetching data'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
