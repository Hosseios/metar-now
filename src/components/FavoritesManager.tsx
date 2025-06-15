
import { Button } from "@/components/ui/button";
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

  const handleRemoveFavorite = (icaoCode: string) => {
    removeFavorite(icaoCode);
    if (selectedFavorite === icaoCode) {
      setSelectedFavorite("");
    }
    toast({
      title: "Removed from Favorites",
      description: `${icaoCode} has been removed from your favorites.`,
    });
  };

  const handleSelectFavorite = (icaoCode: string) => {
    setSelectedFavorite(icaoCode);
    onSelectFavorite(icaoCode);
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
          {/* Add Current Button */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">
              Add Current Airport
            </label>
            <Button
              onClick={handleAddFavorite}
              disabled={!currentIcao || currentIcao.length !== 4 || loading}
              className="w-full bg-slate-800/50 backdrop-blur-sm border border-green-500/30 text-white hover:bg-green-900/20 hover:border-green-400/50 transition-all duration-200"
            >
              <Star className="w-4 h-4 mr-2" />
              Add {currentIcao || "Current Airport"} to Favorites
            </Button>
          </div>

          {/* Favorites List */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">
              Your Favorites {loading && "(Loading...)"}
            </label>
            
            {favorites.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {favorites.map((icao) => (
                  <div 
                    key={icao} 
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      selectedFavorite === icao 
                        ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200' 
                        : 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50'
                    }`}
                    onClick={() => handleSelectFavorite(icao)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="font-mono text-lg font-medium">{icao}</span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(icao);
                      }}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1 h-auto"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No favorite airports yet.</p>
                <p className="text-sm">Enter an ICAO code and click "Add Current" to get started.</p>
              </div>
            )}
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
    </div>
  );
};

export default FavoritesManager;
