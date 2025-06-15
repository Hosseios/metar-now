
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plane, Plus } from "lucide-react";
import RetroRadar from "./RetroRadar";
import { useSupabaseFavorites } from "@/hooks/useSupabaseFavorites";
import { useAuth } from "@/contexts/AuthContext";

interface MetarSearchProps {
  onSearch: (icaoCode: string) => void;
  isLoading: boolean;
}

const MetarSearch = ({ onSearch, isLoading }: MetarSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const { addFavorite, favorites, loading: favLoading } = useSupabaseFavorites();
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 4);
    setInputValue(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.length === 4) {
      onSearch(inputValue);
    }
  };

  const handleAddFavorite = () => {
    if (user && inputValue.length === 4 && !favLoading && !favorites.includes(inputValue)) {
      addFavorite(inputValue);
    }
  };

  const isValidIcao = inputValue.length === 4;
  const isAlreadyFavorite = favorites.includes(inputValue);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
          <Plane className="w-6 h-6 text-white" />
        </div>
        <div>
          <Label htmlFor="icao-input" className="text-xl font-bold text-white">
            Enter ICAO Code
          </Label>
          <p className="text-slate-300 mt-1">
            Enter a 4-letter airport code (e.g., KJFK, EGLL, LFPG)
          </p>
        </div>
        {user && (
          <button
            type="button"
            title={isAlreadyFavorite ? "Already in favorites" : "Add to favorites"}
            className={`ml-4 flex items-center justify-center transition-all duration-200 p-2 rounded-lg border-2 relative group
              ${isAlreadyFavorite 
                ? "cursor-not-allowed opacity-60 bg-green-500/20 border-green-500/40"
                : "hover:bg-blue-500/20 border-blue-400/30 hover:border-blue-400/60 bg-white/10 backdrop-blur-sm"
              }`}
            onClick={handleAddFavorite}
            disabled={!isValidIcao || isAlreadyFavorite || favLoading}
            aria-label="Add to favorites"
            style={{ 
              boxShadow: isAlreadyFavorite 
                ? '0 0 8px 0 rgba(34,197,94,.12)' 
                : '0 0 8px 0 rgba(59,130,246,.12)' 
            }}
          >
            <Plus
              className={`w-4 h-4 transition-all duration-200
                ${isAlreadyFavorite
                  ? "text-green-400 rotate-45"
                  : "text-blue-300 hover:text-blue-200 hover:scale-110"
                }
              `}
              strokeWidth={2}
            />
            {!isAlreadyFavorite && (
              <span className="absolute left-1/2 transform -translate-x-1/2 top-full w-max text-xs bg-blue-600/90 text-white rounded-lg px-3 py-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl z-10 font-medium">
                Add to favorites
              </span>
            )}
            {isAlreadyFavorite && (
              <span className="absolute left-1/2 transform -translate-x-1/2 top-full w-max text-xs bg-green-600/90 text-white rounded-lg px-3 py-1.5 mt-2 opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl z-10 font-medium">
                Added to favorites
              </span>
            )}
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="flex-1 max-w-xs">
          <Input
            id="icao-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="KJFK"
            className="text-lg font-mono h-14 bg-white/20 border-white/30 text-white placeholder:text-slate-300 focus:border-cyan-400 focus:ring-cyan-400/30 backdrop-blur-sm rounded-xl"
            maxLength={4}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={!isValidIcao || isLoading}
          className="h-14 bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 text-white hover:bg-blue-900/20 hover:border-blue-400/50 transition-all duration-200 px-8 disabled:opacity-50 rounded-xl shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Searching...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5" />
              Search Weather
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default MetarSearch;
