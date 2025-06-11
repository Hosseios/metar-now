
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Trash, LogIn, LogOut } from "lucide-react";
import { useSupabaseFavorites } from "@/hooks/useSupabaseFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface FavoritesManagerProps {
  currentIcao: string;
  onSelectFavorite: (icaoCode: string) => void;
}

const FavoritesManager = ({ currentIcao, onSelectFavorite }: FavoritesManagerProps) => {
  const { favorites, addFavorite, removeFavorite, selectedFavorite, setSelectedFavorite, loading } = useSupabaseFavorites();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddFavorite = () => {
    if (!currentIcao || currentIcao.length !== 4) {
      toast({
        title: "Invalid ICAO Code",
        description: "Please enter a valid 4-letter ICAO code first.",
        variant: "destructive",
      });
      return;
    }

    addFavorite(currentIcao);
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

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Favorite Airports
          </h2>
          <p className="text-sm text-slate-400">
            {user ? `Signed in as ${user.email}` : "Sign in to save favorites"}
          </p>
        </div>
        
        <div className="flex gap-2">
          {user ? (
            <Button
              onClick={handleSignOut}
              size="sm"
              className="bg-slate-800/50 backdrop-blur-sm border border-red-500/30 text-white hover:bg-red-900/20 hover:border-red-400/50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              size="sm"
              className="bg-slate-800/50 backdrop-blur-sm border border-green-500/30 text-white hover:bg-green-900/20 hover:border-green-400/50 transition-all duration-200"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>

      {user ? (
        <div className="space-y-4">
          {/* Favorites Dropdown */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">
              Select Favorite
            </label>
            <Select value={selectedFavorite} onValueChange={handleSelectFavorite} disabled={loading}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder={
                  loading ? "Loading..." : 
                  favorites.length === 0 ? "No favorites yet" : 
                  "Choose an airport"
                } />
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
            <div className="flex gap-3 pr-2">
              <Button
                onClick={handleAddFavorite}
                disabled={!currentIcao || currentIcao.length !== 4 || loading}
                className="flex-1 bg-slate-800/50 backdrop-blur-sm border border-green-500/30 text-white hover:bg-green-900/20 hover:border-green-400/50 transition-all duration-200"
              >
                <Star className="w-4 h-4 mr-2" />
                Add Current
              </Button>
              
              <Button
                onClick={handleRemoveFavorite}
                disabled={!selectedFavorite || loading}
                className="flex-1 bg-slate-800/50 backdrop-blur-sm border border-red-500/30 text-white hover:bg-red-900/20 hover:border-red-400/50 transition-all duration-200"
              >
                <Trash className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <LogIn className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Sign in to save and manage your favorite airports.</p>
          <Button
            onClick={() => navigate("/auth")}
            className="mt-4 bg-slate-800/50 backdrop-blur-sm border border-green-500/30 text-white hover:bg-green-900/20 hover:border-green-400/50 transition-all duration-200"
          >
            Sign In to Get Started
          </Button>
        </div>
      )}

      {user && favorites.length === 0 && !loading && (
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
