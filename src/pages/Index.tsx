
import MetarSearch from "@/components/MetarSearch";
import MetarDisplay from "@/components/MetarDisplay";
import FavoritesManager from "@/components/FavoritesManager";
import { useMetarData } from "@/hooks/useMetarData";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Index = () => {
  const [icaoCode, setIcaoCode] = useState("");
  const {
    weatherData,
    isLoading,
    error,
    fetchWeatherData
  } = useMetarData();
  const {
    loading: authLoading
  } = useAuth();

  const handleSearch = (code: string) => {
    setIcaoCode(code);
    fetchWeatherData(code);
  };

  if (authLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>;
  }

  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Large Background Banner */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url('/lovable-uploads/a24c1d1e-db26-4943-baf9-119712ba820f.png')`
      }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        
        {/* Smooth fade transition starting from middle */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with Logo - Added safe-area padding for mobile */}
        <div className="flex items-center justify-between p-4 md:p-6 pt-8 md:pt-6" style={{ paddingTop: 'max(2rem, env(safe-area-inset-top, 2rem))' }}>
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="relative">
              <img src="/lovable-uploads/2750b808-8ab0-485e-95b6-fd3cbf9517e2.png" alt="METAR Now Logo" className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">Aviation METAR Weather Viewer</h1>
              <p className="text-sm md:text-base text-slate-200 drop-shadow">Get real-time METAR & TAF reports with ease.</p>
            </div>
          </div>
        </div>

        {/* Main Content - Flex-grow to fill remaining space */}
        <div className="flex-1 flex flex-col p-3 md:p-6 space-y-3 md:space-y-4 max-w-6xl mx-auto w-full">
          {/* Search Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 shadow-2xl">
            <MetarSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Two-column layout on larger screens */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {/* Result Display */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 shadow-2xl">
              <MetarDisplay weatherData={weatherData} isLoading={isLoading} error={error} icaoCode={icaoCode} />
            </div>

            {/* Favorites Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 shadow-2xl">
              <FavoritesManager currentIcao={icaoCode} onSelectFavorite={handleSearch} />
            </div>
          </div>
        </div>
      </div>
    </div>;
};

export default Index;
