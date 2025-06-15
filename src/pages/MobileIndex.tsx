
import React, { useState } from "react";
import MetarSearch from "@/components/MetarSearch";
import FavoritesManager from "@/components/FavoritesManager";
import RecentSearches from "@/components/RecentSearches";
import BottomNavigation from "@/components/BottomNavigation";
import MobileWeatherTabs from "@/components/MobileWeatherTabs";
import MobileLayout from "@/components/MobileLayout";
import MobileSettings from "@/components/MobileSettings";
import RetroRadar from "@/components/RetroRadar";
import { useMetarData } from "@/hooks/useMetarData";
import { useAuth } from "@/contexts/AuthContext";

const MobileIndex = () => {
  const [icaoCode, setIcaoCode] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [weatherTab, setWeatherTab] = useState("decoded");
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <MobileLayout>
      {/* Tab Content */}
      <div className="flex-1 p-4 space-y-4 pb-24 bg-slate-900/20 overflow-y-auto" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))', paddingBottom: '90px' }}>
        {activeTab === 'search' && (
          <>
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
              <MetarSearch onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Show radar when loading */}
            {isLoading && (
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <RetroRadar isActive={true} />
                  <div className="text-orange-400 font-mono text-sm text-center">
                    <div>Fetching weather data...</div>
                    <div className="text-xs text-orange-300 mt-1">Please wait</div>
                  </div>
                </div>
              </div>
            )}

            {weatherData && (
              <MobileWeatherTabs
                weatherTab={weatherTab}
                setWeatherTab={setWeatherTab}
                weatherData={weatherData}
                isLoading={isLoading}
                error={error}
                icaoCode={icaoCode}
              />
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

        {activeTab === 'settings' && <MobileSettings />}
      </div>

      {/* Bottom Navigation - Fixed positioning */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </MobileLayout>
  );
};

export default MobileIndex;
