
import { useState, useEffect } from "react";

export const useDecodedWeather = (icaoCode: string, isActive: boolean) => {
  const [decodedHtml, setDecodedHtml] = useState<string>("");
  const [isLoadingDecoded, setIsLoadingDecoded] = useState(false);
  const [decodedError, setDecodedError] = useState<string | null>(null);

  const fetchDecodedWeather = async () => {
    if (!icaoCode) return;
    
    setIsLoadingDecoded(true);
    setDecodedError(null);
    
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://aviationweather.gov/api/data/taf?ids=${icaoCode}&format=html&metar=true`)}`;
      
      console.log(`Fetching decoded weather for ${icaoCode} via CORS proxy`);
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch decoded weather: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status.http_code !== 200) {
        throw new Error(`Aviation Weather API returned error: ${data.status.http_code}`);
      }
      
      setDecodedHtml(data.contents);
      console.log(`Successfully fetched decoded weather for ${icaoCode}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch decoded weather";
      setDecodedError(errorMessage);
      console.error('Error fetching decoded weather:', errorMessage);
    } finally {
      setIsLoadingDecoded(false);
    }
  };

  useEffect(() => {
    if (icaoCode && isActive) {
      fetchDecodedWeather();
    }
  }, [icaoCode, isActive]);

  return {
    decodedHtml,
    isLoadingDecoded,
    decodedError
  };
};
