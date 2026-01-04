"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Flame, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/creators/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative">
      <div className="absolute top-4 left-4 md:hidden">
        <SidebarTrigger />
      </div>
      <div className="w-full max-w-3xl space-y-12 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary mb-6">
            <Flame className="w-10 h-10" />
            <span className="text-2xl font-black tracking-tighter">
              hot as fk
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
            Search. Discover. <br />
            <span className="text-muted-foreground/50">Explore.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto font-medium">
            The minimal aggregator for your favorite creators across multiple
            platforms.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="relative group max-w-2xl mx-auto w-full"
        >
          <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl opacity-50 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative flex items-center">
            <Search className="absolute left-5 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search creators..."
              className="h-16 pl-14 pr-32 text-lg rounded-2xl border-none bg-muted/50 backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 h-12 px-6 rounded-xl font-bold gap-2"
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-6 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
          <button
            onClick={() => router.push("/creators/search")}
            className="hover:text-primary transition-colors"
          >
            Creators
          </button>
          <button
            onClick={() => router.push("/posts/popular")}
            className="hover:text-primary transition-colors"
          >
            Popular
          </button>
          <button
            onClick={() => router.push("/creators/random")}
            className="hover:text-primary transition-colors"
          >
            Random
          </button>
        </div>
      </div>
    </div>
  );
}
