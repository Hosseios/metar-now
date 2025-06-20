
import React from "react";
import { Bell, Info, Mail, Globe, Database, Shield, FileText } from "lucide-react";

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

        {/* Privacy & Terms Section */}
        <div className="p-4 bg-slate-900/40 rounded-xl">
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="w-5 h-5 text-amber-400" />
            <p className="text-white font-medium">Privacy & Terms</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <a 
                href="https://h0ss310s.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                Privacy Policy
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <a 
                href="https://h0ss310s.com/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                Terms of Service
              </a>
            </div>
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
              <Mail className="w-4 h-4 text-slate-400" />
              <a 
                href="mailto:support@h0ss310.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                support@h0ss310.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSettings;
