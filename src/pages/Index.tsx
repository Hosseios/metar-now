
import MetarSearch from "@/components/MetarSearch";
import MetarDisplay from "@/components/MetarDisplay";
import FavoritesManager from "@/components/FavoritesManager";
import { useMetarData } from "@/hooks/useMetarData";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Index = () => {
  const [icaoCode, setIcaoCode] = useState("");
  const {
    metarData,
    isLoading,
    error,
    fetchMetar
  } = useMetarData();
  const {
    loading: authLoading
  } = useAuth();

  const handleSearch = (code: string) => {
    setIcaoCode(code);
    fetchMetar(code);
  };

  if (authLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>;
  }

  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Banner Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url('/lovable-uploads/a24c1d1e-db26-4943-baf9-119712ba820f.png')`
      }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        
        {/* Header with Logo */}
        <div className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img src="/lovable-uploads/a0ba6b63-c16c-41d4-b45a-2ace5ac4b0b5.png" alt="Logo" className="w-16 h-16 rounded-full shadow-xl ring-4 ring-white/30 backdrop-blur-sm" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-400/20"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">METAR Weather Viewer</h1>
              <p className="text-slate-200 drop-shadow">Get weather data fast and simple</p>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 px-6">
            <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">Get Weather Fast</h2>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto drop-shadow-lg">
              Quick access to real-time METAR weather reports for airports worldwide. 
              Simple, fast, and reliable.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 pt-8">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          {/* Search Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <MetarSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Result Display */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <MetarDisplay metarData={metarData} isLoading={isLoading} error={error} icaoCode={icaoCode} />
          </div>

          {/* Favorites Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-12">
            <FavoritesManager currentIcao={icaoCode} onSelectFavorite={handleSearch} />
          </div>
        </div>
      </div>
    </div>;
};

export default Index;
