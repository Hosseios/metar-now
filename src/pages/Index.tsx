
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

  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Compact Hero Banner Section */}
      <div className="relative h-32 md:h-40 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url('/lovable-uploads/a24c1d1e-db26-4943-baf9-119712ba820f.png')`
      }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        
        {/* Compact Header with Logo */}
        <div className="relative z-10 flex items-center justify-between p-3 md:p-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="relative">
              <img src="/lovable-uploads/a0ba6b63-c16c-41d4-b45a-2ace5ac4b0b5.png" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-xl ring-2 ring-white/30 backdrop-blur-sm" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-400/20"></div>
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-white drop-shadow-lg">METAR Weather Viewer</h1>
              <p className="text-xs md:text-sm text-slate-200 drop-shadow hidden sm:block">Get weather data fast and simple</p>
            </div>
          </div>
        </div>

        {/* Compact Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-1 md:space-y-2 px-3">
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-2xl">Get Weather Fast</h2>
            <p className="text-sm md:text-base text-slate-200 max-w-lg mx-auto drop-shadow-lg hidden sm:block">
              Quick access to real-time METAR weather reports for airports worldwide.
            </p>
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
    </div>;
};

export default Index;
