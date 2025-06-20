
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Database, Eye, Users, Mail } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import { useIsMobile } from "@/hooks/use-mobile";

const PrivacyPolicy = () => {
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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-slate-300">How we protect and use your information</p>
        </div>
      </div>

      {/* Content Cards */}
      <div className="space-y-4">
        {/* Information We Collect */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Information We Collect</h2>
          </div>
          <div className="space-y-3 text-slate-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Personal Information</h3>
              <ul className="space-y-1 text-sm">
                <li>• Email address (when you create an account)</li>
                <li>• User preferences and settings</li>
                <li>• Favorite airports and recent searches</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Usage Information</h3>
              <ul className="space-y-1 text-sm">
                <li>• Airport codes searched</li>
                <li>• App usage patterns and features accessed</li>
                <li>• Device information (model, OS version)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">How We Use Your Information</h2>
          </div>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• Provide real-time aviation weather data (METAR, TAF, NOTAMs)</li>
            <li>• Save your favorite airports and recent searches</li>
            <li>• Improve app performance and user experience</li>
            <li>• Send important updates about the service</li>
            <li>• Ensure app security and prevent misuse</li>
          </ul>
        </div>

        {/* Data Sharing */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Data Sharing & Third Parties</h2>
          </div>
          <div className="space-y-3 text-slate-300 text-sm">
            <p>We use the following third-party services:</p>
            <ul className="space-y-1">
              <li>• <strong>Supabase:</strong> Secure database and authentication</li>
              <li>• <strong>CheckWX API:</strong> Real-time aviation weather data</li>
              <li>• <strong>Aviation Weather Center (NOAA):</strong> Official weather data</li>
              <li>• <strong>FAA:</strong> NOTAM information</li>
            </ul>
            <p className="mt-3">
              <strong>We do not sell</strong> your personal information to third parties.
            </p>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold text-white">Data Security & Storage</h2>
          </div>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>• All data is encrypted in transit and at rest</p>
            <p>• We use industry-standard security measures</p>
            <p>• Data is stored securely with Supabase (ISO 27001 certified)</p>
            <p>• Regular security audits and updates</p>
            <p>• You can delete your account and data at any time</p>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Your Rights & Contact</h2>
          </div>
          <div className="space-y-3 text-slate-300 text-sm">
            <div>
              <h3 className="font-semibold text-white mb-2">Your Rights:</h3>
              <ul className="space-y-1">
                <li>• Access your personal data</li>
                <li>• Correct inaccurate information</li>
                <li>• Delete your account and data</li>
                <li>• Export your data</li>
                <li>• Opt out of communications</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Contact Us:</h3>
              <p>Email: <a href="mailto:support@h0ss310s.com" className="text-cyan-400 hover:text-cyan-300">support@h0ss310s.com</a></p>
              <p>Website: <a href="https://h0ss310s.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">h0ss310s.com</a></p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-orange-900/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30 shadow-lg">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Important Notes</h2>
          <div className="space-y-2 text-orange-200 text-sm">
            <p>• This app is <strong>not intended for children under 13</strong></p>
            <p>• Aviation data is for informational purposes only</p>
            <p>• Always verify weather information with official sources for flight planning</p>
            <p>• Policy effective date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-6 pb-8">
        <Button
          onClick={() => navigate(-1)}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-xl"
        >
          I Understand
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

export default PrivacyPolicy;
