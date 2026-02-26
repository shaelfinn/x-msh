import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, BarChart2, Bookmark, MoreHorizontal } from "lucide-react";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

interface CommentItemProps {
  author: string;
  username: string;
  avatarUrl: string | null;
  content: string;
  createdAt: string;
  likesCount: number;
  impressionsCount: number;
}

export function CommentItem({
  author,
  username,
  avatarUrl,
  content,
  createdAt,
  likesCount,
  impressionsCount,
}: CommentItemProps) {
  return (
    <div className="border-b border-border p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl || undefined} alt={author} />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-bold hover:underline">{author}</span>
              <span className="text-muted-foreground">@{username}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{createdAt}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1 whitespace-pre-wrap">{content}</p>
          <div className="mt-2 flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-pink-600"
            >
              <Heart className="h-4 w-4" />
              {likesCount > 0 && (
                <span className="text-sm">{formatNumber(likesCount)}</span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-primary"
            >
              <BarChart2 className="h-4 w-4" />
              {impressionsCount > 0 && (
                <span className="text-sm">
                  {formatNumber(impressionsCount)}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
