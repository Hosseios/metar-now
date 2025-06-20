
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
          <div className="text-slate-200 space-y-6">
            <p className="text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">What We Collect</h2>
              <p className="mb-2">METAR Now respects your privacy. We only collect:</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-300">
                <li>Airport codes you search (stored locally on your device)</li>
                <li>Your favorite airports (stored locally on your device)</li>
                <li>Recent searches for convenience (stored locally on your device)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">How We Use Your Data</h2>
              <p className="text-slate-300">Your data stays on your device. We use it to provide personalized aviation weather services and improve your experience with saved favorites and search history.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Weather Data Sources</h2>
              <ul className="list-disc pl-6 space-y-1 text-slate-300">
                <li>NOAA Aviation Weather Center (AWC)</li>
                <li>CheckWX API for real-time METAR/TAF data</li>
                <li>FAA for NOTAMs and airport information</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Your Privacy Rights</h2>
              <p className="text-slate-300">Since all personal data is stored locally on your device, you have complete control. Clear your browser data or app storage to remove all information.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
              <p className="text-slate-300">We integrate with aviation weather APIs to provide real-time data. These services have their own privacy policies and may collect anonymous usage statistics.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
              <p className="text-slate-300">Questions about privacy? Reach out to us at: <span className="text-blue-400">support@h0ss310s.com</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
