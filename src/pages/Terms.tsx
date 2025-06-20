
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
          <div className="text-slate-200 space-y-6">
            <p className="text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Agreement</h2>
              <p className="text-slate-300">By using METAR Now, you agree to these terms. Simple as that.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">What We Provide</h2>
              <p className="mb-2 text-slate-300">Real-time aviation weather information including:</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-300">
                <li>METAR reports and TAF forecasts</li>
                <li>NOTAMs and airport information</li>
                <li>Weather data visualization</li>
                <li>Favorites and search history</li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-amber-300 mb-3">⚠️ Aviation Safety Notice</h2>
              <p className="text-amber-200 font-medium">This app is for reference only. Never use it as your sole source for flight planning or critical aviation decisions. Always consult official sources and follow proper aviation procedures.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Data Accuracy</h2>
              <p className="text-slate-300">We source data from reliable aviation authorities, but weather can change rapidly. Data may contain delays or errors. Always verify with official sources.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Acceptable Use</h2>
              <p className="text-slate-300">Use METAR Now responsibly and in compliance with aviation regulations in your area. Don't misuse the service or attempt to harm our infrastructure.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Limitations</h2>
              <p className="text-slate-300">METAR Now is provided "as is." We're not liable for any issues arising from your use of weather data or the app. Use your best judgment and follow aviation best practices.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Updates</h2>
              <p className="text-slate-300">We may update these terms occasionally. Continued use means you accept any changes.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Questions?</h2>
              <p className="text-slate-300">Contact us at: <span className="text-blue-400">support@h0ss310s.com</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
