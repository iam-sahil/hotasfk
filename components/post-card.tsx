import { Post, api } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { Video } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const date = new Date(post.published || post.added);
  const source = api.getSourceFromService(post.service);

  const isVideo = (path?: string) => path?.match(/\.(mp4|webm|mov)$/i);
  const isImage = (path?: string) => path?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  const mainFile = post.file?.path;
  const attachments = post.attachments || [];

  let thumbnailType: "image" | "video" | null = null;
  let thumbnailUrl: string | null = null;

  if (mainFile) {
    if (isImage(mainFile)) {
      thumbnailType = "image";
      thumbnailUrl = api.getMediaUrl(mainFile, source);
    } else if (isVideo(mainFile)) {
      thumbnailType = "video";
      thumbnailUrl = api.getMediaUrl(mainFile, source);
    }
  }

  if (!thumbnailUrl) {
    const firstImage = attachments.find((att) => isImage(att.path));
    if (firstImage) {
      thumbnailType = "image";
      thumbnailUrl = api.getMediaUrl(firstImage.path, source);
    } else {
      const firstVideo = attachments.find((att) => isVideo(att.path));
      if (firstVideo) {
        thumbnailType = "video";
        thumbnailUrl = api.getMediaUrl(firstVideo.path, source);
      }
    }
  }

  const iconUrl = api.getIconUrl(post.service, post.user, source);

  return (
    <Link href={`/post/${post.service}/${post.user}/${post.id}`}>
      <Card className="overflow-hidden bg-muted/30 border-none hover:bg-muted/50 transition-colors h-full flex flex-col">
        <CardHeader className="p-4 flex flex-row items-center gap-3 space-y-0">
          <Avatar className="w-10 h-10 border border-border/50">
            <AvatarImage src={iconUrl} />
            <AvatarFallback>{post.user[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm truncate max-w-30">
                {post.user}
              </span>
              <Badge
                variant="outline"
                className="text-[10px] h-4 px-1 uppercase"
              >
                {post.service}
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(date)} ago
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          {thumbnailUrl && (
            <div className="relative aspect-square bg-black/20 flex items-center justify-center overflow-hidden">
              {thumbnailType === "image" ? (
                <SafeImage
                  src={thumbnailUrl}
                  alt={post.title}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <video
                  src={thumbnailUrl}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  muted
                  playsInline
                  preload="metadata"
                />
              )}
              {thumbnailType === "video" && (
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1 rounded-xl z-10">
                  <Video className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          )}
          <div className="p-4 flex-1">
            <h4 className="font-semibold text-sm line-clamp-2 mb-2">
              {post.title || "Untitled Post"}
            </h4>
            {(post.substring || post.content) && (
              <div
                className="text-xs text-muted-foreground line-clamp-3 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: post.substring || post.content,
                }}
              />
            )}
            {post.attachments?.length > 0 && (
              <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  {post.attachments.length} attachments
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
