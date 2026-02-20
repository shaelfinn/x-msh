import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Heart,
  Bookmark,
  MoreHorizontal,
  BarChart2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

interface PostCardProps {
  id: number;
  author: string;
  username: string;
  createdAt: string;
  content: string;
  imageUrl?: string;
  avatarUrl: string;
  commentsCount?: number;
  likesCount?: number;
  impressionsCount?: number;
}

export function PostCard({
  id,
  author,
  username,
  createdAt,
  content,
  imageUrl,
  avatarUrl,
  commentsCount = 0,
  likesCount = 0,
  impressionsCount = 0,
}: PostCardProps) {
  return (
    <Link
      href={`/${username}/post/${id}`}
      className="block border-b border-border p-4 transition-colors hover:bg-muted/30"
    >
      <div className="flex gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={author} />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-hidden">
              <span className="max-w-[150px] truncate font-bold hover:underline">
                {author}
              </span>
              <span className="shrink-0 text-muted-foreground">
                @{username}
              </span>
              <span className="shrink-0 text-muted-foreground">·</span>
              <span className="shrink-0 text-muted-foreground">
                {createdAt}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-1 whitespace-pre-wrap">{content}</p>
          {imageUrl && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-border">
              <Image
                src={imageUrl}
                alt="Post image"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
          )}
          <div className="mt-3 flex max-w-md justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{formatNumber(commentsCount)}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-pink-600"
            >
              <Heart className="h-5 w-5" />
              <span className="text-sm">{formatNumber(likesCount)}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-primary"
            >
              <BarChart2 className="h-5 w-5" />
              <span className="text-sm">{formatNumber(impressionsCount)}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
            >
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
