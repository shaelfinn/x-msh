"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostCardActions } from "./post-card-actions";
import { ImpressionTracker } from "./impression-tracker";
import { UserAvatar } from "@/components/ui/user-avatar";

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
  id: string;
  author: string;
  username: string;
  createdAt: string;
  content: string;
  images?: string[] | null;
  avatarUrl?: string | null;
  bio?: string | null;
  commentsCount?: number;
  repostsCount?: number;
  likesCount?: number;
  impressionsCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export function PostCard({
  id,
  author,
  username,
  createdAt,
  content,
  images,
  avatarUrl,
  bio,
  commentsCount = 0,
  repostsCount = 0,
  likesCount = 0,
  impressionsCount = 0,
  isLiked = false,
  isBookmarked = false,
}: PostCardProps) {
  const imageCount = images?.length || 0;

  return (
    <div className="border-b border-border p-4 transition-colors hover:bg-muted/30">
      <ImpressionTracker postId={id} />
      <div className="flex flex-col">
        {/* Header with avatar inline */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <Link
              href={`/${username}`}
              className="shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <UserAvatar
                src={avatarUrl}
                name={author}
                className="h-10 w-10 transition-opacity hover:opacity-80"
              />
            </Link>
            <div className="flex flex-col overflow-hidden min-w-0">
              <div className="flex items-center gap-1">
                <Link
                  href={`/${username}`}
                  className="text-[14px] font-semibold hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {author}
                </Link>
                <span className="text-[12px] text-muted-foreground">·</span>
                <span className="text-[12px] text-muted-foreground shrink-0">
                  {createdAt}
                </span>
              </div>
              {bio && (
                <p className="text-[12px] text-muted-foreground truncate">
                  {bio}
                </p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <Link href={`/${username}/post/${id}`} className="block">
          <p className="whitespace-pre-wrap text-[14px] leading-5">{content}</p>

          {imageCount > 0 && (
            <div className="mt-3">
              <div className="relative overflow-hidden rounded-lg border border-border h-48">
                <Image
                  src={images![0]}
                  alt="Post image"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                  loading="lazy"
                  unoptimized
                />
                {imageCount > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[12px] font-medium px-2 py-1 rounded-md">
                    +{imageCount - 1} more
                  </div>
                )}
              </div>
            </div>
          )}
        </Link>

        {/* Actions */}
        <PostCardActions
          postId={id}
          commentsCount={commentsCount}
          repostsCount={repostsCount}
          likesCount={likesCount}
          impressionsCount={impressionsCount}
          isLiked={isLiked}
          isBookmarked={isBookmarked}
        />
      </div>
    </div>
  );
}
