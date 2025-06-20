import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Moon,
  Sun,
  Scale,
  Shield,
  FileText,
  Mail,
  Info,
  Github,
  Globe,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

const MobileSettings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      {/* General Settings Section */}
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
        <h3 className="text-white font-bold mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-cyan-400" />
          General Settings
        </h3>
        <div className="space-y-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <>
                <Moon className="w-4 h-4 mr-3" />
                Dark Mode
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 mr-3" />
                Light Mode
              </>
            )}
          </Button>
          {/* Add more general settings here */}
        </div>
      </div>

      {/* Legal & Support Section */}
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
        <h3 className="text-white font-bold mb-4 flex items-center">
          <Scale className="w-5 h-5 mr-2 text-cyan-400" />
          Legal & Support
        </h3>
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10"
            onClick={() => navigate('/privacy-policy')}
          >
            <Shield className="w-4 h-4 mr-3" />
            Privacy Policy
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10"
            onClick={() => navigate('/terms-of-service')}
          >
            <FileText className="w-4 h-4 mr-3" />
            Terms of Service
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10"
            onClick={() => window.open('mailto:support@h0ss310s.com', '_blank')}
          >
            <Mail className="w-4 h-4 mr-3" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
        <h3 className="text-white font-bold mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-cyan-400" />
          About
        </h3>
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10"
            onClick={() => window.open('https://h0ss310s.com', '_blank')}
          >
            <Globe className="w-4 h-4 mr-3" />
            Developer Website
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10"
            onClick={() => window.open('https://github.com/hosseios', '_blank')}
          >
            <Github className="w-4 h-4 mr-3" />
            GitHub Profile
          </Button>
          {/* Add more about info here */}
        </div>
      </div>
    </div>
  );
};

export default MobileSettings;
