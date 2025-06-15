
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
  const { favorites, removeFavorite, loading } = useSupabaseFavorites();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRemoveFavorite = (icao: string) => {
    removeFavorite(icao);
    toast({
      title: "Removed from Favorites",
      description: `${icao} has been removed from your favorites.`,
    });
  };

  const handleSelectFavorite = (icao: string) => {
    onSelectFavorite(icao);
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
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">
              My Favorites
            </label>
            <ul className="divide-y divide-slate-700 border border-slate-700 rounded-xl bg-slate-800/60 max-h-60 overflow-auto">
              {favorites.length === 0 && !loading && (
                <li className="py-4 px-3 text-slate-400 text-center">
                  <Star className="inline w-4 h-4 mb-1 text-yellow-300" /> No favorite airports yet.
                  <div className="text-xs mt-2">Add some from the Search tab!</div>
                </li>
              )}
              {favorites.map((icao) => (
                <li key={icao} className="flex items-center justify-between px-3 py-3 hover:bg-slate-700/40 transition cursor-pointer group">
                  <button
                    className="flex items-center gap-3 text-white font-mono"
                    onClick={() => handleSelectFavorite(icao)}
                  >
                    <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    {icao}
                  </button>
                  <button
                    title={`Remove ${icao} from favorites`}
                    onClick={() => handleRemoveFavorite(icao)}
                    className="text-red-400 hover:text-red-600 transition p-1 rounded-full opacity-70 hover:opacity-100"
                    disabled={loading}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </li>
              ))}
              {loading && (
                <li className="py-4 px-3 text-slate-400 text-center">
                  Loading...
                </li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <LogIn className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Sign in to save and manage your favorite airports.</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesManager;
