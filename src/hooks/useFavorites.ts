
import { useState, useEffect } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedFavorite, setSelectedFavorite] = useState<string>("");

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("metarFavorites");
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
          console.log("Loaded favorites from localStorage:", parsed);
        }
      } catch (error) {
        console.error("Error parsing saved favorites:", error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("metarFavorites", JSON.stringify(favorites));
    console.log("Saved favorites to localStorage:", favorites);
  }, [favorites]);

  const addFavorite = (icaoCode: string) => {
    if (!favorites.includes(icaoCode)) {
      setFavorites(prev => [...prev, icaoCode].sort());
      console.log(`Added ${icaoCode} to favorites`);
    }
  };

  const removeFavorite = (icaoCode: string) => {
    setFavorites(prev => prev.filter(code => code !== icaoCode));
    console.log(`Removed ${icaoCode} from favorites`);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    selectedFavorite,
    setSelectedFavorite,
  };
};
