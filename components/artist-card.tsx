"use client";

import { Creator, api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useFavorites } from "@/hooks/use-favorites";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";

interface ArtistCardProps {
  artist: Creator;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(artist);
  const source = api.getSourceFromService(artist.service);

  const iconUrl = api.getIconUrl(artist.service, artist.id, source);
  const bannerUrl = api.getBannerUrl(artist.service, artist.id, source);

  return (
    <div className="relative group h-full">
      <Link
        href={`/user/${artist.service}/${artist.id}`}
        className="h-full block"
      >
        <Card className="overflow-hidden bg-muted/30 border-none hover:bg-muted/50 transition-all cursor-pointer h-full flex flex-col">
          <div className="relative aspect-video overflow-hidden bg-muted">
            {/* Banner */}
            <SafeImage
              src={bannerUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-background shadow-2xl group-hover:border-primary/50 transition-colors shrink-0">
                  <AvatarImage src={iconUrl} />
                  <AvatarFallback className="bg-muted text-lg font-bold">
                    {artist.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 overflow-hidden">
                  <Badge
                    variant="secondary"
                    className="w-fit text-[10px] uppercase font-bold bg-primary text-primary-foreground hover:bg-primary/90 border-none mb-1"
                  >
                    {artist.service}
                  </Badge>
                  <h3 className="font-bold text-white text-base leading-tight truncate w-full">
                    {artist.name}
                  </h3>
                  <p className="text-[10px] text-gray-300 flex items-center gap-1">
                    {artist.favorited?.toLocaleString() || 0} favorites
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 z-10 text-white hover:text-red-500 hover:bg-black/20"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(artist);
        }}
      >
        <Heart
          className={`w-5 h-5 ${isFav ? "fill-red-500 text-red-500" : ""}`}
        />
      </Button>
    </div>
  );
}
