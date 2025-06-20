
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Plane, Scale, Phone, Globe } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import { useIsMobile } from "@/hooks/use-mobile";

const TermsOfService = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Terms of Service</h1>
          <p className="text-slate-300">Agreement for using METAR Now</p>
        </div>
      </div>

      {/* Critical Aviation Warning */}
      <div className="bg-red-900/30 backdrop-blur-xl rounded-2xl p-6 border border-red-500/40 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h2 className="text-xl font-bold text-red-400">⚠️ CRITICAL AVIATION WARNING</h2>
        </div>
        <div className="space-y-2 text-red-200 text-sm">
          <p><strong>DO NOT USE THIS APP FOR ACTUAL FLIGHT OPERATIONS</strong></p>
          <p>• This app provides weather information for <strong>reference only</strong></p>
          <p>• Always consult official aviation weather sources for flight planning</p>
          <p>• Weather data may be delayed, incomplete, or inaccurate</p>
          <p>• The developer assumes no responsibility for flight safety decisions</p>
        </div>
      </div>

      {/* Content Cards */}
      <div className="space-y-4">
        {/* Acceptance of Terms */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Scale className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Acceptance of Terms</h2>
          </div>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>By using METAR Now, you agree to these terms. If you don't agree, please don't use the app.</p>
            <p>These terms may be updated periodically. Continued use constitutes acceptance of changes.</p>
            <p>Effective Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Service Description */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Plane className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Service Description</h2>
          </div>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>METAR Now provides:</p>
            <ul className="space-y-1 ml-4">
              <li>• Current aviation weather reports (METAR)</li>
              <li>• Terminal Aerodrome Forecasts (TAF)</li>
              <li>• Notices to Airmen (NOTAMs)</li>
              <li>• Airport information and data</li>
              <li>• Personal favorites and search history</li>
            </ul>
          </div>
        </div>

        {/* Data Accuracy Disclaimer */}
        <div className="bg-orange-900/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold text-orange-400">Data Accuracy & Limitations</h2>
          </div>
          <div className="space-y-2 text-orange-200 text-sm">
            <p><strong>Weather data limitations:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Data may be delayed, outdated, or temporarily unavailable</li>
              <li>• Third-party API dependencies may cause service interruptions</li>
              <li>• Weather conditions can change rapidly and without notice</li>
              <li>• NOTAMs may not reflect the most current airport conditions</li>
            </ul>
            <p className="mt-3"><strong>User responsibility:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Always verify information through official aviation channels</li>
              <li>• Use appropriate official weather briefing services for flight planning</li>
              <li>• Understand that this app is supplementary information only</li>
            </ul>
          </div>
        </div>

        {/* User Conduct */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Phone className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">User Conduct & Responsibilities</h2>
          </div>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>You agree to:</p>
            <ul className="space-y-1 ml-4">
              <li>• Use the app for lawful purposes only</li>
              <li>• Not attempt to reverse engineer or hack the app</li>
              <li>• Not overload our servers with excessive requests</li>
              <li>• Respect intellectual property rights</li>
              <li>• Provide accurate account information</li>
            </ul>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Scale className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Limitation of Liability</h2>
          </div>
          <div className="space-y-2 text-slate-300 text-sm">
            <p><strong>The developer and METAR Now:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Provide the app "as is" without warranties</li>
              <li>• Are not liable for any damages arising from app use</li>
              <li>• Do not guarantee continuous, error-free operation</li>
              <li>• Are not responsible for third-party data accuracy</li>
              <li>• Disclaim liability for flight safety decisions based on app data</li>
            </ul>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Privacy & Data Collection</h2>
          </div>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>Please review our <Button 
              variant="link" 
              className="text-cyan-400 hover:text-cyan-300 p-0 h-auto font-normal text-sm underline"
              onClick={() => navigate('/privacy-policy')}
            >
              Privacy Policy
            </Button> for details on:</p>
            <ul className="space-y-1 ml-4">
              <li>• What data we collect and why</li>
              <li>• How we protect your information</li>
              <li>• Your rights regarding your data</li>
              <li>• Third-party services we use</li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Phone className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Contact & Support</h2>
          </div>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>For questions about these terms or the app:</p>
            <p>Email: <a href="mailto:support@h0ss310s.com" className="text-cyan-400 hover:text-cyan-300">support@h0ss310s.com</a></p>
            <p>Website: <a href="https://h0ss310s.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">h0ss310s.com</a></p>
            <p>Developer: h0ss310s</p>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-6 pb-8">
        <Button
          onClick={() => navigate(-1)}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-xl"
        >
          I Agree to Terms
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <MobileLayout>
        <div className="flex-1 p-4 space-y-4 pb-24 bg-slate-900/20 overflow-y-auto" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))', paddingBottom: '90px' }}>
          {content}
        </div>
      </MobileLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: `url('/lovable-uploads/a24c1d1e-db26-4943-baf9-119712ba820f.png')`
        }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
          {content}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
