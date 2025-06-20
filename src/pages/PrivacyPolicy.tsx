
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          
          <div className="text-slate-200 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
              <p className="mb-2">METAR Now collects the following information:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>ICAO airport codes you search for</li>
                <li>Your favorite airports (stored locally and optionally in your account)</li>
                <li>Recent search history</li>
                <li>Account information if you choose to create an account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>To provide real-time aviation weather data</li>
                <li>To save your favorite airports for quick access</li>
                <li>To improve our service and user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data Sources</h2>
              <p>Weather data is sourced from:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Aviation Weather Center (AWC) - NOAA</li>
                <li>CheckWX API</li>
                <li>Federal Aviation Administration (FAA)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data Storage</h2>
              <p>Your data is stored securely using Supabase. Favorites and search history are stored to enhance your experience across devices.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
              <p>We use third-party services for authentication and data storage. These services have their own privacy policies.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
              <p>For privacy concerns, contact us at: support@h0ss310s.com</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Updates</h2>
              <p>This privacy policy may be updated. Continued use of the app constitutes acceptance of any changes.</p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-slate-400 text-sm">Last updated: December 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
