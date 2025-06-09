
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useSupabaseFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedFavorite, setSelectedFavorite] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load favorites from Supabase when user is available
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setSelectedFavorite("");
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('icao_code')
        .eq('user_id', user.id)
        .order('icao_code');

      if (error) {
        console.error("Error loading favorites:", error);
        toast({
          title: "Error",
          description: "Failed to load favorites",
          variant: "destructive",
        });
        return;
      }

      const icaoCodes = data?.map(fav => fav.icao_code) || [];
      setFavorites(icaoCodes);
      console.log("Loaded favorites from Supabase:", icaoCodes);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (icaoCode: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    if (favorites.includes(icaoCode)) {
      toast({
        title: "Already in Favorites",
        description: `${icaoCode} is already in your favorites list.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          icao_code: icaoCode
        });

      if (error) {
        console.error("Error adding favorite:", error);
        toast({
          title: "Error",
          description: "Failed to add favorite",
          variant: "destructive",
        });
        return;
      }

      setFavorites(prev => [...prev, icaoCode].sort());
      console.log(`Added ${icaoCode} to favorites`);
      
      toast({
        title: "Added to Favorites",
        description: `${icaoCode} has been added to your favorites.`,
      });
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFavorite = async (icaoCode: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('icao_code', icaoCode);

      if (error) {
        console.error("Error removing favorite:", error);
        toast({
          title: "Error",
          description: "Failed to remove favorite",
          variant: "destructive",
        });
        return;
      }

      setFavorites(prev => prev.filter(code => code !== icaoCode));
      if (selectedFavorite === icaoCode) {
        setSelectedFavorite("");
      }
      console.log(`Removed ${icaoCode} from favorites`);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    selectedFavorite,
    setSelectedFavorite,
    loading,
    loadFavorites,
  };
};
