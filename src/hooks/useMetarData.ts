
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WeatherData, NotamItem } from "@/types/weather";
import { supabase } from "@/integrations/supabase/client";

export type { WeatherData, NotamItem } from "@/types/weather";

export const useMetarData = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWeatherData = async (icaoCode: string) => {
    console.log(`Fetching weather data for ${icaoCode} using Supabase Edge Function`);
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('fetch-weather-data', {
        body: { icaoCode: icaoCode.toUpperCase() }
      });

      if (functionError) {
        throw new Error(`Edge Function error: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('No data received from weather service');
      }

      // Handle errors in the response
      if (data.error) {
        throw new Error(data.error);
      }

      const weatherData: WeatherData = {
        metar: data.metar || `No METAR data available for ${icaoCode}`,
        taf: data.taf || `No TAF data available for ${icaoCode}`,
        airport: data.airport || `No airport data available for ${icaoCode}`,
        notam: data.notam || `No current NOTAMs for ${icaoCode}`,
        decoded: data.decoded || `No decoded weather data available for ${icaoCode}`
      };
      
      setWeatherData(weatherData);
      console.log(`Successfully fetched weather data for ${icaoCode}${data.cached ? ' (cached)' : ''}`);
      
      // Show success toast
      toast({
        title: "Data Updated",
        description: `Successfully retrieved weather data for ${icaoCode}${data.cached ? ' (cached)' : ''}`,
      });

      // Show warning toast if there were partial errors
      if (data.errors && data.errors.length > 0) {
        toast({
          title: "Partial Data Retrieved",
          description: `Some data sources had issues: ${data.errors.join(', ')}`,
          variant: "default",
        });
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

  // Generate decoded data
  const decoded = `Decoded Weather for ${icaoCode}:
Wind: ${wind}
Visibility: ${vis}
Weather: ${wx || 'Clear'}
Temperature: ${temp}°C
Dewpoint: ${dewpoint}°C
Altimeter: ${altimeter}" Hg`;

  return {
    metar,
    taf,
    airport,
    notam,
    decoded
  };
};
