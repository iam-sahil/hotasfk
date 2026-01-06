"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Flame, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/models/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-2rem)] relative p-4">
      <div className="absolute top-4 left-4 md:hidden">
        <SidebarTrigger />
      </div>
      <div className="w-full max-w-3xl space-y-8 md:space-y-12 justify-center items-center flex flex-col text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary mb-2 md:mb-6">
            <Flame className="w-10 h-10" />
            <span className="text-3xl font-black">hot as fk</span>
          </div>
          <p className="text-muted-foreground max-w-xs md:max-w-none mx-auto">
            Discover the hottest models and posts from your favorite platforms.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="relative w-full max-w-md flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              className="pl-10 h-12 bg-muted/50 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" size="icon" className="h-12 w-12 shrink-0">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="relative py-6 w-full max-w-[500px]">
          <Image
            src="/bg.png"
            alt="background"
            width={500}
            height={300}
            className="w-full h-auto block"
            priority
          />
          <div className="absolute inset-0 bg-primary/50 mix-blend-multiply pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
