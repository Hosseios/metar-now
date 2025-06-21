
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Database, Eye, Clock, Lock, Globe, Mail, Baby, Cookie, Smartphone } from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Eye,
      title: "What We Collect & Why",
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">METAR Now respects your privacy. We only collect data necessary for functionality:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span><strong>Search History:</strong> Airport searches you make (stored locally)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span><strong>Favorites:</strong> Your saved airports (stored locally)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span><strong>Device Info:</strong> Basic device data for mobile app functionality</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-3">No personal information is transmitted to our servers.</p>
        </div>
      )
    },
    {
      icon: Database,
      title: "Local Storage & Your Control",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300">Your data stays on your device using browser technologies:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Local Storage for favorites and preferences</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Session Storage for temporary search data</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>No tracking cookies - only functional storage</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-2">Clear all data anytime through browser settings or app storage.</p>
        </div>
      )
    },
    {
      icon: Globe,
      title: "Your GDPR Rights (EU Users)",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">As an EU user, you have full control:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span><strong>Access:</strong> View all your stored data (it's on your device)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span><strong>Delete:</strong> Clear browser/app storage to remove everything</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span><strong>Portability:</strong> Export your favorites list anytime</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span><strong>No Consent Needed:</strong> We don't process personal data</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Lock,
      title: "Security & Weather Data",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">We protect your experience through:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>HTTPS encryption for all weather data requests</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Official sources: NOAA, FAA, CheckWX API</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>No account creation or login required</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Smartphone,
      title: "Mobile App Permissions",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">Mobile app may request:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span><strong>Network:</strong> Required for weather data</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span><strong>Location:</strong> Optional, for nearby airports only</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span><strong>Storage:</strong> For local data and offline caching</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Baby,
      title: "Age Requirements & Children",
      content: (
        <p className="text-slate-300">
          This app is designed for aviation professionals and enthusiasts. Users under 13 are not permitted. 
          If you're under 18, please get parental permission before use.
        </p>
      )
    },
    {
      icon: Clock,
      title: "Updates & Contact",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300">
            We may update this policy occasionally. Continued use means acceptance of changes. 
            Check this page periodically for updates.
          </p>
          <p className="text-slate-300 mt-3">
            Questions? Contact us at:{" "}
            <a href="mailto:support@h0ss310s.com" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              support@h0ss310s.com
            </a>
          </p>
        </div>
      )
    }
  ];

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

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="text-slate-400">Simple, transparent, and privacy-focused</p>
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              <strong>🇪🇺 EU/Belgium Users:</strong> This policy complies with GDPR. 
              Your data stays local - we don't collect or process personal information on our servers.
            </p>
          </div>
          <p className="text-sm text-slate-500 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid gap-6">
          {sections.map((section, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg">
                    <section.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-200">
                {section.content}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
