"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

export function SafeImage({
  className,
  fallbackClassName,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-muted rounded-xl",
          fallbackClassName || className
        )}
      >
        <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
        <span className="text-xs text-muted-foreground font-medium">
          Image not available
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-full", className)}>
      {loading && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
      )}
      <img
        {...props}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
}
