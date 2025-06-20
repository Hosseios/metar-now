
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

const MetarSearch = ({
  onSearch,
  isLoading
}: MetarSearchProps) => {
  const {
    addFavorite,
    favorites,
    loading: favLoading
  } = useSupabaseFavorites();
  const {
    user
  } = useAuth();
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
      // Failed to resolve airport code - continue with original input
    }
    if (resolvedICAO.length === 4) {
      onSearch(resolvedICAO);
    }
  };

  return <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
          <Plane className="w-5 h-5 text-white" />
        </div>
        <div>
          <Label htmlFor="airport-search" className="text-lg font-bold text-white">Enter ICAO , IATA Code, or City</Label>
          <p className="text-slate-300 text-sm">Enter a 4-letter airport code (e.g., KJFK, EGLL, LFPG)
IATA Code (e.g., FRA, MXP, LGG, BRU, CDG, LHR)
        </p>
        </div>
      </div>
      {/* Compact autocomplete search */}
      <AirportAutocomplete onSelect={handleAirportSelect} isLoading={isLoading} />
    </div>;
};

export default MetarSearch;
