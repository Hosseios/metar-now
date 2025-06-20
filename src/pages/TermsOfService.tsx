
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
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
          <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
          
          <div className="text-slate-200 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Acceptance of Terms</h2>
              <p>By using METAR Now, you agree to these terms of service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Service Description</h2>
              <p>METAR Now provides real-time aviation weather data including METAR, TAF, and NOTAM reports for informational purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Aviation Disclaimer</h2>
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="font-semibold text-red-200 mb-2">IMPORTANT AVIATION NOTICE:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-red-100">
                  <li>This app is for informational purposes only</li>
                  <li>NOT approved for flight planning or navigation</li>
                  <li>Always use official aviation weather sources for flight decisions</li>
                  <li>Data may be delayed or inaccurate</li>
                  <li>Users assume all risks associated with use of this information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the service legally and responsibly</li>
                <li>Do not attempt to disrupt or hack the service</li>
                <li>Verify all aviation data through official sources</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h2>
              <p>METAR Now and its developers are not liable for any damages or losses resulting from use of this application or its data.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Service Availability</h2>
              <p>We strive for reliable service but cannot guarantee 100% uptime. The service may be temporarily unavailable for maintenance.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
              <p>For questions about these terms, contact: support@h0ss310s.com</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Changes to Terms</h2>
              <p>These terms may be updated. Continued use constitutes acceptance of changes.</p>
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

export default TermsOfService;
