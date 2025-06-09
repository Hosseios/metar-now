
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="icao-input" className="text-lg font-semibold text-white">
          Enter ICAO Code
        </Label>
        <p className="text-sm text-slate-400">
          Enter a 4-letter airport code (e.g., KJFK, EGLL, LFPG)
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 max-w-xs">
          <Input
            id="icao-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="KJFK"
            className="text-lg font-mono bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
            maxLength={4}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={!isValidIcao || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 disabled:opacity-50 transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Loading...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default MetarSearch;
