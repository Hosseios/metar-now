
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Weather Report</h2>
        <p className="text-sm text-slate-400">
          Raw METAR data will appear here
        </p>
      </div>

      {error && (
        <Alert className="bg-red-900/20 border-red-700/50 text-red-200">
          <AlertDescription>
            Failed to fetch weather data. Please check the ICAO code and try again.
          </AlertDescription>
        </Alert>
      )}

      <Textarea
        value={getDisplayContent()}
        readOnly
        className="min-h-[200px] font-mono text-sm bg-slate-900/50 border-slate-600 text-white resize-none focus:ring-0 focus:border-slate-600"
        placeholder="METAR data will appear here..."
      />
      
      {metarData && (
        <div className="text-xs text-slate-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default MetarDisplay;
