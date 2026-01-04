"use client";

import { api, Post } from "@/lib/api";
import { useSource } from "@/lib/source-context";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SafeImage } from "@/components/ui/safe-image";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function PostPage() {
  const { source } = useSource();
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await api.getPost(
          params.service as string,
          params.user as string,
          params.id as string,
          source
        );
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [source, params.service, params.user, params.id]);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-150 w-full rounded-3xl" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="text-muted-foreground">
          The post you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  const postSource = api.getSourceFromService(post.service);
  const mediaUrl = post.file?.path
    ? api.getMediaUrl(post.file.path, postSource)
    : null;
  const iconUrl = api.getIconUrl(post.service, post.user, postSource);

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
                <BreadcrumbLink href={`/user/${post.service}/${post.user}`}>
                  {post.user}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Post</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-8 max-w-5xl mx-auto w-full px-4 pb-20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="uppercase font-bold">
              {post.service}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Published on{" "}
              {format(new Date(post.published || post.added), "PPP")}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            {post.title || "Untitled Post"}
          </h1>
        </div>

        {/* Main Media */}
        {mediaUrl && (
          <div className="rounded-3xl overflow-hidden bg-black/20 border border-border/50 shadow-2xl">
            {post.file?.path.match(/\.(mp4|webm|mov)$/i) ? (
              <video
                src={mediaUrl}
                controls
                className="w-full h-auto max-h-[80vh]"
              />
            ) : (
              <SafeImage
                src={mediaUrl}
                alt={post.title}
                className="w-full h-auto object-contain max-h-[80vh]"
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {post.content && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Content
                </h3>
                <div
                  className="prose prose-invert max-w-none bg-muted/20 p-8 rounded-3xl border border-border/50 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            )}

            {/* Rendered Attachments */}
            {post.attachments?.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Attachments ({post.attachments.length})
                </h3>
                <div className="flex flex-col gap-6">
                  {post.attachments.map((att, i) => {
                    const attUrl = api.getMediaUrl(att.path, postSource);
                    const isVideo = att.path.match(/\.(mp4|webm|mov)$/i);

                    return (
                      <div
                        key={i}
                        className="rounded-3xl overflow-hidden bg-black/20 border border-border/50 shadow-lg"
                      >
                        {isVideo ? (
                          <div className="relative group">
                            <video
                              src={attUrl}
                              controls
                              className="w-full h-auto max-h-[80vh]"
                            />
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                              <Play className="w-3 h-3 fill-white" />
                              Video Attachment
                            </div>
                          </div>
                        ) : (
                          <div className="relative group">
                            <SafeImage
                              src={attUrl}
                              alt={att.name || `Attachment ${i + 1}`}
                              className="w-full h-auto object-contain max-h-[80vh]"
                            />
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                              <ImageIcon className="w-3 h-3" />
                              Image Attachment
                            </div>
                            <a
                              href={attUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Button
                                size="sm"
                                variant="secondary"
                                className="rounded-full h-8 w-8 p-0"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </a>
                          </div>
                        )}
                        <div className="p-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
                          <span className="text-sm font-medium truncate max-w-[70%]">
                            {att.name || `Attachment ${i + 1}`}
                          </span>
                          <a href={attUrl} download={att.name}>
                            <Button size="sm" variant="ghost" className="gap-2">
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Navigation */}
        <div className="fixed bottom-6 left-0 md:left-(--sidebar-width) right-0 pointer-events-none z-50 px-6 transition-[left] duration-300 ease-linear">
          <div className="flex justify-between items-center w-full">
            {post.prev ? (
              <Link
                href={`/post/${post.service}/${post.user}/${post.prev}`}
                className="pointer-events-auto"
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-12 h-12 rounded-full shadow-2xl border border-border/50 bg-background/80 backdrop-blur-xl hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {post.next ? (
              <Link
                href={`/post/${post.service}/${post.user}/${post.next}`}
                className="pointer-events-auto"
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-12 h-12 rounded-full shadow-2xl border border-border/50 bg-background/80 backdrop-blur-xl hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
