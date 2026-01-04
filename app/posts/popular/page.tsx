"use client";

import { api, Post } from "@/lib/api";
import { PostCard } from "@/components/post-card";
import { useSource } from "@/lib/source-context";
import { useEffect, useState } from "react";
import { Loader2, TrendingUp, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PopularPostsPage() {
  const { source } = useSource();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("recent");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await api.getPopularPosts(source, period);
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch popular posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [source, period]);

  return (
    <div className="container py-8 space-y-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Popular Posts</h1>
          </div>
          <Select value={period} onValueChange={(v) => v && setPeriod(v)}>
            <SelectTrigger className="w-45">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground">
          See what's trending across the platform.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post) => (
            <PostCard
              key={`${post.service}-${post.user}-${post.id}`}
              post={post}
            />
          ))}
        </div>
      )}
    </div>
  );
}
