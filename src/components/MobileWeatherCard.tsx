
import { useState } from "react";
import { ChevronDown, ChevronUp, CloudRain, CloudLightning, Plane, Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MobileWeatherCardProps {
  type: 'metar' | 'taf' | 'airport' | 'notam';
  title: string;
  data: string;
  hasData: boolean;
  icon: React.ElementType;
}

const MobileWeatherCard = ({ type, title, data, hasData, icon: Icon }: MobileWeatherCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPreviewText = (text: string) => {
    if (!text || text.includes('Error fetching') || text.includes('No ') || text.includes('Enter an ICAO')) {
      return text;
    }
    
    const lines = text.split('\n');
    const firstLines = lines.slice(0, 3).join('\n');
    return firstLines.length > 150 ? firstLines.substring(0, 150) + '...' : firstLines;
  };

  const shouldShowExpand = data && data.length > 150 && hasData;

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg mb-4">
      <div 
        className="p-4 cursor-pointer touch-manipulation active:scale-[0.98] transition-transform"
        onClick={() => shouldShowExpand && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              {hasData && (
                <Badge variant="outline" className="text-xs bg-orange-400/20 border-orange-400/50 text-orange-200">
                  Live Data
                </Badge>
              )}
            </div>
          </div>
          {shouldShowExpand && (
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-white" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white" />
              )}
            </button>
          )}
        </div>

        <div className="relative">
          {isExpanded ? (
            <ScrollArea className="h-[300px] w-full">
              <div className="bg-black/80 text-orange-400 p-4 rounded-xl avionics-display"
                style={{
                  fontFamily: 'Monaco, "Courier New", monospace',
                  textShadow: '0 0 8px rgba(255, 165, 0, 0.6)',
                  letterSpacing: '0.5px',
                  lineHeight: '1.4',
                  fontSize: '14px'
                }}>
                <pre className="whitespace-pre-wrap">{data}</pre>
              </div>
            </ScrollArea>
          ) : (
            <div className="bg-black/80 text-orange-400 p-4 rounded-xl avionics-display"
              style={{
                fontFamily: 'Monaco, "Courier New", monospace',
                textShadow: '0 0 8px rgba(255, 165, 0, 0.6)',
                letterSpacing: '0.5px',
                lineHeight: '1.4',
                fontSize: '14px'
              }}>
              <pre className="whitespace-pre-wrap">{getPreviewText(data)}</pre>
              {shouldShowExpand && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl flex items-end justify-center pb-1">
                  <span className="text-orange-300 text-xs">Tap to expand</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileWeatherCard;
