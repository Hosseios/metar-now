
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plane, Heart } from "lucide-react";
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
            className={`ml-4 transition p-2 rounded-full border-2 ${
              isAlreadyFavorite 
                ? "bg-pink-700/60 border-pink-400 text-white cursor-not-allowed opacity-60" 
                : "bg-slate-700/60 border-pink-500 hover:bg-pink-600/70 hover:border-pink-400 text-white"
            }`}
            onClick={handleAddFavorite}
            disabled={!isValidIcao || isAlreadyFavorite || favLoading}
            aria-label="Add to favorites"
            style={{boxShadow: '0 0 6px 0 rgba(236,72,153,.22)'}}
          >
            <Heart className="w-5 h-5" fill={isAlreadyFavorite ? "#ec4899" : "none"} />
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
