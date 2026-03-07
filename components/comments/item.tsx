import { UserAvatar } from "@/components/ui/user-avatar";
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
    <div className="border-b border-border px-4 py-3 transition-colors hover:bg-muted/30">
      <div className="flex gap-2">
        <UserAvatar
          src={avatarUrl}
          name={author}
          className="h-8 w-8 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[13px] font-semibold hover:underline truncate">
              {author}
            </span>
            <span className="text-[12px] text-muted-foreground">
              @{username}
            </span>
            <span className="text-[12px] text-muted-foreground">·</span>
            <span className="text-[12px] text-muted-foreground shrink-0">
              {createdAt}
            </span>
            <div className="ml-auto">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-[14px] leading-5 mb-1">
            {content}
          </p>
          <div className="flex gap-0.5 -ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-muted-foreground hover:text-pink-600 hover:bg-pink-600/10 transition-colors"
            >
              <Heart className="h-3.5 w-3.5" />
              {likesCount > 0 && (
                <span className="text-[12px]">{formatNumber(likesCount)}</span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <BarChart2 className="h-3.5 w-3.5" />
              {impressionsCount > 0 && (
                <span className="text-[12px]">
                  {formatNumber(impressionsCount)}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 transition-colors"
            >
              <Bookmark className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
