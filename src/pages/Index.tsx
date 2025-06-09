
import MetarSearch from "@/components/MetarSearch";
import MetarDisplay from "@/components/MetarDisplay";
import FavoritesManager from "@/components/FavoritesManager";
import { useMetarData } from "@/hooks/useMetarData";
import { useState } from "react";

const Index = () => {
  const [icaoCode, setIcaoCode] = useState("");
  const { metarData, isLoading, error, fetchMetar } = useMetarData();

  const handleSearch = (code: string) => {
    setIcaoCode(code);
    fetchMetar(code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">METAR Weather Viewer</h1>
          <p className="text-slate-400">Real-time aviation weather reports</p>
        </div>

        {/* Search Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
          <MetarSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Result Display */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
          <MetarDisplay 
            metarData={metarData} 
            isLoading={isLoading} 
            error={error}
            icaoCode={icaoCode}
          />
        </div>

        {/* Favorites Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
          <FavoritesManager 
            currentIcao={icaoCode} 
            onSelectFavorite={handleSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
