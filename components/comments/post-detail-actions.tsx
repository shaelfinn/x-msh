"use client";

import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Heart,
  Bookmark,
  BarChart2,
  Send,
  Share,
} from "lucide-react";
import { toggleLike, toggleBookmark } from "@/app/actions/post";
import { useState, useTransition } from "react";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

interface PostDetailActionsProps {
  postId: string;
  commentsCount: number;
  likesCount: number;
  impressionsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export function PostDetailActions({
  postId,
  commentsCount,
  likesCount: initialLikesCount,
  impressionsCount,
  isLiked: initialIsLiked,
  isBookmarked: initialIsBookmarked,
}: PostDetailActionsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    startTransition(async () => {
      const result = await toggleLike(postId);
      if (!result.success) {
        setIsLiked(!newIsLiked);
        setLikesCount((prev) => (newIsLiked ? prev - 1 : prev + 1));
      }
    });
  };

  const handleBookmark = () => {
    const newIsBookmarked = !isBookmarked;
    setIsBookmarked(newIsBookmarked);

    startTransition(async () => {
      const result = await toggleBookmark(postId);
      if (!result.success) {
        setIsBookmarked(!newIsBookmarked);
      }
    });
  };

  return (
    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-muted-foreground hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        {commentsCount > 0 && (
          <span className="text-[13px]">{formatNumber(commentsCount)}</span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-muted-foreground hover:text-[#00ba7c] hover:bg-[#00ba7c]/10 transition-colors"
      >
        <Send className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`h-8 gap-1.5 transition-colors ${
          isLiked
            ? "text-pink-600 hover:text-pink-700 hover:bg-pink-600/10"
            : "text-muted-foreground hover:text-pink-600 hover:bg-pink-600/10"
        }`}
        onClick={handleLike}
        disabled={isPending}
      >
        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        {likesCount > 0 && (
          <span className="text-[13px]">{formatNumber(likesCount)}</span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        <BarChart2 className="h-4 w-4" />
        {impressionsCount > 0 && (
          <span className="text-[13px]">{formatNumber(impressionsCount)}</span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`h-8 transition-colors ${
          isBookmarked
            ? "text-[#1d9bf0] hover:text-[#1a8cd8] hover:bg-[#1d9bf0]/10"
            : "text-muted-foreground hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
        }`}
        onClick={handleBookmark}
        disabled={isPending}
      >
        <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-muted-foreground hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 transition-colors"
      >
        <Share className="h-4 w-4" />
      </Button>
    </div>
  );
}
