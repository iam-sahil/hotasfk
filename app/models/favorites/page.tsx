"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { ArtistCard } from "@/components/artist-card";
import { Heart, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="container py-8 space-y-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Your Favorites</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your favorite models locally.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold">No favorites yet</h2>
          <p className="text-muted-foreground">
            Mark models as favorites to see them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((creator) => (
            <ArtistCard key={creator.id + creator.service} artist={creator} />
          ))}
        </div>
      )}
    </div>
  );
}
