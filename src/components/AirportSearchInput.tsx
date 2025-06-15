
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Suggestion } from "@/types/airport";

interface AirportSearchInputProps {
  query: string;
  suggestions: Suggestion[];
  isLoading?: boolean;
  searching: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSearchClick: () => void;
}

const AirportSearchInput = forwardRef<HTMLInputElement, AirportSearchInputProps>(
  ({ query, suggestions, isLoading, searching, onChange, onKeyDown, onBlur, onSearchClick }, ref) => {
    return (
      <div className="flex space-x-2">
        <Input
          ref={ref}
          type="text"
          value={query}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
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
          onClick={onSearchClick}
        >
          Search
        </Button>
      </div>
    );
  }
);

AirportSearchInput.displayName = "AirportSearchInput";

export default AirportSearchInput;
