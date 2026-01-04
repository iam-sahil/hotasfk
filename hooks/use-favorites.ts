"use client";

import { useState, useEffect } from "react";
import { Creator } from "@/lib/api";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Creator[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  const toggleFavorite = (creator: Creator) => {
    setFavorites((prev) => {
      const exists = prev.find(
        (c) => c.id === creator.id && c.service === creator.service
      );
      let newFavorites;
      if (exists) {
        newFavorites = prev.filter(
          (c) => !(c.id === creator.id && c.service === creator.service)
        );
      } else {
        newFavorites = [...prev, creator];
      }
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (creator: Creator) => {
    return favorites.some(
      (c) => c.id === creator.id && c.service === creator.service
    );
  };

  return { favorites, toggleFavorite, isFavorite };
}
