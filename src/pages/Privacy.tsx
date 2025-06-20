
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Button>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          <div className="text-slate-200 space-y-4">
            <p className="text-sm text-slate-300">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold text-white mt-6">Information We Collect</h2>
            <p>METAR Now collects minimal information to provide aviation weather services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Airport codes you search for</li>
              <li>Favorite airports you save (stored locally)</li>
              <li>Recent search history (stored locally)</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-6">How We Use Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide real-time aviation weather data</li>
              <li>Improve user experience with saved favorites</li>
              <li>Maintain search history for convenience</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-6">Data Sources</h2>
            <p>Weather data is sourced from:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Aviation Weather Center (AWC) - NOAA</li>
              <li>CheckWX API for real-time METAR/TAF</li>
              <li>Federal Aviation Administration (FAA) for NOTAMs</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-6">Data Storage</h2>
            <p>Your personal data (favorites, recent searches) is stored locally on your device. We do not store personal information on our servers.</p>

            <h2 className="text-xl font-semibold text-white mt-6">Third-Party Services</h2>
            <p>We use third-party services to provide weather data. These services may have their own privacy policies.</p>

            <h2 className="text-xl font-semibold text-white mt-6">Contact</h2>
            <p>For privacy-related questions, contact us at: support@h0ss310s.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
