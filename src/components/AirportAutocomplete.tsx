
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { searchAirports } from "@/utils/airportDatabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  const updateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  useEffect(() => {
    if (showDropdown) {
      updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      const handleScroll = () => updateDropdownPosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [showDropdown]);

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
        updateDropdownPosition();
      } catch (error) {
        console.error('Search failed:', error);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setSearching(false);
        // Keep focus on input after search completes
        if (inputRef.current) {
          inputRef.current.focus();
        }
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
    // Maintain focus after selection
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        // Set cursor to end of text
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    }, 50);
  };

  // Allow "Enter" to trigger select if there is only one suggestion
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      console.log(`Enter pressed, selecting first result: ${suggestions[0].icao}`);
      handleSelect(suggestions[0].icao);
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Prevent input blur during dropdown interaction
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Only blur if not clicking on dropdown
    setTimeout(() => {
      if (!document.activeElement?.closest('.dropdown-portal')) {
        setShowDropdown(false);
      }
    }, 150);
  };

  const handleDropdownMouseDown = (e: React.MouseEvent) => {
    // Prevent input blur when clicking dropdown
    e.preventDefault();
  };

  // Dropdown content component
  const DropdownContent = () => (
    <div 
      className="dropdown-portal fixed bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-60 overflow-auto"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 999999
      }}
      onMouseDown={handleDropdownMouseDown}
    >
      {suggestions.length > 0 ? (
        suggestions.map((s, i) => (
          <button
            type="button"
            key={s.icao + i}
            onClick={() => handleSelect(s.icao)}
            onMouseDown={handleDropdownMouseDown}
            className="block w-full text-left px-4 py-3 hover:bg-slate-700 text-white transition-colors border-b border-slate-700 last:border-b-0"
          >
            <span className="text-sm">{s.display}</span>
          </button>
        ))
      ) : query.length >= 2 && !searching ? (
        <div className="p-4 text-slate-400 text-sm">
          No results found for "{query}".
        </div>
      ) : searching ? (
        <div className="p-4 text-slate-400 text-sm">
          Searching...
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <div ref={containerRef} className="relative w-full max-w-md">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            placeholder="Enter ICAO Code (e.g., KJFK, EGLL, LFPG)"
            autoComplete="off"
            className="flex-1 h-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 rounded-lg"
            disabled={isLoading}
            aria-autocomplete="list"
          />
          <Button
            type="button"
            size="sm"
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
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
            Search
          </Button>
        </div>
      </div>

      {/* Portal dropdown to ensure it appears above everything */}
      {showDropdown && createPortal(<DropdownContent />, document.body)}
    </>
  );
};

export default AirportAutocomplete;
