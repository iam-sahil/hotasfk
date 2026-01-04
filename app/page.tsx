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
    <div className="flex flex-col items-center justify-center h-[calc(100vh-2rem)] relative">
      <div className="absolute top-4 left-4 md:hidden">
        <SidebarTrigger />
      </div>
      <div className="w-full max-w-3xl space-y-12 justify-center items-center flex flex-col text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary mb-6">
            <Flame className="w-10 h-10" />
            <span className="text-3xl font-black">hot as fk</span>
          </div>
          <p className="text-muted-foreground">
            Discover the hottest models and posts from your favorite platforms.
          </p>
        </div>

        <div className="relative flex-1 min-w-xl">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative py-6 inline-block">
          <Image
            src="/bg.png"
            alt="background"
            width={500}
            height={300}
            className="block"
          />
          <div className="absolute inset-0 bg-primary/50 mix-blend-multiply pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
