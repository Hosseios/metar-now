
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Database, Eye, Users, Globe, Mail, Clock, Baby, Cookie, Lock, MapPin, Smartphone, Bell } from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Eye,
      title: "What We Collect",
      content: (
        <div>
          <p className="mb-3">METAR Now respects your privacy. We only collect:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Airport codes you search (stored locally)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Your favorite airports (stored locally)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Recent searches for convenience (stored locally)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Device information for mobile app functionality</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Database,
      title: "How We Use Your Data",
      content: (
        <p className="text-slate-300">Your data stays on your device. We use it to provide personalized aviation weather services and improve your experience with saved favorites and search history. No personal data is transmitted to our servers.</p>
      )
    },
    {
      icon: Clock,
      title: "Data Retention",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">Since data is stored locally on your device:</p>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Search history: Retained until you clear it</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Favorites: Retained until you remove them</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Clear all data by clearing browser storage or app data</span>
          </div>
        </div>
      )
    },
    {
      icon: Cookie,
      title: "Browser Storage & Technologies",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">We use browser technologies to enhance your experience:</p>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>Local Storage for favorites and preferences</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>Session Storage for temporary data</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>No tracking cookies or analytics</span>
          </div>
        </div>
      )
    },
    {
      icon: Baby,
      title: "Children's Privacy",
      content: (
        <p className="text-slate-300">METAR Now is designed for aviation professionals and enthusiasts. We do not knowingly collect information from children under 13. If you're under 18, please get parental permission before using our app.</p>
      )
    },
    {
      icon: Lock,
      title: "Data Security",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">We protect your data through:</p>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Local-only data storage (no server transmission)</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>HTTPS encryption for all weather data requests</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>No account creation required</span>
          </div>
        </div>
      )
    },
    {
      icon: Smartphone,
      title: "Mobile App Permissions",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">Our mobile app may request:</p>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Network access for weather data</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Location (optional) for nearby airports</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Storage for local data and caching</span>
          </div>
        </div>
      )
    },
    {
      icon: Globe,
      title: "Weather Data Sources",
      content: (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>NOAA Aviation Weather Center (AWC)</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>CheckWX API for real-time METAR/TAF data</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>FAA for NOTAMs and airport information</span>
          </div>
        </div>
      )
    },
    {
      icon: MapPin,
      title: "International Users & GDPR",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">For users in the EU and other regions:</p>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Right to access your data (stored locally on your device)</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Right to delete (clear browser/app storage)</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>No cross-border data transfers (local storage only)</span>
          </div>
        </div>
      )
    },
    {
      icon: Shield,
      title: "Your Privacy Rights",
      content: (
        <p className="text-slate-300">Since all personal data is stored locally on your device, you have complete control. Clear your browser data or app storage to remove all information. No account deletion needed as we don't store accounts.</p>
      )
    },
    {
      icon: Users,
      title: "Third-Party Services",
      content: (
        <p className="text-slate-300">We integrate with aviation weather APIs to provide real-time data. These services have their own privacy policies and may collect anonymous usage statistics. We don't share any personal information with them.</p>
      )
    },
    {
      icon: Bell,
      title: "Policy Updates",
      content: (
        <p className="text-slate-300">We may update this privacy policy occasionally to reflect changes in our practices or legal requirements. Continued use of the app after changes means you accept the updated policy. Check this page periodically for updates.</p>
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
              <p className="text-slate-400">How we protect and handle your data</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
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

          <Card className="bg-white/5 backdrop-blur-xl border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <span>Contact Us</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Questions about privacy? Reach out to us at:{" "}
                <a href="mailto:support@h0ss310s.com" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  support@h0ss310s.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
