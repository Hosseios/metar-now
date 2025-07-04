import { useState, useRef, useEffect } from "react";
import { searchAirports } from "@/utils/airportDatabase";
import { AirportAutocompleteProps, Suggestion, DropdownPosition } from "@/types/airport";
import AirportDropdown from "./AirportDropdown";
import AirportSearchInput from "./AirportSearchInput";

const AirportAutocomplete = ({ onSelect, isLoading }: AirportAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 0 });
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

    if (val.length >= 2) {
      setSearching(true);
      
      try {
        const results = await searchAirports(val);
        const formattedResults = results
          .filter(a => a.ident) // Use ident as primary ICAO
          .map(a => ({
            display: `${a.name} (${a.iata_code || "—"}, ${a.ident}) - ${a.municipality}, ${a.iso_country}`,
            icao: a.ident, // Use ident as the primary ICAO code
            iata: a.iata_code,
          }));
        
        setSuggestions(formattedResults);
        setShowDropdown(true);
        updateDropdownPosition();
      } catch (error) {
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

  const handleSearchClick = async () => {
    if (suggestions.length > 0) {
      handleSelect(suggestions[0].icao);
    } else {
      onSelect(query.toUpperCase());
    }
  };

  return (
    <>
      <div ref={containerRef} className="relative w-full max-w-md">
        <AirportSearchInput
          ref={inputRef}
          query={query}
          suggestions={suggestions}
          isLoading={isLoading}
          searching={searching}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          onSearchClick={handleSearchClick}
        />
      </div>

      {/* Portal dropdown to ensure it appears above everything */}
      {showDropdown && (
        <AirportDropdown
          suggestions={suggestions}
          dropdownPosition={dropdownPosition}
          query={query}
          searching={searching}
          onSelect={handleSelect}
          onMouseDown={handleDropdownMouseDown}
        />
      )}
    </>
  );
};

export default AirportAutocomplete;
