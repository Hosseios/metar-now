import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CloudRain, AlertTriangle, Clock, Calendar, Info, Plane } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WeatherData } from "@/hooks/useMetarData";
import RetroRadar from "./RetroRadar";
import { useState } from "react";

interface MetarDisplayProps {
  weatherData?: WeatherData | null;
  metarData?: string | null; // Keep for backward compatibility
  isLoading: boolean;
  error: string | null;
  icaoCode: string;
}

const MetarDisplay = ({ weatherData, metarData, isLoading, error, icaoCode }: MetarDisplayProps) => {
  const [decodedHtml, setDecodedHtml] = useState<string>("");
  const [isLoadingDecoded, setIsLoadingDecoded] = useState(false);
  const [decodedError, setDecodedError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use new weatherData if available, fallback to old metarData for backward compatibility
  const currentWeatherData = weatherData || (metarData ? { metar: metarData, taf: "", airport: "" } : null);

  // Check if data is available (not an error message and not empty)
  const isDataAvailable = (data: string) => {
    if (!data || data.trim() === '') return false;
    if (data.includes('Error fetching')) return false;
    if (data.includes('No ') && data.includes(' data available')) return false;
    return true;
  };

  const hasMetarData = currentWeatherData ? isDataAvailable(currentWeatherData.metar) : false;
  const hasTafData = currentWeatherData ? isDataAvailable(currentWeatherData.taf) : false;
  const hasAirportData = currentWeatherData ? isDataAvailable(currentWeatherData.airport) : false;

  const fetchDecodedWeather = async () => {
    if (!icaoCode) return;
    
    setIsLoadingDecoded(true);
    setDecodedError(null);
    
    try {
      // Use a CORS proxy to access the Aviation Weather API
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
      setIsDialogOpen(true);
      console.log(`Successfully fetched decoded weather for ${icaoCode}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch decoded weather";
      setDecodedError(errorMessage);
      console.error('Error fetching decoded weather:', errorMessage);
    } finally {
      setIsLoadingDecoded(false);
    }
  };

  const getDisplayContent = (type: 'metar' | 'taf' | 'airport') => {
    if (isLoading) {
      return `Fetching ${type.toUpperCase()} data for ${icaoCode}...\n\nPlease wait while we retrieve the latest information.`;
    }
    
    if (error) {
      return `Error fetching ${type.toUpperCase()} data for ${icaoCode}:\n\n${error}\n\nPlease check the ICAO code and try again.`;
    }
    
    if (currentWeatherData && currentWeatherData[type]) {
      // Check if it's an error message and clean it up
      const data = currentWeatherData[type];
      if (data.includes('Error fetching')) {
        const typeUpper = type.toUpperCase();
        return `No ${typeUpper} data available for ${icaoCode}\n\nThis station may not provide ${typeUpper} reports or the data may be temporarily unavailable.`;
      }
      if (data.includes('No ') && data.includes(' data available')) {
        const typeUpper = type.toUpperCase();
        return `No ${typeUpper} data available for ${icaoCode}\n\nThis station may not provide ${typeUpper} reports.`;
      }
      return data;
    }
    
    if (type === 'metar') {
      return "Enter an ICAO code above to view real-time weather data.\n\nMETAR (Meteorological Aerodrome Report) provides current weather conditions at airports worldwide.";
    } else if (type === 'taf') {
      return "Enter an ICAO code above to view forecast data.\n\nTAF (Terminal Aerodrome Forecast) provides weather forecasts for airports, typically covering 24-30 hours.";
    } else {
      return "Enter an ICAO code above to view airport information.\n\nAirport data includes facility information, coordinates, elevation, and operational details.";
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
            <CloudRain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Weather Report</h2>
            <p className="text-slate-300">
              Current conditions, forecasts, and airport information
            </p>
          </div>
        </div>

        {/* Decoded Weather Button */}
        {currentWeatherData && icaoCode && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDecodedWeather}
                disabled={isLoadingDecoded}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Info className="w-4 h-4 mr-2" />
                {isLoadingDecoded ? "Loading..." : "View Decoded Weather"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] bg-black border-orange-400/50">
              <DialogHeader>
                <DialogTitle className="text-orange-400 font-mono">Decoded Weather Report - {icaoCode}</DialogTitle>
              </DialogHeader>
              <div className="h-[60vh] w-full overflow-auto scrollbar-hide">
                {decodedError ? (
                  <Alert className="bg-red-500/20 border-red-400/50 text-red-100">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-100">
                      {decodedError}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div 
                    className="p-6 bg-black text-orange-400 font-mono text-sm avionics-display min-h-full"
                    style={{
                      fontFamily: 'Monaco, "Courier New", monospace',
                      textShadow: '0 0 8px rgba(255, 165, 0, 0.6)',
                      letterSpacing: '0.5px',
                      lineHeight: '1.6'
                    }}
                    dangerouslySetInnerHTML={{ __html: decodedHtml }}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {error && (
        <Alert className="bg-red-500/20 border-red-400/50 text-red-100 backdrop-blur-sm rounded-xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-100">
            Failed to fetch data. Please check the ICAO code and try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <Tabs defaultValue="metar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-sm">
            <TabsTrigger value="metar" className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-200">
              <CloudRain className="w-4 h-4" />
              METAR
              {hasMetarData && (
                <div className="w-2 h-2 bg-orange-400 rounded-full ml-1 shadow-sm shadow-orange-400/50"></div>
              )}
            </TabsTrigger>
            <TabsTrigger value="taf" className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-200">
              <Calendar className="w-4 h-4" />
              TAF
              {hasTafData && (
                <div className="w-2 h-2 bg-orange-400 rounded-full ml-1 shadow-sm shadow-orange-400/50"></div>
              )}
            </TabsTrigger>
            <TabsTrigger value="airport" className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-200">
              <Plane className="w-4 h-4" />
              Airport
              {hasAirportData && (
                <div className="w-2 h-2 bg-orange-400 rounded-full ml-1 shadow-sm shadow-orange-400/50"></div>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metar" className="mt-4">
            <div className="relative">
              <div className="min-h-[200px] max-h-[400px] overflow-auto scrollbar-hide bg-black border-0 text-orange-400 p-6 shadow-inner avionics-display rounded-none"
                style={{
                  fontFamily: 'Monaco, "Courier New", monospace',
                  textShadow: '0 0 8px rgba(255, 165, 0, 0.6)',
                  letterSpacing: '0.5px',
                  lineHeight: '1.6'
                }}>
                <pre className="whitespace-pre-wrap font-mono">{getDisplayContent('metar')}</pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="taf" className="mt-4">
            <div className="relative">
              <div className="min-h-[200px] max-h-[400px] overflow-auto scrollbar-hide bg-black border-0 text-orange-400 p-6 shadow-inner avionics-display rounded-none"
                style={{
                  fontFamily: 'Monaco, "Courier New", monospace',
                  textShadow: '0 0 8px rgba(255, 165, 0, 0.6)',
                  letterSpacing: '0.5px',
                  lineHeight: '1.6'
                }}>
                <pre className="whitespace-pre-wrap font-mono">{getDisplayContent('taf')}</pre>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="airport" className="mt-4">
            <div className="relative">
              <div className="min-h-[200px] max-h-[400px] overflow-auto scrollbar-hide bg-black border-0 text-orange-400 p-6 shadow-inner avionics-display rounded-none"
                style={{
                  fontFamily: 'Monaco, "Courier New", monospace',
                  textShadow: '0 0 8px rgba(255, 165, 0, 0.6)',
                  letterSpacing: '0.5px',
                  lineHeight: '1.6'
                }}>
                <pre className="whitespace-pre-wrap font-mono">{getDisplayContent('airport')}</pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Radar Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            <RetroRadar isActive={true} />
          </div>
        )}
      </div>
      
      {currentWeatherData && (
        <div className="flex items-center space-x-2 text-sm text-slate-300">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default MetarDisplay;
