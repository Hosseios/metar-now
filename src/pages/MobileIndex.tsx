
import React, { useState } from "react";
import MetarSearch from "@/components/MetarSearch";
import FavoritesManager from "@/components/FavoritesManager";
import RecentSearches from "@/components/RecentSearches";
import BottomNavigation from "@/components/BottomNavigation";
import { useMetarData } from "@/hooks/useMetarData";
import { useAuth } from "@/contexts/AuthContext";
import { CloudRain, CloudLightning, Plane, Bell, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const MobileIndex = () => {
  const [icaoCode, setIcaoCode] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [weatherTab, setWeatherTab] = useState("decoded");
  const [decodedHtml, setDecodedHtml] = useState<string>("");
  const [isLoadingDecoded, setIsLoadingDecoded] = useState(false);
  const [decodedError, setDecodedError] = useState<string | null>(null);
  const {
    weatherData,
    isLoading,
    error,
    fetchWeatherData
  } = useMetarData();
  const { loading: authLoading } = useAuth();

  const handleSearch = (code: string) => {
    setIcaoCode(code);
    fetchWeatherData(code);
    setActiveTab("search");
    // Add to recent searches
    if ((window as any).addRecentSearch) {
      (window as any).addRecentSearch(code);
    }
  };

  const isDataAvailable = (data: string) => {
    if (!data || data.trim() === '') return false;
    if (data.includes('Error fetching')) return false;
    if (data.includes('No ') && (data.includes(' data available') || data.includes('current NOTAMs'))) return false;
    return true;
  };

  const hasMetarData = weatherData ? isDataAvailable(weatherData.metar) : false;
  const hasTafData = weatherData ? isDataAvailable(weatherData.taf) : false;
  const hasAirportData = weatherData ? isDataAvailable(weatherData.airport) : false;
  const hasNotamData = weatherData ? isDataAvailable(weatherData.notam) : false;
  const hasWeatherData = hasMetarData || hasTafData;

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

  // Auto-fetch decoded weather when ICAO code changes or when decoded tab becomes active
  React.useEffect(() => {
    if (icaoCode && weatherTab === "decoded") {
      fetchDecodedWeather();
    }
  }, [icaoCode, weatherTab]);

  const getDisplayContent = (type: 'raw' | 'airport' | 'notam') => {
    if (isLoading) {
      return `Fetching ${type.toUpperCase()} data for ${icaoCode}...\n\nPlease wait while we retrieve the latest information.`;
    }
    
    if (error) {
      return `Unable to connect to weather services for ${icaoCode}\n\nPlease check your internet connection and try again.`;
    }
    
    if (type === 'raw' && weatherData) {
      const metarContent = weatherData.metar || '';
      const tafContent = weatherData.taf || '';
      
      let combinedContent = '';
      
      if (isDataAvailable(metarContent)) {
        combinedContent += `=== CURRENT WEATHER (METAR) ===\n\n${metarContent}\n\n`;
      } else {
        combinedContent += `=== CURRENT WEATHER (METAR) ===\n\nNo current weather report available for ${icaoCode}\n\nThis airport may not provide real-time weather updates, or the data is temporarily unavailable.\n\n`;
      }
      
      if (isDataAvailable(tafContent)) {
        combinedContent += `=== FORECAST (TAF) ===\n\n${tafContent}`;
      } else {
        combinedContent += `=== FORECAST (TAF) ===\n\nNo weather forecast available for ${icaoCode}\n\nThis airport may not issue forecasts, or the forecast data is temporarily unavailable.`;
      }
      
      return combinedContent;
    }
    
    if (weatherData && weatherData[type === 'raw' ? 'metar' : type]) {
      const data = weatherData[type === 'raw' ? 'metar' : type];
      
      if (data.includes('Error fetching') || (data.includes('No ') && (data.includes(' data available') || data.includes('current NOTAMs')))) {
        if (type === 'airport') {
          return `No airport information available for ${icaoCode}\n\nThe airport database may not have details for this facility, or the information is temporarily unavailable.`;
        } else if (type === 'notam') {
          return `No current NOTAMs for ${icaoCode}\n\nThis means there are no active Notices to Airmen for this airport at this time.`;
        }
      }
      
      return data;
    }
    
    if (type === 'raw') {
      return "Enter an ICAO code to view weather conditions and forecasts\n\nMETAR provides current weather observations and TAF provides detailed forecasts for airports worldwide.";
    } else if (type === 'airport') {
      return "Enter an ICAO code to view airport information\n\nAirport data includes facility details and operational status.";
    } else if (type === 'notam') {
      return "Enter an ICAO code to view NOTAMs\n\nNOTAMs provide critical information about airport conditions.";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: `url('/lovable-uploads/a24c1d1e-db26-4943-baf9-119712ba820f.png')`
        }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90" />
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen bg-slate-900/20">
        {/* Tab Content */}
        <div className="flex-1 p-4 space-y-4 pb-24 bg-slate-900/20 overflow-y-auto" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))', paddingBottom: '90px' }}>
          {activeTab === 'search' && (
            <>
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
                <MetarSearch onSearch={handleSearch} isLoading={isLoading} />
              </div>

              {weatherData && (
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
                            <pre className="whitespace-pre-wrap break-words overflow-wrap-anywhere flex-1">{getDisplayContent('raw')}</pre>
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
                            <pre className="whitespace-pre-wrap break-words overflow-wrap-anywhere flex-1">{getDisplayContent('airport')}</pre>
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
                            <pre className="whitespace-pre-wrap break-words overflow-wrap-anywhere flex-1">{getDisplayContent('notam')}</pre>
                          </div>
                        </ScrollArea>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </>
          )}

          {activeTab === 'favorites' && (
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
              <FavoritesManager currentIcao={icaoCode} onSelectFavorite={handleSearch} />
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
              <RecentSearches onSelectRecent={handleSearch} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-gray-500 to-slate-500 rounded-2xl shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Settings</h2>
                  <p className="text-slate-300">App preferences and configuration</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/40 rounded-xl">
                  <p className="text-white font-medium mb-2">About METAR Now</p>
                  <p className="text-slate-300">Real-time aviation weather data for pilots and aviation enthusiasts.</p>
                </div>
                <div className="p-4 bg-slate-900/40 rounded-xl">
                  <p className="text-white font-medium mb-2">Data Sources</p>
                  <p className="text-slate-300 text-sm">Weather data provided by Aviation Weather Center and CheckWX API.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Fixed positioning */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default MobileIndex;
