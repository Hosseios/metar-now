
import { useState, useCallback } from "react";
import MetarSearch from "@/components/MetarSearch";
import FavoritesManager from "@/components/FavoritesManager";
import RecentSearches from "@/components/RecentSearches";
import BottomNavigation from "@/components/BottomNavigation";
import { useMetarData } from "@/hooks/useMetarData";
import { useAuth } from "@/contexts/AuthContext";
import { CloudRain, CloudLightning, Plane, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";

const MobileIndex = () => {
  const [icaoCode, setIcaoCode] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [weatherTab, setWeatherTab] = useState("metar");
  const {
    weatherData,
    isLoading,
    error,
    fetchWeatherData
  } = useMetarData();
  const { loading: authLoading } = useAuth();

  const weatherTabs = ["metar", "taf", "airport", "notam"];
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", skipSnaps: false });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selectedIndex = emblaApi.selectedScrollSnap();
    setWeatherTab(weatherTabs[selectedIndex]);
  }, [emblaApi]);

  const handleTabChange = useCallback((value: string) => {
    setWeatherTab(value);
    const index = weatherTabs.indexOf(value);
    if (emblaApi && index !== -1) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi]);

  // Set up embla carousel listeners
  useState(() => {
    if (emblaApi) {
      emblaApi.on("select", onSelect);
      return () => emblaApi.off("select", onSelect);
    }
  });

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

  const getDisplayContent = (type: 'metar' | 'taf' | 'airport' | 'notam') => {
    if (isLoading) {
      return `Fetching ${type.toUpperCase()} data for ${icaoCode}...\n\nPlease wait while we retrieve the latest information.`;
    }
    
    if (error) {
      return `Unable to connect to weather services for ${icaoCode}\n\nPlease check your internet connection and try again.`;
    }
    
    if (weatherData && weatherData[type]) {
      const data = weatherData[type];
      
      if (data.includes('Error fetching') || (data.includes('No ') && (data.includes(' data available') || data.includes('current NOTAMs')))) {
        if (type === 'metar') {
          return `No current weather report available for ${icaoCode}\n\nThis airport may not provide real-time weather updates, or the data is temporarily unavailable.`;
        } else if (type === 'taf') {
          return `No weather forecast available for ${icaoCode}\n\nThis airport may not issue forecasts, or the forecast data is temporarily unavailable.`;
        } else if (type === 'airport') {
          return `No airport information available for ${icaoCode}\n\nThe airport database may not have details for this facility, or the information is temporarily unavailable.`;
        } else if (type === 'notam') {
          return `No current NOTAMs for ${icaoCode}\n\nThis means there are no active Notices to Airmen for this airport at this time.`;
        }
      }
      
      return data;
    }
    
    if (type === 'metar') {
      return "Enter an ICAO code to view real-time weather conditions\n\nMETAR provides current weather observations from airports worldwide.";
    } else if (type === 'taf') {
      return "Enter an ICAO code to view weather forecasts\n\nTAF provides detailed weather forecasts for airports.";
    } else if (type === 'airport') {
      return "Enter an ICAO code to view airport information\n\nAirport data includes facility details and operational status.";
    } else if (type === 'notam') {
      return "Enter an ICAO code to view NOTAMs\n\nNOTAMs provide critical information about airport conditions.";
    }
  };

  const renderWeatherDisplay = (type: 'metar' | 'taf' | 'airport' | 'notam') => {
    const icons = {
      metar: CloudRain,
      taf: CloudLightning,
      airport: Plane,
      notam: Bell
    };
    
    const titles = {
      metar: "Current Weather (METAR)",
      taf: "Forecast (TAF)",
      airport: "Airport Information",
      notam: "NOTAMs"
    };

    const hasData = {
      metar: hasMetarData,
      taf: hasTafData,
      airport: hasAirportData,
      notam: hasNotamData
    };

    const Icon = icons[type];

    return (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">{titles[type]}</h3>
          {hasData[type] && (
            <Badge variant="outline" className="text-xs bg-orange-400/20 border-orange-400/50 text-orange-200">
              Live Data
            </Badge>
          )}
        </div>
        <ScrollArea className="h-[400px] w-full">
          <div className="bg-black/90 text-orange-400 p-4 rounded-xl avionics-display"
            style={{
              fontFamily: 'Monaco, "Courier New", monospace',
              textShadow: '0 0 8px rgba(255, 165, 0, 0.6)',
              letterSpacing: '0.5px',
              lineHeight: '1.4',
              fontSize: '13px'
            }}>
            <pre className="whitespace-pre-wrap break-words overflow-wrap-anywhere">{getDisplayContent(type)}</pre>
          </div>
        </ScrollArea>
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative">
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
        <div className="flex-1 p-4 space-y-4 pb-24 bg-slate-900/20" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))' }}>
          {activeTab === 'search' && (
            <>
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
                <MetarSearch onSearch={handleSearch} isLoading={isLoading} />
              </div>

              {weatherData && (
                <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                  {/* Tab Headers */}
                  <div className="grid grid-cols-4 bg-slate-900/60 h-12">
                    <button 
                      onClick={() => handleTabChange("metar")}
                      className={`flex items-center justify-center gap-1 text-xs transition-colors relative ${
                        weatherTab === 'metar' 
                          ? 'bg-cyan-500/20 text-cyan-200' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <CloudRain className="w-4 h-4" />
                      METAR
                      {hasMetarData && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full shadow-sm shadow-orange-400/50"></div>
                      )}
                    </button>
                    <button 
                      onClick={() => handleTabChange("taf")}
                      className={`flex items-center justify-center gap-1 text-xs transition-colors relative ${
                        weatherTab === 'taf' 
                          ? 'bg-cyan-500/20 text-cyan-200' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <CloudLightning className="w-4 h-4" />
                      TAF
                      {hasTafData && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full shadow-sm shadow-orange-400/50"></div>
                      )}
                    </button>
                    <button 
                      onClick={() => handleTabChange("airport")}
                      className={`flex items-center justify-center gap-1 text-xs transition-colors relative ${
                        weatherTab === 'airport' 
                          ? 'bg-cyan-500/20 text-cyan-200' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Plane className="w-4 h-4" />
                      Airport
                      {hasAirportData && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full shadow-sm shadow-orange-400/50"></div>
                      )}
                    </button>
                    <button 
                      onClick={() => handleTabChange("notam")}
                      className={`flex items-center justify-center gap-1 text-xs transition-colors relative ${
                        weatherTab === 'notam' 
                          ? 'bg-cyan-500/20 text-cyan-200' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                      NOTAM
                      {hasNotamData && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full shadow-sm shadow-orange-400/50"></div>
                      )}
                    </button>
                  </div>
                  
                  {/* Swipeable Content */}
                  <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                      {weatherTabs.map((tab) => (
                        <div key={tab} className="min-w-0 flex-[0_0_100%]">
                          {renderWeatherDisplay(tab as 'metar' | 'taf' | 'airport' | 'notam')}
                        </div>
                      ))}
                    </div>
                  </div>
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
                  <p className="text-slate-300 text-sm">Real-time aviation weather data for pilots and aviation enthusiasts.</p>
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

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MobileIndex;
