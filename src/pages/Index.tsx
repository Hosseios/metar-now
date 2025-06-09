
import MetarSearch from "@/components/MetarSearch";
import MetarDisplay from "@/components/MetarDisplay";
import FavoritesManager from "@/components/FavoritesManager";
import { useMetarData } from "@/hooks/useMetarData";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Cloud, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [icaoCode, setIcaoCode] = useState("");
  const {
    weatherData,
    isLoading,
    error,
    fetchWeatherData
  } = useMetarData();
  const {
    loading: authLoading,
    user,
    signOut
  } = useAuth();

  const handleSearch = (code: string) => {
    setIcaoCode(code);
    fetchWeatherData(code);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-slate-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">METAR Weather</h1>
                <p className="text-xs text-slate-500">Real-time aviation weather</p>
              </div>
            </div>

            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Aviation Weather Reports
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get real-time METAR weather data for airports worldwide. Enter an ICAO code to view current conditions.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <MetarSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>

        {/* Results and Favorites Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather Results - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Cloud className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900">Weather Report</h3>
              </div>
              <MetarDisplay 
                weatherData={weatherData} 
                isLoading={isLoading} 
                error={error} 
                icaoCode={icaoCode} 
              />
            </div>
          </div>

          {/* Favorites - Takes up 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900">Quick Access</h3>
              </div>
              <FavoritesManager 
                currentIcao={icaoCode} 
                onSelectFavorite={handleSearch} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
