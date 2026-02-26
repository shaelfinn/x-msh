"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Bookmark, BarChart2 } from "lucide-react";
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
    <div className="mt-4 flex justify-around border-y border-border py-3">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-primary"
      >
        <MessageCircle className="h-5 w-5" />
        {commentsCount > 0 && (
          <span className="text-sm">{formatNumber(commentsCount)}</span>
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`gap-2 transition-colors ${
          isLiked
            ? "text-pink-600 hover:text-pink-700"
            : "text-muted-foreground hover:text-pink-600"
        }`}
        onClick={handleLike}
        disabled={isPending}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        {likesCount > 0 && (
          <span className="text-sm">{formatNumber(likesCount)}</span>
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-primary"
      >
        <BarChart2 className="h-5 w-5" />
        {impressionsCount > 0 && (
          <span className="text-sm">{formatNumber(impressionsCount)}</span>
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`transition-colors ${
          isBookmarked
            ? "text-[#1d9bf0] hover:text-[#1a8cd8]"
            : "text-muted-foreground hover:text-primary"
        }`}
        onClick={handleBookmark}
        disabled={isPending}
      >
        <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
      </Button>
    </div>
  );
}
