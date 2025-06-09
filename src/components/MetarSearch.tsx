
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plane } from "lucide-react";

interface MetarSearchProps {
  onSearch: (icaoCode: string) => void;
  isLoading: boolean;
}

const MetarSearch = ({ onSearch, isLoading }: MetarSearchProps) => {
  const [inputValue, setInputValue] = useState("");

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

  const isValidIcao = inputValue.length === 4;

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
          className="h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 disabled:opacity-50 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
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
