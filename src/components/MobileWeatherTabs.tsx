
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CloudRain, Bell, Plane, FileText, AlertTriangle } from "lucide-react";
import { useDecodedWeather } from "@/hooks/useDecodedWeather";
import { isDataAvailable, getDisplayContent } from "@/utils/weatherDataUtils";

interface MobileWeatherTabsProps {
  weatherTab: string;
  setWeatherTab: (tab: string) => void;
  weatherData: any;
  isLoading: boolean;
  error: string | null;
  icaoCode: string;
}

const MobileWeatherTabs = ({
  weatherTab,
  setWeatherTab,
  weatherData,
  isLoading,
  error,
  icaoCode
}: MobileWeatherTabsProps) => {
  const { decodedHtml, isLoadingDecoded, decodedError } = useDecodedWeather(
    icaoCode,
    weatherTab === "decoded"
  );

  const hasMetarData = weatherData ? isDataAvailable(weatherData.metar) : false;
  const hasTafData = weatherData ? isDataAvailable(weatherData.taf) : false;
  const hasAirportData = weatherData ? isDataAvailable(weatherData.airport) : false;
  const hasNotamData = weatherData ? isDataAvailable(weatherData.notam) : false;
  const hasWeatherData = hasMetarData || hasTafData;

  return (
    <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
      <Tabs value={weatherTab} onValueChange={setWeatherTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-900/60 rounded-none h-12">
          <TabsTrigger 
            value="decoded" 
            className="flex items-center gap-1 text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-200"
          >
            <FileText className="w-4 h-4" />
            Decoded
          </TabsTrigger>
          <TabsTrigger 
            value="raw" 
            className="flex items-center gap-1 text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-200 relative"
          >
            <CloudRain className="w-4 h-4" />
            Raw
            {hasWeatherData && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full shadow-sm shadow-orange-400/50"></div>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="notam" 
            className="flex items-center gap-1 text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-200 relative"
          >
            <Bell className="w-4 h-4" />
            NOTAM
            {hasNotamData && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full shadow-sm shadow-orange-400/50"></div>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="airport" 
            className="flex items-center gap-1 text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-200 relative"
          >
            <Plane className="w-4 h-4" />
            Airport
            {hasAirportData && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full shadow-sm shadow-orange-400/50"></div>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="decoded" className="mt-0 border-0 p-0">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Decoded Weather</h3>
              {isLoadingDecoded && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-orange-300">Loading...</span>
                </div>
              )}
            </div>
            <ScrollArea className="h-[400px] w-full [&>[data-radix-scroll-area-viewport]]:scrollbar-thin [&>[data-radix-scroll-area-viewport]]:scrollbar-track-black [&>[data-radix-scroll-area-viewport]]:scrollbar-thumb-orange-400/50 [&>[data-radix-scroll-area-viewport]]:scrollbar-thumb-rounded">
              <div className="bg-black/90 text-orange-400 p-4 rounded-xl avionics-display h-full min-h-[400px] flex flex-col"
                style={{
                  fontFamily: 'Monaco, "Courier New", monospace',
                  textShadow: '0 0 8px rgba(255, 165, 0, 0.6)',
                  letterSpacing: '0.5px',
                  lineHeight: '1.4',
                  fontSize: '13px'
                }}>
                {!icaoCode ? (
                  <div className="flex-1 flex items-center justify-center">
                    <pre className="whitespace-pre-wrap font-mono text-center">
                      Enter an ICAO code above to view decoded weather information
                      
                      Decoded weather provides human-readable explanations of METAR and TAF codes
                    </pre>
                  </div>
                ) : decodedError ? (
                  <Alert className="bg-red-500/20 border-red-400/50 text-red-100">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-100">
                      {decodedError}
                    </AlertDescription>
                  </Alert>
                ) : decodedHtml ? (
                  <div 
                    className="text-orange-400 font-mono text-sm flex-1"
                    dangerouslySetInnerHTML={{ __html: decodedHtml }}
                  />
                ) : !isLoadingDecoded ? (
                  <div className="flex-1 flex items-center justify-center">
                    <pre className="whitespace-pre-wrap font-mono text-center">
                      Decoded weather will appear here automatically
                      
                      This shows detailed interpretations of METAR and TAF codes
                    </pre>
                  </div>
                ) : null}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="raw" className="mt-0 border-0 p-0">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CloudRain className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Raw Weather Data</h3>
              {hasWeatherData && (
                <Badge variant="outline" className="text-xs bg-orange-400/20 border-orange-400/50 text-orange-200">
                  Live Data
                </Badge>
              )}
            </div>
            <ScrollArea className="h-[400px] w-full [&>[data-radix-scroll-area-viewport]]:scrollbar-thin [&>[data-radix-scroll-area-viewport]]:scrollbar-track-black [&>[data-radix-scroll-area-viewport]]:scrollbar-thumb-orange-400/50 [&>[data-radix-scroll-area-viewport]]:scrollbar-thumb-rounded">
              <div className="bg-black/90 text-orange-400 p-4 rounded-xl avionics-display h-full min-h-[400px] flex flex-col"
                style={{
                  fontFamily: 'Monaco, "Courier New", monospace',
                  textShadow: '0 0 8px rgba(255, 165, 0, 0.6)',
                  letterSpacing: '0.5px',
                  lineHeight: '1.4',
                  fontSize: '13px'
                }}>
                <pre className="whitespace-pre-wrap break-words overflow-wrap-anywhere flex-1">
                  {getDisplayContent('raw', isLoading, error, weatherData, icaoCode)}
                </pre>
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="airport" className="mt-0 border-0 p-0">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Plane className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Airport Information</h3>
              {hasAirportData && (
                <Badge variant="outline" className="text-xs bg-orange-400/20 border-orange-400/50 text-orange-200">
                  Live Data
                </Badge>
              )}
            </div>
            <ScrollArea className="h-[400px] w-full [&>[data-radix-scroll-area-viewport]]:scrollbar-thin [&>[data-radix-scroll-area-viewport]]:scrollbar-track-black [&>[data-radix-scroll-area-viewport]]:scrollbar-thumb-orange-400/50 [&>[data-radix-scroll-area-viewport]]:scrollbar-thumb-rounded">
              <div className="bg-black/90 text-orange-400 p-4 rounded-xl avionics-display h-full min-h-[400px] flex flex-col"
                style={{
                  fontFamily: 'Monaco, "Courier New", monospace',
                  textShadow: '0 0 8px rgba(255, 165, 0, 0.6)',
                  letterSpacing: '0.5px',
                  lineHeight: '1.4',
                  fontSize: '13px'
                }}>
                <pre className="whitespace-pre-wrap break-words overflow-wrap-anywhere flex-1">
                  {getDisplayContent('airport', isLoading, error, weatherData, icaoCode)}
                </pre>
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="notam" className="mt-0 border-0 p-0">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">NOTAMs</h3>
              {hasNotamData && (
                <Badge variant="outline" className="text-xs bg-orange-400/20 border-orange-400/50 text-orange-200">
                  Live Data
                </Badge>
              )}
            </div>
            <ScrollArea className="h-[400px] w-full [&>[data-radix-scroll-area-viewport]]:scrollbar-thin [&>[data-radix-scroll-area-viewport]]:scrollbar-track-black [&>[data-radix-scroll-area-viewport]]:scrollbar-thumb-orange-400/50 [&>[data-radix-scroll-area-viewport]]:scrollbar-thumb-rounded">
              <div className="bg-black/90 text-orange-400 p-4 rounded-xl avionics-display h-full min-h-[400px] flex flex-col"
                style={{
                  fontFamily: 'Monaco, "Courier New", monospace',
                  textShadow: '0 0 8px rgba(255, 165, 0, 0.6)',
                  letterSpacing: '0.5px',
                  lineHeight: '1.4',
                  fontSize: '13px'
                }}>
                <pre className="whitespace-pre-wrap break-words overflow-wrap-anywhere flex-1">
                  {getDisplayContent('notam', isLoading, error, weatherData, icaoCode)}
                </pre>
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileWeatherTabs;
