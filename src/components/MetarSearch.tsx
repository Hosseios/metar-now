
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plane } from "lucide-react";
import AirportAutocomplete from "./AirportAutocomplete";
import { useSupabaseFavorites } from "@/hooks/useSupabaseFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { findAirportByCode } from "@/utils/airportDatabase";

interface MetarSearchProps {
  onSearch: (icaoCode: string) => void;
  isLoading: boolean;
}

const MetarSearch = ({ onSearch, isLoading }: MetarSearchProps) => {
  const { addFavorite, favorites, loading: favLoading } = useSupabaseFavorites();
  const { user } = useAuth();
  const [lastInput, setLastInput] = useState("");

  // Respond to autocomplete/select
  const handleAirportSelect = async (input: string) => {
    setLastInput(input);
    // Try to resolve code (handles ICAO or IATA)
    let resolvedICAO = input.toUpperCase();
    
    try {
      const airport = await findAirportByCode(input);
      if (airport && airport.icao_code) {
        resolvedICAO = airport.icao_code.toUpperCase();
      }
    } catch (error) {
      console.error('Failed to resolve airport code:', error);
    }
    
    if (resolvedICAO.length === 4) {
      onSearch(resolvedICAO);
    }
  };

  // You can add back the Add Favorite UI as before...
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
          <Plane className="w-6 h-6 text-white" />
        </div>
        <div>
          <Label htmlFor="airport-search" className="text-xl font-bold text-white">
            Search Airport
          </Label>
          <p className="text-slate-300 mt-1">
            Enter an airport name, city, IATA, or ICAO code (e.g., "JFK", "New York", "KJFK")
          </p>
        </div>
      </div>
      {/* New Autocomplete search */}
      <AirportAutocomplete onSelect={handleAirportSelect} isLoading={isLoading} />
    </div>
  );
};

export default MetarSearch;
