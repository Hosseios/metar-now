
import React from "react";
import { Bell } from "lucide-react";

const MobileSettings = () => {
  return (
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
  );
};

export default MobileSettings;
