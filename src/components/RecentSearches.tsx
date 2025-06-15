
import { useState, useEffect } from "react";
import { Clock, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentSearchesProps {
  onSelectRecent: (icao: string) => void;
}

const RecentSearches = ({ onSelectRecent }: RecentSearchesProps) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const addRecentSearch = (icao: string) => {
    const updated = [icao, ...recentSearches.filter(code => code !== icao)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const removeRecentSearch = (icao: string) => {
    const updated = recentSearches.filter(code => code !== icao);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Expose addRecentSearch to parent component
  useEffect(() => {
    (window as any).addRecentSearch = addRecentSearch;
  }, [recentSearches]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Recent Searches</h2>
            <p className="text-slate-300">Quick access to your recent lookups</p>
          </div>
        </div>
        {recentSearches.length > 0 && (
          <Button
            onClick={clearAllRecent}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Clear All
          </Button>
        )}
      </div>

      {recentSearches.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
          <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300 text-lg">No recent searches</p>
          <p className="text-slate-400 text-sm mt-2">Your recent ICAO code searches will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {recentSearches.map((icao) => (
            <div
              key={icao}
              className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 group hover:bg-white/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSelectRecent(icao)}
                  className="flex-1 text-left touch-manipulation active:scale-95 transition-transform"
                >
                  <span className="text-white font-mono text-lg font-bold">{icao}</span>
                </button>
                <button
                  onClick={() => removeRecentSearch(icao)}
                  className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-colors touch-manipulation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentSearches;
