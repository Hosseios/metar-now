
export interface Suggestion {
  display: string;
  icao: string;
  iata: string;
}

export interface AirportAutocompleteProps {
  onSelect: (icaoCode: string) => void;
  isLoading?: boolean;
}

export interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}
