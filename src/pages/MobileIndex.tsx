
import { useState } from "react";
import MetarSearch from "@/components/MetarSearch";
import FavoritesManager from "@/components/FavoritesManager";
import RecentSearches from "@/components/RecentSearches";
import MobileWeatherCard from "@/components/MobileWeatherCard";
import BottomNavigation from "@/components/BottomNavigation";
import { useMetarData } from "@/hooks/useMetarData";
import { useAuth } from "@/contexts/AuthContext";
import { CloudRain, CloudLightning, Plane, Bell } from "lucide-react";

const MobileIndex = () => {
  const [icaoCode, setIcaoCode] = useState("");
  const [activeTab, setActiveTab] = useState("search");
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-8 bg-slate-900/50 backdrop-blur-sm" style={{ paddingTop: 'max(2rem, env(safe-area-inset-top, 2rem))' }}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src="/lovable-uploads/2750b808-8ab0-485e-95b6-fd3cbf9517e2.png" alt="METAR Now Logo" className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white drop-shadow-lg">METAR Now</h1>
              <p className="text-sm text-slate-200 drop-shadow">Aviation Weather</p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 space-y-4 pb-24 bg-slate-900/20">
          {activeTab === 'search' && (
            <>
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
                <MetarSearch onSearch={handleSearch} isLoading={isLoading} />
              </div>

              {weatherData && (
                <div className="space-y-4">
                  <MobileWeatherCard
                    type="metar"
                    title="METAR"
                    data={getDisplayContent('metar')}
                    hasData={hasMetarData}
                    icon={CloudRain}
                  />
                  <MobileWeatherCard
                    type="taf"
                    title="TAF"
                    data={getDisplayContent('taf')}
                    hasData={hasTafData}
                    icon={CloudLightning}
                  />
                  <MobileWeatherCard
                    type="airport"
                    title="Airport Info"
                    data={getDisplayContent('airport')}
                    hasData={hasAirportData}
                    icon={Plane}
                  />
                  <MobileWeatherCard
                    type="notam"
                    title="NOTAM"
                    data={getDisplayContent('notam')}
                    hasData={hasNotamData}
                    icon={Bell}
                  />
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
