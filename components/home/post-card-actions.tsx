"use client";

import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Heart,
  Bookmark,
  BarChart2,
  Repeat2,
  Share,
} from "lucide-react";
import { toggleLike, toggleBookmark } from "@/app/actions/post";
import { useState } from "react";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

interface PostCardActionsProps {
  postId: string;
  commentsCount: number;
  repostsCount: number;
  likesCount: number;
  impressionsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export function PostCardActions({
  postId,
  commentsCount,
  repostsCount,
  likesCount: initialLikesCount,
  impressionsCount,
  isLiked: initialIsLiked,
  isBookmarked: initialIsBookmarked,
}: PostCardActionsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Instant UI update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    // Sync in background
    toggleLike(postId).then((result) => {
      if (!result.success) {
        // Revert on failure
        setIsLiked(!newIsLiked);
        setLikesCount((prev) => (newIsLiked ? prev - 1 : prev + 1));
      }
    });
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Instant UI update
    const newIsBookmarked = !isBookmarked;
    setIsBookmarked(newIsBookmarked);

    // Sync in background
    toggleBookmark(postId).then((result) => {
      if (!result.success) {
        // Revert on failure
        setIsBookmarked(!newIsBookmarked);
      }
    });
  };

  return (
    <div className="mt-3 flex items-center justify-between max-w-[425px]">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 gap-1 text-muted-foreground hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <MessageCircle className="h-[18px] w-[18px]" />
        {commentsCount > 0 && (
          <span className="text-[13px]">{formatNumber(commentsCount)}</span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="gap-1 text-muted-foreground hover:text-[#00ba7c] hover:bg-[#00ba7c]/10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Repeat2 className="h-[18px] w-[18px]" />
        {repostsCount > 0 && (
          <span className="text-[13px]">{formatNumber(repostsCount)}</span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`gap-1 transition-colors ${
          isLiked
            ? "text-pink-600 hover:text-pink-700 hover:bg-pink-600/10"
            : "text-muted-foreground hover:text-pink-600 hover:bg-pink-600/10"
        }`}
        onClick={handleLike}
      >
        <Heart
          className={`h-[18px] w-[18px] ${isLiked ? "fill-current" : ""}`}
        />
        {likesCount > 0 && (
          <span className="text-[13px]">{formatNumber(likesCount)}</span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="gap-1 text-muted-foreground hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <BarChart2 className="h-[18px] w-[18px]" />
        {impressionsCount > 0 && (
          <span className="text-[13px]">{formatNumber(impressionsCount)}</span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`transition-colors ${
          isBookmarked
            ? "text-[#1d9bf0] hover:text-[#1a8cd8] hover:bg-[#1d9bf0]/10"
            : "text-muted-foreground hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
        }`}
        onClick={handleBookmark}
      >
        <Bookmark
          className={`h-[18px] w-[18px] ${isBookmarked ? "fill-current" : ""}`}
        />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="-mr-2 text-muted-foreground hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Share className="h-[18px] w-[18px]" />
      </Button>
    </div>
  );
}
