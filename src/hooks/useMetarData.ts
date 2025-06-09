
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface WeatherData {
  metar: string;
  taf: string;
  notam: string;
}

export const useMetarData = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWeatherData = async (icaoCode: string) => {
    console.log(`Fetching real METAR, TAF, and NOTAM data for ${icaoCode}`);
    setIsLoading(true);
    setError(null);

    try {
      // Fetch METAR data
      const metarProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://aviationweather.gov/api/data/metar?ids=${icaoCode}&format=raw`)}`;
      const metarResponse = await fetch(metarProxyUrl);
      
      if (!metarResponse.ok) {
        throw new Error(`Failed to fetch METAR data: ${metarResponse.status}`);
      }
      
      const metarData = await metarResponse.json();
      
      if (metarData.status.http_code !== 200) {
        throw new Error(`Aviation Weather API returned error: ${metarData.status.http_code}`);
      }

      // Fetch TAF data
      const tafProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://aviationweather.gov/api/data/taf?ids=${icaoCode}&format=raw`)}`;
      const tafResponse = await fetch(tafProxyUrl);
      
      if (!tafResponse.ok) {
        throw new Error(`Failed to fetch TAF data: ${tafResponse.status}`);
      }
      
      const tafData = await tafResponse.json();
      
      if (tafData.status.http_code !== 200) {
        throw new Error(`Aviation Weather API returned error: ${tafData.status.http_code}`);
      }

      // Fetch NOTAM data
      const notamProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://aviationweather.gov/api/data/notam?ids=${icaoCode}&format=raw`)}`;
      const notamResponse = await fetch(notamProxyUrl);
      
      if (!notamResponse.ok) {
        throw new Error(`Failed to fetch NOTAM data: ${notamResponse.status}`);
      }
      
      const notamData = await notamResponse.json();
      
      if (notamData.status.http_code !== 200) {
        throw new Error(`Aviation Weather API returned error: ${notamData.status.http_code}`);
      }

      const weatherData: WeatherData = {
        metar: metarData.contents.trim() || `No METAR data available for ${icaoCode}`,
        taf: tafData.contents.trim() || `No TAF data available for ${icaoCode}`,
        notam: notamData.contents.trim() || `No NOTAM data available for ${icaoCode}`
      };
      
      setWeatherData(weatherData);
      console.log(`Successfully fetched real weather and NOTAM data for ${icaoCode}`);
      
      toast({
        title: "Weather Data Updated",
        description: `Successfully retrieved real METAR, TAF, and NOTAM data for ${icaoCode}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
      console.error(`Error fetching weather data for ${icaoCode}:`, errorMessage);
      
      toast({
        title: "Error",
        description: `Failed to fetch weather data for ${icaoCode}: ${errorMessage}`,
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

  return {
    metar,
    taf
  };
};
