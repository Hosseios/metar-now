
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Trash } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";

interface FavoritesManagerProps {
  currentIcao: string;
  onSelectFavorite: (icaoCode: string) => void;
}

const FavoritesManager = ({ currentIcao, onSelectFavorite }: FavoritesManagerProps) => {
  const { favorites, addFavorite, removeFavorite, selectedFavorite, setSelectedFavorite } = useFavorites();
  const { toast } = useToast();

  const handleAddFavorite = () => {
    if (!currentIcao || currentIcao.length !== 4) {
      toast({
        title: "Invalid ICAO Code",
        description: "Please enter a valid 4-letter ICAO code first.",
        variant: "destructive",
      });
      return;
    }

    if (favorites.includes(currentIcao)) {
      toast({
        title: "Already in Favorites",
        description: `${currentIcao} is already in your favorites list.`,
        variant: "destructive",
      });
      return;
    }

    addFavorite(currentIcao);
    toast({
      title: "Added to Favorites",
      description: `${currentIcao} has been added to your favorites.`,
    });
  };

  const handleRemoveFavorite = () => {
    if (!selectedFavorite) {
      toast({
        title: "No Selection",
        description: "Please select a favorite to remove.",
        variant: "destructive",
      });
      return;
    }

    removeFavorite(selectedFavorite);
    setSelectedFavorite("");
    toast({
      title: "Removed from Favorites",
      description: `${selectedFavorite} has been removed from your favorites.`,
    });
  };

  const handleSelectFavorite = (value: string) => {
    setSelectedFavorite(value);
    onSelectFavorite(value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Favorite Airports
        </h2>
        <p className="text-sm text-slate-400">
          Manage your frequently checked airports
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Favorites Dropdown */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">
            Select Favorite
          </label>
          <Select value={selectedFavorite} onValueChange={handleSelectFavorite}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder={favorites.length === 0 ? "No favorites yet" : "Choose an airport"} />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {favorites.map((icao) => (
                <SelectItem key={icao} value={icao} className="text-white hover:bg-slate-700">
                  {icao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">
            Actions
          </label>
          <div className="flex gap-2">
            <Button
              onClick={handleAddFavorite}
              disabled={!currentIcao || currentIcao.length !== 4}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Star className="w-4 h-4 mr-2" />
              Add Current
            </Button>
            
            <Button
              onClick={handleRemoveFavorite}
              disabled={!selectedFavorite}
              variant="destructive"
              className="flex-1"
            >
              <Trash className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      </div>

      {favorites.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No favorite airports yet.</p>
          <p className="text-sm">Enter an ICAO code and click "Add Current" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesManager;
