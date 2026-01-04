import { Post, api } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const date = new Date(post.published || post.added);
  const source = api.getSourceFromService(post.service);

  const mediaUrl = post.file?.path
    ? api.getMediaUrl(post.file.path, source)
    : null;
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
          {mediaUrl && (
            <div className="relative aspect-square bg-black/20 flex items-center justify-center overflow-hidden">
              <SafeImage
                src={mediaUrl}
                alt={post.title}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
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
