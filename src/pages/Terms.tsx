
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
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
          <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
          <div className="text-slate-200 space-y-4">
            <p className="text-sm text-slate-300">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold text-white mt-6">Acceptance of Terms</h2>
            <p>By using METAR Now, you agree to these terms of service. If you do not agree, please do not use the application.</p>

            <h2 className="text-xl font-semibold text-white mt-6">Service Description</h2>
            <p>METAR Now provides real-time aviation weather information including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>METAR (Meteorological Aerodrome Reports)</li>
              <li>TAF (Terminal Aerodrome Forecasts)</li>
              <li>NOTAMs (Notice to Airmen)</li>
              <li>Airport information</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-6">Aviation Safety Disclaimer</h2>
            <p className="text-yellow-300 font-semibold">IMPORTANT: This application is for informational purposes only. Do not use as the sole source for flight planning or aviation decision-making. Always consult official aviation weather sources and follow proper aviation procedures.</p>

            <h2 className="text-xl font-semibold text-white mt-6">Data Accuracy</h2>
            <p>While we strive to provide accurate data, we cannot guarantee the completeness or accuracy of weather information. Data is sourced from third-party providers and may contain errors or delays.</p>

            <h2 className="text-xl font-semibold text-white mt-6">Acceptable Use</h2>
            <p>You agree to use METAR Now only for lawful purposes and in accordance with aviation regulations in your jurisdiction.</p>

            <h2 className="text-xl font-semibold text-white mt-6">Limitation of Liability</h2>
            <p>METAR Now and its developers are not liable for any damages arising from the use of this application or reliance on the weather data provided.</p>

            <h2 className="text-xl font-semibold text-white mt-6">Changes to Terms</h2>
            <p>We may update these terms periodically. Continued use of the application constitutes acceptance of updated terms.</p>

            <h2 className="text-xl font-semibold text-white mt-6">Contact</h2>
            <p>For questions about these terms, contact us at: support@h0ss310s.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
