
import { useState, useRef } from "react";
import { searchAirports } from "@/utils/airportDatabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plane, Search } from "lucide-react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (val.length >= 2) {
      const results = searchAirports(val)
        .filter(a => a.icao_code)
        .map(a => ({
          display: `${a.name} (${a.iata_code || "—"}, ${a.icao_code}) - ${a.municipality}, ${a.iso_country}`,
          icao: a.icao_code,
          iata: a.iata_code,
        }));
      setSuggestions(results);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (icao: string) => {
    setQuery(icao);
    setShowDropdown(false);
    setSuggestions([]);
    onSelect(icao);
  };

  // Allow "Enter" to trigger select if there is only one suggestion
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSelect(suggestions[0].icao);
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search by city, airport, IATA or ICAO (e.g. JFK, New York, KJFK)"
        autoComplete="off"
        className="pr-12"
        disabled={isLoading}
        aria-autocomplete="list"
      />
      <Button
        type="button"
        className="absolute right-1 top-1 bottom-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        disabled={!query || isLoading}
        onClick={() => {
          if (suggestions.length > 0) {
            handleSelect(suggestions[0].icao);
          } else {
            onSelect(query.toUpperCase());
          }
        }}
      >
        <Search className="w-4 h-4" />
      </Button>
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-auto">
          {suggestions.map((s, i) => (
            <button
              type="button"
              key={s.icao + i}
              onClick={() => handleSelect(s.icao)}
              className="block w-full text-left px-3 py-2 hover:bg-blue-100 text-black transition"
            >
              <span className="font-semibold">{s.display}</span>
            </button>
          ))}
        </div>
      )}
      {showDropdown && suggestions.length === 0 && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 text-gray-600 text-sm">
          No results found.
        </div>
      )}
    </div>
  );
};

export default AirportAutocomplete;
