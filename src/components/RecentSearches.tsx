
import { useState, useEffect } from "react";
import { Clock, X, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSupabaseFavorites } from "@/hooks/useSupabaseFavorites";
import { useAuth } from "@/contexts/AuthContext";

interface RecentSearchesProps {
  onSelectRecent: (icao: string) => void;
}

const RecentSearches = ({ onSelectRecent }: RecentSearchesProps) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { addFavorite, favorites, loading: favLoading } = useSupabaseFavorites();
  const { user } = useAuth();

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

  const handleAddFavorite = (icao: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (user && !favLoading && !favorites.includes(icao)) {
      addFavorite(icao);
    }
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
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="divide-y divide-white/10">
            {recentSearches.map((icao) => {
              const isAlreadyFavorite = favorites.includes(icao);
              return (
                <div
                  key={icao}
                  className="flex items-center justify-between p-4 hover:bg-white/10 transition-all duration-200 group"
                >
                  <button
                    onClick={() => onSelectRecent(icao)}
                    className="flex-1 text-left touch-manipulation active:scale-95 transition-transform"
                  >
                    <span className="text-white font-mono text-lg font-bold">{icao}</span>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {user && (
                      <button
                        onClick={(e) => handleAddFavorite(icao, e)}
                        disabled={isAlreadyFavorite || favLoading}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 touch-manipulation
                          ${isAlreadyFavorite
                            ? "cursor-not-allowed opacity-50 bg-green-500/20 text-green-400"
                            : "hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 bg-blue-500/10"
                          }`}
                        title={isAlreadyFavorite ? "Already in favorites" : "Add to favorites"}
                      >
                        <Plus 
                          className="w-3 h-3"
                          strokeWidth={3}
                        />
                      </button>
                    )}
                    <button
                      onClick={() => removeRecentSearch(icao)}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-colors touch-manipulation"
                    >
                      <X className="w-3 h-3" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentSearches;
