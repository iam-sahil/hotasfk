"use client";

import { api, Post } from "@/lib/api";
import { PostCard } from "@/components/post-card";
import { useSource } from "@/lib/source-context";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function RecentPostsPage() {
  const { source } = useSource();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await api.getRecentPosts(source);
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch recent posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [source]);

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary">
          <Clock className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">
            Live Feed
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
          Recent Posts
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Stay up to date with the latest content from all your favorite
          creators.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-3/4 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <p className="text-muted-foreground font-medium">
            No posts found. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
