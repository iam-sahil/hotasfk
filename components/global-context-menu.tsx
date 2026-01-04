"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, RotateCw, Home } from "lucide-react";

export function GlobalContextMenu({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full min-h-screen">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </ContextMenuItem>
        <ContextMenuItem onClick={() => router.forward()}>
          <ChevronRight className="mr-2 h-4 w-4" />
          Forward
        </ContextMenuItem>
        <ContextMenuItem onClick={() => window.location.reload()}>
          <RotateCw className="mr-2 h-4 w-4" />
          Reload
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => router.push("/")}>
          <Home className="mr-2 h-4 w-4" />
          Home
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
