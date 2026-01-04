"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, Post, Creator, CreatorProfile } from "@/lib/api";
import { PostCard } from "@/components/post-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/ui/safe-image";
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Share2,
  FileText,
  MessageSquare,
  Users,
  ArrowUpDown,
  Search,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArtistCard } from "@/components/artist-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreatorProfilePage() {
  const params = useParams();
  const service = params.service as string;
  const id = params.id as string;

  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [recommended, setRecommended] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [filterType, setFilterType] = useState<"all" | "videos">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { isFavorite, toggleFavorite } = useFavorites();
  const source = api.getSourceFromService(service);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setOffset(0); // Reset offset on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Fetch full profile info
        const profile = await api.getProfile(service, id, source);
        setCreator(profile);

        // Fetch posts
        const newPosts = await api.getCreatorPosts(
          service,
          id,
          source,
          offset,
          debouncedSearch
        );

        // Sort posts
        const sortedPosts = [...newPosts].sort((a, b) => {
          const dateA = new Date(a.published || a.added).getTime();
          const dateB = new Date(b.published || b.added).getTime();
          return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });

        setPosts(sortedPosts);
        setHasMore(newPosts.length === 50);
      } catch (error) {
        console.error("Failed to load creator profile:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [service, id, source, offset, sortBy, debouncedSearch]);

  const fetchRecommended = async () => {
    if (recommended.length > 0) return;
    setLoadingRecommended(true);
    try {
      const data = await api.getRecommendedCreators(service, id, source);
      setRecommended(data);
    } catch (error) {
      console.error("Failed to fetch recommended creators:", error);
      toast.error("Failed to load similar creators");
    } finally {
      setLoadingRecommended(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Profile URL copied to clipboard!");
  };

  const iconUrl = api.getIconUrl(service, id, source);
  const bannerUrl = api.getBannerUrl(service, id, source);
  const isFav = creator ? isFavorite(creator) : false;

  const filteredPosts = posts.filter((post) => {
    if (filterType === "all") return true;
    const hasVideo =
      post.file?.path?.match(/\.(mp4|webm|mov)$/i) ||
      post.attachments?.some((att) => att.path?.match(/\.(mp4|webm|mov)$/i));
    return hasVideo;
  });

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/creators/search">Models</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{creator?.name || id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-col gap-8 pb-10">
        {/* Header Section */}
        <div className="relative">
          <div className="h-48 md:h-64 w-full bg-muted rounded-3xl overflow-hidden relative">
            <SafeImage
              src={bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
              fallbackClassName="h-48 md:h-64 w-full bg-linear-to-r from-primary/20 via-muted to-primary/10"
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          </div>

          <div className="px-6 -mt-12 md:-mt-16 flex flex-col md:flex-row items-end gap-6">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-2xl">
              <AvatarImage src={iconUrl} />
              <AvatarFallback className="text-4xl font-bold">
                {creator?.name?.[0] || id[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
                  {creator?.name || id}
                </h1>
                <Badge
                  variant="secondary"
                  className="uppercase font-bold bg-primary text-primary-foreground"
                >
                  {service}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span className="font-bold text-foreground">
                    {creator?.post_count?.toLocaleString() || 0}
                  </span>{" "}
                  posts
                </span>
                {(creator?.chat_count || 0) > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-bold text-foreground">
                      {creator?.chat_count?.toLocaleString() || 0}
                    </span>{" "}
                    chats
                  </span>
                )}
                <span className="flex items-center gap-1">
                  Updated:{" "}
                  {creator?.updated
                    ? typeof creator.updated === "number"
                      ? new Date(creator.updated * 1000).toLocaleDateString()
                      : new Date(creator.updated).toLocaleDateString()
                    : "recently"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pb-2">
              <Dialog onOpenChange={(open) => open && fetchRecommended()}>
                <DialogTrigger>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    title="Similar Creators"
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Similar Creators</DialogTitle>
                  </DialogHeader>
                  {loadingRecommended ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-xl" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
                      {recommended.map((artist) => (
                        <ArtistCard key={artist.id} artist={artist} />
                      ))}
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
              </Button>

              <Button
                className={`rounded-full gap-2 font-bold ${
                  isFav ? "bg-red-500 hover:bg-red-600 text-white" : ""
                }`}
                onClick={() => creator && toggleFavorite(creator)}
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
                {isFav ? "Favorited" : "Add to Favorites"}
              </Button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="px-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-9 bg-muted/50 border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tabs
                value={filterType}
                onValueChange={(v) => setFilterType(v as "all" | "videos")}
                className="mr-2"
              >
                <TabsList className="h-9 bg-muted/50 border-none">
                  <TabsTrigger
                    value="all"
                    className="gap-2 rounded-full text-xs font-bold"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    className="gap-2 rounded-full text-xs font-bold"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Videos
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    setSortBy(sortBy === "newest" ? "oldest" : "newest")
                  }
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {sortBy === "newest" ? "Newest First" : "Oldest First"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset === 0 || loading}
                  onClick={() => setOffset(Math.max(0, offset - 50))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {posts.length > 0 && (
                  <div className="px-3 text-xs font-medium text-muted-foreground bg-muted/30 h-8 flex items-center rounded-full border border-border/50">
                    Showing {offset + 1} -{" "}
                    {Math.min(offset + posts.length, creator?.post_count || 0)}{" "}
                    of {creator?.post_count || 0}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    !hasMore ||
                    loading ||
                    (creator?.post_count !== undefined &&
                      offset + 50 >= creator.post_count)
                  }
                  onClick={() => setOffset(offset + 50)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-3/4 rounded-2xl" />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
              <p className="text-muted-foreground font-medium">
                No {filterType === "videos" ? "videos" : "posts"} found for this
                creator.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
