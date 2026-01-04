"use client";

import { api, Post } from "@/lib/api";
import { useSource } from "@/lib/source-context";
import { useEffect, useState, useRef } from "react";
import { FeedVideoCard } from "@/components/feed-video-card";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Clapperboard,
  ChevronDown,
  Loader2,
  Heart,
  Volume2,
} from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { Slider } from "@/components/ui/slider";

export default function FeedPage() {
  const { source } = useSource();
  const { favorites } = useFavorites();
  const [videoPosts, setVideoPosts] = useState<{ post: Post; url: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchVideos = async (currentOffset: number) => {
    try {
      if (favorites.length === 0) return [];

      // Fetch posts for each favorite in parallel
      // We limit to first page for each favorite to keep it snappy
      const favoritePostsPromises = favorites.map((fav) =>
        api.getCreatorPosts(fav.service, fav.id, source, currentOffset)
      );

      const results = await Promise.allSettled(favoritePostsPromises);
      const allPosts: Post[] = [];

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          allPosts.push(...result.value);
        }
      });

      const videos: { post: Post; url: string }[] = [];

      allPosts.forEach((post) => {
        const postSource = api.getSourceFromService(post.service);
        // Check main file
        if (post.file?.path?.match(/\.(mp4|webm|mov)$/i)) {
          videos.push({
            post,
            url: api.getMediaUrl(post.file.path, postSource),
          });
        }
        // Check attachments
        post.attachments?.forEach((att) => {
          if (att.path?.match(/\.(mp4|webm|mov)$/i)) {
            videos.push({
              post,
              url: api.getMediaUrl(att.path, postSource),
            });
          }
        });
      });

      // Sort by date (newest first) and remove duplicates (if any)
      const uniqueVideos = Array.from(
        new Map(videos.map((v) => [v.url, v])).values()
      );

      // Randomize the order using Fisher-Yates shuffle
      const shuffled = [...uniqueVideos];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    } catch (error) {
      console.error("Failed to fetch videos for feed:", error);
      return [];
    }
  };

  useEffect(() => {
    const initFeed = async () => {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const videos = await fetchVideos(0);
      setVideoPosts(videos);
      setLoading(false);
    };
    initFeed();
  }, [source, favorites]);

  const handleScroll = async () => {
    if (!containerRef.current || isFetchingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setIsFetchingMore(true);
      const nextOffset = offset + 50;
      const newVideos = await fetchVideos(nextOffset);
      setVideoPosts((prev) => [...prev, ...newVideos]);
      setOffset(nextOffset);
      setIsFetchingMore(false);
    }
  };

  const scrollToNext = (index: number) => {
    if (containerRef.current) {
      const nextIndex = index + 1;
      const children = containerRef.current.children;
      if (nextIndex < children.length) {
        children[nextIndex].scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-2rem)] w-full flex items-center justify-center bg-black rounded-3xl overflow-hidden">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-white/50 font-bold animate-pulse">
            Loading your feed...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-2rem)] max-w-xl mx-auto rounded-2xl mt-2 w-full bg-black overflow-hidden shadow-2xl border border-white/10">
      <div className="absolute top-4 left-4 z-50 md:hidden">
        <SidebarTrigger className="text-white bg-black/20 backdrop-blur-md rounded-full" />
      </div>

      <div className="absolute top-6 right-6 z-50 pointer-events-auto group">
        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-black/40 transition-all">
          <Volume2 className="w-4 h-4 text-white shrink-0" />
          <div className="w-0 group-hover:w-24 transition-all duration-300 overflow-hidden">
            <Slider
              value={[volume * 100]}
              step={10}
              max={100}
              onValueChange={(vals) => {
                const newVal = Array.isArray(vals) ? vals[0] : vals;
                if (typeof newVal === "number" && !isNaN(newVal)) {
                  setVolume(newVal / 100);
                }
              }}
              className="w-24"
            />
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      >
        {videoPosts.map((item, index) => (
          <FeedVideoCard
            key={`${item.post.id}-${index}`}
            post={item.post}
            videoUrl={item.url}
            onEnded={() => scrollToNext(index)}
            volume={volume}
          />
        ))}

        {isFetchingMore && (
          <div className="h-full w-full flex items-center justify-center snap-start bg-black">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {videoPosts.length === 0 && (
          <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center">
            {favorites.length === 0 ? (
              <>
                <Heart className="w-16 h-16 text-primary mb-4 opacity-20" />
                <h2 className="text-xl font-bold text-white mb-2">
                  No Favorites Yet
                </h2>
                <p className="text-white/50 text-sm">
                  Add some models to your favorites to see their videos here!
                </p>
              </>
            ) : (
              <>
                <Clapperboard className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
                <h2 className="text-xl font-bold text-white mb-2">
                  No videos found
                </h2>
                <p className="text-white/50 text-sm">
                  None of your favorite models have posted videos recently on
                  this source.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
