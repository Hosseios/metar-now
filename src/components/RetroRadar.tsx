
import { useEffect, useState } from "react";
import { Radar } from "lucide-react";

interface RetroRadarProps {
  isActive: boolean;
}

const RetroRadar = ({ isActive }: RetroRadarProps) => {
  const [sweepAngle, setSweepAngle] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSweepAngle(prev => (prev + 6) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        {/* Radar Screen Background */}
        <div className="absolute inset-0 bg-black rounded-full border-2 border-orange-500 shadow-lg shadow-orange-500/30">
          {/* Grid Lines */}
          <div className="absolute inset-2 border border-orange-500/30 rounded-full"></div>
          <div className="absolute inset-4 border border-orange-500/20 rounded-full"></div>
          
          {/* Cross Lines */}
          <div className="absolute top-1/2 left-2 right-2 h-px bg-orange-500/30 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 top-2 bottom-2 w-px bg-orange-500/30 transform -translate-x-1/2"></div>
        </div>

        {/* Radar Sweep */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from ${sweepAngle}deg, transparent 0deg, rgba(255, 165, 0, 0.6) 30deg, transparent 60deg)`,
            transform: 'rotate(0deg)',
          }}
        />

        {/* Center Radar Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Radar className="w-4 h-4 text-orange-500 animate-pulse" />
        </div>

        {/* Scanning dots */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
          <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-4 right-4">
          <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
          <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
      
      {/* Retro Text */}
      <div className="ml-4 font-mono text-orange-500 text-sm md:text-base">
        <div className="animate-pulse">SCANNING...</div>
        <div className="text-xs text-orange-400">WEATHER DATA</div>
      </div>
    </div>
  );
};

export default RetroRadar;
