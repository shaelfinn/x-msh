"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostCardActions } from "./post-card-actions";
import { ImpressionTracker } from "./impression-tracker";

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
  commentsCount?: number;
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
  commentsCount = 0,
  likesCount = 0,
  impressionsCount = 0,
  isLiked = false,
  isBookmarked = false,
}: PostCardProps) {
  const imageCount = images?.length || 0;

  return (
    <div className="border-b border-border p-4 transition-colors hover:bg-muted/30">
      <ImpressionTracker postId={id} />
      <div className="flex gap-3">
        <Link
          href={`/${username}`}
          className="shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="h-12 w-12 transition-opacity hover:opacity-80">
            <AvatarImage src={avatarUrl || undefined} alt={author} />
            <AvatarFallback>{author[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-hidden">
              <Link
                href={`/${username}`}
                className="max-w-[150px] truncate text-[15px] font-bold hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {author}
              </Link>
              <Link
                href={`/${username}`}
                className="shrink-0 text-[15px] text-muted-foreground hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                @{username}
              </Link>
              <span className="shrink-0 text-[15px] text-muted-foreground">
                ·
              </span>
              <span className="shrink-0 text-[15px] text-muted-foreground">
                {createdAt}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <Link href={`/${username}/post/${id}`} className="block">
            <p className="mt-1 whitespace-pre-wrap text-[15px] leading-5">
              {content}
            </p>

            {imageCount > 0 && (
              <div
                className={`mt-3 grid gap-2 ${
                  imageCount === 1
                    ? "grid-cols-1"
                    : imageCount === 2
                      ? "grid-cols-2"
                      : "grid-cols-2"
                }`}
              >
                {images!.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-2xl border border-border ${
                      imageCount === 3 && index === 0 ? "col-span-2" : ""
                    } ${
                      imageCount === 1
                        ? "h-96"
                        : imageCount === 3 && index === 0
                          ? "h-64"
                          : "h-48"
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Post image ${index + 1}`}
                      fill
                      sizes={
                        imageCount === 1
                          ? "(max-width: 768px) 100vw, 600px"
                          : imageCount === 3 && index === 0
                            ? "(max-width: 768px) 100vw, 600px"
                            : "(max-width: 768px) 50vw, 300px"
                      }
                      className="object-cover"
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </Link>
          <PostCardActions
            postId={id}
            commentsCount={commentsCount}
            likesCount={likesCount}
            impressionsCount={impressionsCount}
            isLiked={isLiked}
            isBookmarked={isBookmarked}
          />
        </div>
      </div>
    </div>
  );
}
