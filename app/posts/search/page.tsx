"use client";

import { api, Post } from "@/lib/api";
import { PostCard } from "@/components/post-card";
import { useSource } from "@/lib/source-context";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Search, X, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function PostsSearchPage() {
  const { source } = useSource();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    if (searchQuery === "") {
      setDebouncedSearch("");
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPosts = async (reset = false) => {
    setLoading(true);
    try {
      const currentOffset = reset ? 0 : offset;
      const data = await api.getRecentPosts(
        source,
        currentOffset,
        debouncedSearch
      );
      if (data.length === 0) {
        setHasMore(false);
        if (reset) setPosts([]);
      } else {
        setPosts((prev) => (reset ? data : [...prev, ...data]));
        setOffset(currentOffset + 50);
        setHasMore(data.length === 50);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchPosts(true);
  }, [source, debouncedSearch]);

  return (
    <div className="container py-8 space-y-8 relative">
      <div className="md:hidden mb-4">
        <SidebarTrigger />
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Search className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-black tracking-tighter">
              Browse Posts
            </h1>
          </div>
          <p className="text-muted-foreground">
            Explore the latest posts from all models.
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-9 pr-9 bg-muted/50 border-none rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post) => (
            <PostCard
              key={`${post.service}-${post.user}-${post.id}`}
              post={post}
            />
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <p className="text-muted-foreground font-medium">
            No posts found. Try a different search term.
          </p>
        </div>
      ) : null}

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && hasMore && posts.length > 0 && (
        <div className="flex justify-center py-8">
          <Button
            onClick={() => fetchPosts(false)}
            variant="outline"
            className="rounded-full px-8 font-bold"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
