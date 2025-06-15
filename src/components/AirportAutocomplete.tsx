import { useState, useRef } from "react";
import { searchAirports } from "@/utils/airportDatabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface Suggestion {
  display: string;
  icao: string;
  iata: string;
}

interface AirportAutocompleteProps {
  onSelect: (icaoCode: string) => void;
  isLoading?: boolean;
}

const AirportAutocomplete = ({ onSelect, isLoading }: AirportAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    console.log(`Search query changed to: "${val}"`);

    if (val.length >= 2) {
      console.log(`Triggering search for: "${val}"`);
      setSearching(true);
      
      try {
        const results = await searchAirports(val);
        const formattedResults = results
          .filter(a => a.icao_code)
          .map(a => ({
            display: `${a.name} (${a.iata_code || "—"}, ${a.icao_code}) - ${a.municipality}, ${a.iso_country}`,
            icao: a.icao_code,
            iata: a.iata_code,
          }));
        
        console.log(`Search returned ${formattedResults.length} results:`, formattedResults);
        setSuggestions(formattedResults);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search failed:', error);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setSearching(false);
      }
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (icao: string) => {
    console.log(`Airport selected: ${icao}`);
    setQuery(icao);
    setShowDropdown(false);
    setSuggestions([]);
    onSelect(icao);
    // Keep focus on input after selection
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Allow "Enter" to trigger select if there is only one suggestion
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      console.log(`Enter pressed, selecting first result: ${suggestions[0].icao}`);
      handleSelect(suggestions[0].icao);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter ICAO Code (e.g., KJFK, EGLL, LFPG)"
          autoComplete="off"
          className="h-12 pr-12 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 rounded-xl"
          disabled={isLoading || searching}
          aria-autocomplete="list"
        />
        <Button
          type="button"
          className="absolute right-2 top-2 bottom-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          disabled={!query || isLoading || searching}
          onClick={async () => {
            if (suggestions.length > 0) {
              console.log(`Search button clicked, selecting first result: ${suggestions[0].icao}`);
              handleSelect(suggestions[0].icao);
            } else {
              console.log(`Search button clicked, using direct input: ${query.toUpperCase()}`);
              onSelect(query.toUpperCase());
            }
          }}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-60 overflow-auto">
          {suggestions.map((s, i) => (
            <button
              type="button"
              key={s.icao + i}
              onClick={() => handleSelect(s.icao)}
              className="block w-full text-left px-4 py-3 hover:bg-slate-700 text-white transition-colors border-b border-slate-700 last:border-b-0"
            >
              <span className="text-sm">{s.display}</span>
            </button>
          ))}
        </div>
      )}
      {showDropdown && suggestions.length === 0 && query.length >= 2 && !searching && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-4 text-slate-400 text-sm">
          No results found for "{query}".
        </div>
      )}
      {searching && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-4 text-slate-400 text-sm">
          Searching...
        </div>
      )}
    </div>
  );
};

export default AirportAutocomplete;
