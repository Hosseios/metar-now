
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CloudRain, AlertTriangle, Clock } from "lucide-react";

interface MetarDisplayProps {
  metarData: string | null;
  isLoading: boolean;
  error: string | null;
  icaoCode: string;
}

const MetarDisplay = ({ metarData, isLoading, error, icaoCode }: MetarDisplayProps) => {
  const getDisplayContent = () => {
    if (isLoading) {
      return `Fetching METAR data for ${icaoCode}...\n\nPlease wait while we retrieve the latest weather information.`;
    }
    
    if (error) {
      return `Error fetching METAR data for ${icaoCode}:\n\n${error}\n\nPlease check the ICAO code and try again.`;
    }
    
    if (metarData) {
      return metarData;
    }
    
    return "Enter an ICAO code above to view real-time weather data.\n\nMETAR (Meteorological Aerodrome Report) provides current weather conditions at airports worldwide.";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
          <CloudRain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Weather Report</h2>
          <p className="text-slate-300">
            Raw METAR data and weather conditions
          </p>
        </div>
      </div>

      {error && (
        <Alert className="bg-red-500/20 border-red-400/50 text-red-100 backdrop-blur-sm rounded-xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-100">
            Failed to fetch weather data. Please check the ICAO code and try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <Textarea
          value={getDisplayContent()}
          readOnly
          className="min-h-[250px] font-mono text-sm bg-black/40 border-white/20 text-white resize-none focus:ring-0 focus:border-cyan-400/50 backdrop-blur-sm rounded-xl p-6"
          placeholder="METAR data will appear here..."
        />
        
        {isLoading && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Loading weather data...</span>
            </div>
          </div>
        )}
      </div>
      
      {metarData && (
        <div className="flex items-center space-x-2 text-sm text-slate-300">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default MetarDisplay;
