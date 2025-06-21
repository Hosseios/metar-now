import MetarSearch from "@/components/MetarSearch";
import MetarDisplay from "@/components/MetarDisplay";
import FavoritesManager from "@/components/FavoritesManager";
import MobileIndex from "@/pages/MobileIndex";
import DeviceInfo from "@/components/DeviceInfo";
import { useMetarData } from "@/hooks/useMetarData";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info, Database, Globe, Mail, Github, Shield, FileText } from "lucide-react";
import { Link } from "react-router-dom";
const Index = () => {
  const [icaoCode, setIcaoCode] = useState("");
  const [showDeviceInfo, setShowDeviceInfo] = useState(false);
  const {
    weatherData,
    isLoading,
    error,
    fetchWeatherData
  } = useMetarData();
  const {
    loading: authLoading
  } = useAuth();
  const isMobile = useIsMobile();
  const handleSearch = (code: string) => {
    setIcaoCode(code);
    fetchWeatherData(code);
  };

  // Use mobile-optimized layout for mobile phones and tablets
  if (isMobile) {
    return <MobileIndex />;
  }
  if (authLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative flex flex-col">
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
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header with Logo - Added safe-area padding for mobile */}
        <div className="flex items-center justify-between p-4 md:p-6 pt-8 md:pt-6" style={{
        paddingTop: 'max(2rem, env(safe-area-inset-top, 2rem))'
      }}>
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="relative">
              <img src="/lovable-uploads/2750b808-8ab0-485e-95b6-fd3cbf9517e2.png" alt="METAR Now Logo" className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">Aviation METAR Data Viewer</h1>
              <p className="text-sm md:text-base text-slate-200 drop-shadow">Get real-time METAR, TAF & NOTAM reports with ease.</p>
            </div>
          </div>
          
          {/* About Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Info className="w-4 h-4 mr-2" />
                About
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-800 border-slate-600 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">About METAR Now</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* About Section */}
                <div className="p-4 bg-slate-900/40 rounded-xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <Info className="w-5 h-5 text-blue-400" />
                    <p className="text-white font-medium">About METAR Now</p>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">
                    Real-time aviation data for pilots and aviation enthusiasts. Get instant access to METAR, TAF, airport information, and NOTAMs worldwide.
                  </p>
                  <div className="border-t border-slate-700 pt-3 mt-3">
                    <p className="text-slate-400 text-xs">Version 1.0.0</p>
                  </div>
                </div>

                {/* Data Sources */}
                <div className="p-4 bg-slate-900/40 rounded-xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <Database className="w-5 h-5 text-green-400" />
                    <p className="text-white font-medium">Data Sources & Credits</p>
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div>
                      <p className="font-medium text-slate-200">Aviation Data:</p>
                      <p>• Aviation Weather Center (AWC) - NOAA</p>
                      <p>• CheckWX API for real-time METAR/TAF</p>
                    </div>
                    <div className="mt-2">
                      <p className="font-medium text-slate-200">NOTAMs:</p>
                      <p>• Federal Aviation Administration (FAA)</p>
                    </div>
                    <div className="mt-2">
                      <p className="font-medium text-slate-200">Airport Data:</p>
                      <p>• Global airport database</p>
                    </div>
                  </div>
                </div>

                {/* Developer Info */}
                <div className="p-4 bg-slate-900/40 rounded-xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <p className="text-white font-medium">Developer</p>
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>
                      <span className="font-medium text-slate-200">Created by:</span> h0ss310s
                    </p>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <a href="https://h0ss310s.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">h0ss310s.com</a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Github className="w-4 h-4 text-slate-400" />
                      <a href="https://github.com/hosseios" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                        github.com/hosseios
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href="mailto:support@h0ss310s.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                        support@h0ss310s.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Debug toggle for device info - HIDDEN */}
          {/* 
           <button
            onClick={() => setShowDeviceInfo(!showDeviceInfo)}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            title="Toggle device info"
           >
            Device Info
           </button>
           */}
        </div>

        {/* Device Info Debug Panel */}
        {showDeviceInfo && <div className="mx-4 md:mx-6 mb-4 bg-slate-800/90 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <h3 className="text-white font-semibold mb-2">Device Detection Debug</h3>
            <DeviceInfo />
          </div>}

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

        {/* Footer with Privacy and Terms */}
        <div className="relative z-10 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <div className="text-slate-300 text-sm">© 2024 METAR Now - Aviation METAR Data Viewer</div>
                <div className="flex items-center space-x-4 text-sm">
                  <Link to="/privacy" className="text-slate-300 hover:text-white transition-colors flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Privacy Policy</span>
                  </Link>
                  <Link to="/terms" className="text-slate-300 hover:text-white transition-colors flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>Terms of Service</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;