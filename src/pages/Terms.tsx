
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Plane, AlertTriangle, Database, Shield, RefreshCw, Mail, UserCheck, CreditCard, Copyright, Ban, Server, Scale, Globe2, DollarSign } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: FileText,
      title: "Agreement",
      content: (
        <p className="text-slate-300">By using METAR Now, you agree to these terms. If you don't agree, please don't use our service.</p>
      )
    },
    {
      icon: UserCheck,
      title: "Eligibility & Age Requirements",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">To use METAR Now:</p>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>You must be 13 years or older</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>If under 18, you need parental consent</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Must comply with aviation regulations in your area</span>
          </div>
        </div>
      )
    },
    {
      icon: CreditCard,
      title: "Account & Service Terms",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">Service usage:</p>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>No account registration required</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Free service with no subscription fees</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>We may limit usage to prevent abuse</span>
          </div>
        </div>
      )
    },
    {
      icon: Plane,
      title: "What We Provide",
      content: (
        <div>
          <p className="mb-3 text-slate-300">Real-time aviation weather information including:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>METAR reports and TAF forecasts</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>NOTAMs and airport information</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Weather data visualization</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Favorites and search history</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Copyright,
      title: "Intellectual Property",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">Rights and ownership:</p>
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
            <span>You may use data for personal aviation purposes</span>
          </div>
        </div>
      )
    },
    {
      icon: Ban,
      title: "Prohibited Activities",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">You may not:</p>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Use the service for illegal activities</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Attempt to hack or disrupt our services</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Redistribute or resell our data without permission</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Violate aviation regulations or safety protocols</span>
          </div>
        </div>
      )
    },
    {
      icon: Database,
      title: "Data Accuracy",
      content: (
        <p className="text-slate-300">We source data from reliable aviation authorities, but weather can change rapidly. Data may contain delays or errors. Always verify with official sources for flight planning and critical decisions.</p>
      )
    },
    {
      icon: Server,
      title: "Service Availability",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">Service limitations:</p>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>Service provided "as is" without guarantees</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>May experience downtime for maintenance</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>Weather data depends on third-party sources</span>
          </div>
        </div>
      )
    },
    {
      icon: Shield,
      title: "Acceptable Use",
      content: (
        <p className="text-slate-300">Use METAR Now responsibly and in compliance with aviation regulations in your area. Don't misuse the service or attempt to harm our infrastructure. Respect other users and follow aviation best practices.</p>
      )
    },
    {
      icon: AlertTriangle,
      title: "Limitations & Liability",
      content: (
        <p className="text-slate-300">METAR Now is provided "as is." We're not liable for any issues arising from your use of weather data or the app. Use your best judgment and follow aviation best practices. We disclaim all warranties to the fullest extent permitted by law.</p>
      )
    },
    {
      icon: DollarSign,
      title: "Indemnification",
      content: (
        <p className="text-slate-300">You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of METAR Now, violation of these terms, or infringement of any rights of another party.</p>
      )
    },
    {
      icon: Globe2,
      title: "Export & International Use",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">International considerations:</p>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Aviation data subject to export control laws</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Comply with local aviation regulations</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Service may not be available in all regions</span>
          </div>
        </div>
      )
    },
    {
      icon: Scale,
      title: "Governing Law & Disputes",
      content: (
        <div className="space-y-2">
          <p className="text-slate-300 mb-2">Legal framework:</p>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
            <span>Governed by laws of the United States</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
            <span>Disputes resolved through binding arbitration</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
            <span>Class action lawsuits waived</span>
          </div>
        </div>
      )
    },
    {
      icon: RefreshCw,
      title: "Updates",
      content: (
        <p className="text-slate-300">We may update these terms occasionally to reflect changes in our service or legal requirements. Continued use means you accept any changes. We'll notify users of material changes when possible.</p>
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
              <p className="text-slate-400">Your agreement for using METAR Now</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-white/5 backdrop-blur-xl border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <span>Aviation Safety Notice</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                This app is for reference only. Never use it as your sole source for flight planning or critical aviation decisions. Always consult official sources and follow proper aviation procedures.
              </p>
            </CardContent>
          </Card>

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

          <Card className="bg-white/5 backdrop-blur-xl border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg">
                  <Mail className="w-5 h-5 text-amber-400" />
                </div>
                <span>Questions?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Contact us at:{" "}
                <a href="mailto:support@h0ss310s.com" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
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

export default Terms;
