
import { DataFetchResult, WeatherData } from "@/types/weather";
import { supabase } from "@/integrations/supabase/client";

// Legacy function kept for backward compatibility
export const fetchSingleDataSource = async (url: string, dataType: string): Promise<DataFetchResult> => {
  return {
    data: `Legacy ${dataType} fetching is no longer supported. Please use the main weather data fetching functionality.`,
    error: "This function is deprecated"
  };
};

// Legacy function kept for backward compatibility  
export const fetchNotamData = async (icaoCode: string): Promise<DataFetchResult> => {
  return {
    data: `Legacy NOTAM fetching is no longer supported. Please use the main weather data fetching functionality.`,
    error: "This function is deprecated"
  };
};

// New unified function that uses the Supabase Edge Function
export const fetchWeatherDataViaEdgeFunction = async (icaoCode: string): Promise<WeatherData> => {
  const { data, error } = await supabase.functions.invoke('fetch-weather-data', {
    body: { icaoCode: icaoCode.toUpperCase() }
  });

  if (error) {
    throw new Error(`Edge Function error: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data received from weather service');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return {
    metar: data.metar || `No METAR data available for ${icaoCode}`,
    taf: data.taf || `No TAF data available for ${icaoCode}`,
    airport: data.airport || `No airport data available for ${icaoCode}`,
    notam: data.notam || `No current NOTAMs for ${icaoCode}`
  };
};

// Helper function to generate realistic METAR and TAF data (kept for testing purposes)
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
