"use client";

import * as React from "react";
import {
  Home,
  Users,
  FileText,
  Search,
  Sparkles,
  Dices,
  TrendingUp,
  Hash,
  X,
  Globe,
  Heart,
  Flame,
  File,
  Shield,
  Clapperboard,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInput,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useSource } from "@/lib/source-context";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { source, setSource } = useSource();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("");

  const isActive = (path: string) => pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Link parsing logic
    const url = searchQuery.trim().toLowerCase();
    let service = "";
    let username = "";

    if (url.includes("onlyfans.com/")) {
      service = "onlyfans";
      username = url.split("onlyfans.com/")[1].split("/")[0].split("?")[0];
    } else if (url.includes("fansly.com/")) {
      service = "fansly";
      username = url.split("fansly.com/")[1].split("/")[0].split("?")[0];
    } else if (url.includes("patreon.com/")) {
      service = "patreon";
      username = url.split("patreon.com/")[1].split("/")[0].split("?")[0];
    } else if (url.includes("candygirl.com/")) {
      service = "candygirl";
      username = url.split("candygirl.com/")[1].split("/")[0].split("?")[0];
    } else if (url.includes("gumroad.com/")) {
      service = "gumroad";
      username = url.split("gumroad.com/")[1].split("/")[0].split("?")[0];
    }

    if (service && username) {
      router.push(`/user/${service}/${username}`);
    } else {
      router.push(`/models/search?q=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery("");
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Flame className="w-6 h-6 text-primary" />
            <span className="text-primary">hot as fk</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <SidebarInput
            placeholder="Paste onlyfans or fansly link..."
            className="pl-8 bg-muted/50 border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/" className="flex items-center gap-2">
                  <SidebarMenuButton
                    className={cn(
                      "transition-all duration-200",
                      isActive("/") &&
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/feed" className="flex items-center gap-2">
                  <SidebarMenuButton
                    className={cn(
                      "transition-all duration-200",
                      isActive("/feed") &&
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Clapperboard className="w-4 h-4" />
                    <span>Feed</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link
                  target="_blank"
                  href="https://danhub.vercel.app/"
                  className="flex items-center gap-2"
                >
                  <SidebarMenuButton className="transition-all duration-200">
                    <Flame className="w-4 h-4" />
                    <span>Our Hentai Site</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-2 py-1 text-foreground font-semibold">
            Models
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/models/search" className="flex items-center gap-2">
                  <SidebarMenuButton
                    className={cn(
                      "transition-all duration-200",
                      isActive("/models/search") &&
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/models/random" className="flex items-center gap-2">
                  <SidebarMenuButton
                    className={cn(
                      "transition-all duration-200",
                      isActive("/models/random") &&
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Dices className="w-4 h-4" />
                    <span>Random</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link
                  href="/models/favorites"
                  className="flex items-center gap-2"
                >
                  <SidebarMenuButton
                    className={cn(
                      "transition-all duration-200",
                      isActive("/models/favorites") &&
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Favorites</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-2 py-1 text-foreground font-semibold">
            Posts
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/posts/search" className="flex items-center gap-2">
                  <SidebarMenuButton
                    className={cn(
                      "transition-all duration-200",
                      isActive("/posts/search") &&
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/posts/random" className="flex items-center gap-2">
                  <SidebarMenuButton
                    className={cn(
                      "transition-all duration-200",
                      isActive("/posts/random") &&
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Dices className="w-4 h-4" />
                    <span>Random</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/posts/popular" className="flex items-center gap-2">
                  <SidebarMenuButton
                    className={cn(
                      "transition-all duration-200",
                      isActive("/posts/popular") &&
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Popular</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/" className="flex items-center gap-2">
                  <SidebarMenuButton className="transition-all duration-200">
                    <FileText className="w-4 h-4" />
                    <span>Terms of Service</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/" className="flex items-center gap-2">
                  <SidebarMenuButton className="transition-all duration-200">
                    <Shield className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3" />
          <span>
            Built using the{" "}
            <Link target="_blank" href="https://coomer.st">
              coomer.st
            </Link>{" "}
            API
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
