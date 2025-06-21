
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Plane, AlertTriangle, Shield, Scale, Ban, Server, Globe2, RefreshCw, Mail } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: FileText,
      title: "Agreement & Eligibility",
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">By using METAR Now, you agree to these terms.</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Must be 13+ years old (18+ without parental consent)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Comply with aviation regulations in your area</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Free service, no registration required</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Plane,
      title: "What We Provide",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">Real-time aviation weather information:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>METAR reports, TAF forecasts, and NOTAMs</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Airport information and weather visualization</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Personal favorites and search history (local storage)</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Ban,
      title: "Usage Rules & Restrictions",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">You agree to:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Use the service for legitimate aviation purposes only</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Respect our infrastructure and other users</span>
            </div>
          </div>
          <p className="text-slate-300 mb-2 mt-3">You may not:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Attempt to hack, disrupt, or abuse our services</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Redistribute or resell weather data commercially</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Use the service for illegal activities</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Server,
      title: "Service & Data Disclaimers",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">Important limitations:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Service provided "as is" without guarantees</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Weather data may contain delays or errors</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Always verify with official sources for flight planning</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>May experience downtime for maintenance</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Shield,
      title: "Liability & Responsibility",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2"><strong>Important:</strong> You use this app at your own risk.</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>We're not liable for decisions based on our weather data</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>You indemnify us from claims arising from your use</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Always follow aviation best practices and regulations</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Globe2,
      title: "Intellectual Property & Data",
      content: (
        <div className="space-y-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>METAR Now app and design are our property</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Weather data sourced from public aviation authorities</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Aviation data subject to export control laws</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Scale,
      title: "Legal & Dispute Resolution",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">For Belgian/EU users:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <span>EU consumer protection laws apply where applicable</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <span>Disputes resolved through appropriate legal channels</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <span>Governed by laws of service provider jurisdiction</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: RefreshCw,
      title: "Updates & Contact",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300">
            We may update these terms to reflect service changes or legal requirements. 
            Continued use means acceptance of updates.
          </p>
          <p className="text-slate-300 mt-3">
            Questions? Contact us at:{" "}
            <a href="mailto:support@h0ss310s.com" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
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
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
              <p className="text-slate-400">Clear terms for using METAR Now</p>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
            <p className="text-amber-200 text-sm">
              <strong>⚠️ Aviation Safety Notice:</strong> This app is for reference only. 
              Never use as your sole source for flight planning or critical aviation decisions. 
              Always consult official sources and follow proper aviation procedures.
            </p>
          </div>
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid gap-6">
          {sections.map((section, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg">
                    <section.icon className="w-5 h-5 text-amber-400" />
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

export default Terms;
