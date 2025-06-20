
import { Home, Plus, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/useHaptics";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const { triggerLight } = useHaptics();
  
  const tabs = [
    { id: 'search', label: 'Search', icon: Home },
    { id: 'favorites', label: 'Favorites', icon: Plus },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabChange = async (tabId: string) => {
    if (tabId !== activeTab) {
      await triggerLight();
      onTabChange(tabId);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-white/20 z-[9999] safe-area-bottom" style={{ position: 'fixed' }}>
      <div className="flex items-center justify-around py-2 px-2 min-h-[70px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center min-h-[60px] px-3 py-2 rounded-lg transition-all duration-200 flex-1 max-w-[80px]",
                "active:scale-95 touch-manipulation",
                isActive 
                  ? "text-cyan-400 bg-cyan-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className={cn("w-6 h-6 mb-1", isActive && "drop-shadow-sm shadow-cyan-400/50")} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
