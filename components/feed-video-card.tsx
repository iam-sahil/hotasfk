"use client";

import { useEffect, useRef, useState } from "react";
import { Post, api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, Music2, User, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FeedVideoCardProps {
  post: Post;
  videoUrl: string;
  onEnded?: () => void;
  volume?: number;
}

export function FeedVideoCard({
  post,
  videoUrl,
  onEnded,
  volume = 0.5,
}: FeedVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const source = api.getSourceFromService(post.service);
  const iconUrl = api.getIconUrl(post.service, post.user, source);

  useEffect(() => {
    if (videoRef.current && typeof volume === "number" && !isNaN(volume)) {
      videoRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              // Autoplay might be blocked by browser
              setIsPlaying(false);
            });
        } else {
          video.pause();
          setIsPlaying(false);
        }
      });
    }, options);

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center snap-start overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full object-contain cursor-pointer"
        playsInline
        onClick={togglePlay}
        onEnded={onEnded}
      />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-full animate-in fade-in zoom-in duration-300">
            <Play className="w-12 h-12 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-50">
        <div
          className="h-full bg-primary transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-4 bg-linear-to-t from-black/60 via-transparent to-transparent">
        <div className="flex justify-between items-end w-full pointer-events-auto">
          <div className="flex-1 pr-12">
            <Link
              href={`/user/${post.service}/${post.user}`}
              className="flex items-center gap-3 mb-3 group"
            >
              <Avatar className="w-10 h-10 border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
                <AvatarImage src={iconUrl} />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-lg drop-shadow-md">
                    @{post.user}
                  </span>
                  <Badge className="bg-primary text-primary-foreground border-none text-[10px] font-bold uppercase">
                    {post.service}
                  </Badge>
                </div>
              </div>
            </Link>
            <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 drop-shadow-md">
              {post.title || "Untitled Post"}
            </h3>
          </div>

          <div className="flex flex-col gap-6 items-center pb-4">
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
                onClick={() => window.open(videoUrl, "_blank")}
              >
                <Download className="w-6 h-6" />
              </Button>
              <span className="text-white text-[10px] font-bold">Download</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Link
                target="_blank"
                href={`/post/${post.service}/${post.user}/${post.id}`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
                >
                  <ExternalLink className="w-6 h-6" />
                </Button>
              </Link>
              <span className="text-white text-[10px] font-bold">
                View post
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
