
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useMetarData = () => {
  const [metarData, setMetarData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMetar = async (icaoCode: string) => {
    console.log(`Fetching METAR data for ${icaoCode}`);
    setIsLoading(true);
    setError(null);

    try {
      // Simulating API call with realistic METAR data
      // In a real app, this would be: await fetch(`https://api.metar.com/${icaoCode}`)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Simulate occasional API errors
      if (Math.random() < 0.1) {
        throw new Error("API temporarily unavailable");
      }

      // Generate realistic METAR data based on ICAO code
      const mockMetarData = generateMockMetar(icaoCode);
      
      setMetarData(mockMetarData);
      console.log(`Successfully fetched METAR data for ${icaoCode}`);
      
      toast({
        title: "Weather Data Updated",
        description: `Successfully retrieved METAR data for ${icaoCode}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch METAR data";
      setError(errorMessage);
      console.error(`Error fetching METAR data for ${icaoCode}:`, errorMessage);
      
      toast({
        title: "Error",
        description: `Failed to fetch weather data for ${icaoCode}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    metarData,
    isLoading,
    error,
    fetchMetar,
  };
};

// Helper function to generate realistic METAR data
const generateMockMetar = (icaoCode: string): string => {
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
  
  return `METAR ${icaoCode} ${time} ${wind} ${vis} ${wx} ${temp.toString().padStart(2, '0')}/${dewpoint.toString().padStart(2, '0')} A${altimeter} RMK AO2 SLP${Math.floor(Math.random() * 100).toString().padStart(3, '0')} T${temp.toString().padStart(4, '0')}${dewpoint.toString().padStart(4, '0')}`;
};
