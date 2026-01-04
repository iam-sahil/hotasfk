"use client";

import { useEffect, useState, useMemo } from "react";
import { api, Creator } from "@/lib/api";
import { ArtistCard } from "@/components/artist-card";
import { useSource } from "@/lib/source-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2, Search, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ITEMS_PER_PAGE = 24;

export default function CreatorsSearchPage() {
  const { source } = useSource();
  const [allCreators, setAllCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      try {
        const data = await api.getCreators(source);
        setAllCreators(data);
      } catch (error) {
        console.error("Failed to fetch creators:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, [source]);

  const filteredCreators = useMemo(() => {
    let result = [...allCreators];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query)
      );
    }

    // Filter by service
    if (serviceFilter !== "all") {
      result = result.filter(
        (c) => c.service.toLowerCase() === serviceFilter.toLowerCase()
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "popularity") {
        return (b.favorited || 0) - (a.favorited || 0);
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "indexed") {
        return (b.indexed || 0) - (a.indexed || 0);
      }
      return 0;
    });

    return result;
  }, [allCreators, searchQuery, serviceFilter, sortBy]);

  const totalPages = Math.ceil(filteredCreators.length / ITEMS_PER_PAGE);
  const paginatedCreators = filteredCreators.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, serviceFilter, sortBy]);

  const services = Array.from(
    new Set(allCreators.map((c) => c.service))
  ).sort();

  return (
    <div className="container py-8 space-y-8">
      <div className="md:hidden mb-4">
        <SidebarTrigger />
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Search Creators</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search creators..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={serviceFilter}
            onValueChange={(v) => setServiceFilter(v ?? "all")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {services.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v ?? "popularity")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="indexed">Recently Indexed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedCreators.map((creator) => (
              <ArtistCard key={creator.id + creator.service} artist={creator} />
            ))}
          </div>

          {filteredCreators.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No creators found matching your criteria.
            </div>
          )}

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    Next
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
