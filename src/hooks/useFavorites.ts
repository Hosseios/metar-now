
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
        }
      } catch (error) {
        // Error parsing saved favorites - silently ignore
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("metarFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (icaoCode: string) => {
    if (!favorites.includes(icaoCode)) {
      setFavorites(prev => [...prev, icaoCode].sort());
    }
  };

  const removeFavorite = (icaoCode: string) => {
    setFavorites(prev => prev.filter(code => code !== icaoCode));
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    selectedFavorite,
    setSelectedFavorite,
  };
};
