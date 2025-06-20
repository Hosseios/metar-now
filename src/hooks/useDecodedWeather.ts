
import { useState, useEffect, useCallback, useRef } from "react";

// Cache for decoded weather data
const decodedCache = new Map<string, {
  data: string;
  timestamp: number;
  expiry: number;
}>();

// Cache duration: 10 minutes
const CACHE_DURATION = 10 * 60 * 1000;

// CORS proxy services with fallback
const CORS_PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

export const useDecodedWeather = (icaoCode: string, isActive: boolean) => {
  const [decodedHtml, setDecodedHtml] = useState<string>("");
  const [isLoadingDecoded, setIsLoadingDecoded] = useState(false);
  const [decodedError, setDecodedError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check cache for existing data
  const getCachedData = useCallback((icao: string) => {
    const cached = decodedCache.get(icao);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    return null;
  }, []);

  // Set cache data
  const setCachedData = useCallback((icao: string, data: string) => {
    decodedCache.set(icao, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + CACHE_DURATION
    });
  }, []);

  const fetchDecodedWeatherWithRetry = useCallback(async (icao: string, signal: AbortSignal) => {
    const aviationWeatherUrl = `https://aviationweather.gov/api/data/taf?ids=${icao}&format=html&metar=true`;
    
    for (let proxyIndex = 0; proxyIndex < CORS_PROXIES.length; proxyIndex++) {
      if (signal.aborted) return null;
      
      try {
        const proxy = CORS_PROXIES[proxyIndex];
        const proxyUrl = proxy + encodeURIComponent(aviationWeatherUrl);
        
        const response = await fetch(proxyUrl, { signal });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type') || '';
        let content = '';
        
        // Check if response is HTML or JSON based on content type or response text
        if (contentType.includes('application/json')) {
          // Response is JSON, parse it
          const data = await response.json();
          
          // Handle different proxy response formats
          if (data.contents) {
            // allorigins format
            content = data.contents;
          } else if (data.content) {
            // codetabs format
            content = data.content;
          } else if (typeof data === 'string') {
            content = data;
          } else {
            content = JSON.stringify(data);
          }
        } else {
          // Response is likely HTML or plain text, get it directly
          const textResponse = await response.text();
          
          // Check if it looks like JSON (starts with { or [)
          const trimmedText = textResponse.trim();
          if (trimmedText.startsWith('{') || trimmedText.startsWith('[')) {
            try {
              const data = JSON.parse(trimmedText);
              if (data.contents) {
                content = data.contents;
              } else if (data.content) {
                content = data.content;
              } else {
                content = textResponse;
              }
            } catch {
              // Not valid JSON, use as-is
              content = textResponse;
            }
          } else {
            // Direct HTML/text response
            content = textResponse;
          }
        }
        
        if (content.trim()) {
          return content;
        } else {
          throw new Error('Empty response');
        }
        
      } catch (err) {
        console.log(`Proxy ${proxyIndex + 1} failed:`, err);
        
        // If this is the last proxy, throw the error
        if (proxyIndex === CORS_PROXIES.length - 1) {
          throw err;
        }
        
        // Wait a bit before trying the next proxy
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    throw new Error('All CORS proxies failed');
  }, []);

  const fetchDecodedWeather = useCallback(async (icao: string) => {
    if (!icao) return;
    
    // Check cache first
    const cachedData = getCachedData(icao);
    if (cachedData) {
      setDecodedHtml(cachedData);
      setDecodedError(null);
      return;
    }
    
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    setIsLoadingDecoded(true);
    setDecodedError(null);
    
    try {
      const content = await fetchDecodedWeatherWithRetry(icao, signal);
      
      if (!signal.aborted && content) {
        setDecodedHtml(content);
        setCachedData(icao, content);
      }
    } catch (err) {
      if (!signal.aborted) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch decoded weather";
        setDecodedError(`Unable to fetch decoded weather: ${errorMessage}`);
      }
    } finally {
      if (!signal.aborted) {
        setIsLoadingDecoded(false);
      }
    }
  }, [getCachedData, setCachedData, fetchDecodedWeatherWithRetry]);

  const debouncedFetch = useCallback((icao: string) => {
    // Clear existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new debounce timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchDecodedWeather(icao);
    }, 300); // 300ms debounce
  }, [fetchDecodedWeather]);

  // Effect to handle fetching when ICAO code changes or tab becomes active
  useEffect(() => {
    if (icaoCode && isActive) {
      debouncedFetch(icaoCode);
    }
    
    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [icaoCode, isActive, debouncedFetch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    decodedHtml,
    isLoadingDecoded,
    decodedError,
    refetch: () => fetchDecodedWeather(icaoCode)
  };
};
