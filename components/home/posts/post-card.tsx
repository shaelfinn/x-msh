"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, Briefcase, Users, Handshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostCardActions } from "./post-card-actions";
import { ImpressionTracker } from "./impression-tracker";
import { UserAvatar } from "@/components/ui/user-avatar";
import { QuickCommentBox } from "./quick-comment-box";
import { useState } from "react";

interface PostCardProps {
  id: string;
  author: string;
  username: string;
  createdAt: string;
  content: string;
  images?: string[] | null;
  avatarUrl?: string | null;
  bio?: string | null;
  type?: "offer" | "hire" | "collab" | "info" | null;
  price?: number | null;
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
  type = "info",
  price,
  commentsCount = 0,
  repostsCount = 0,
  likesCount = 0,
  impressionsCount = 0,
  isLiked = false,
  isBookmarked = false,
}: PostCardProps) {
  const imageCount = images?.length || 0;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const gigTypeConfig = {
    hire: {
      label: "Hiring",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: Briefcase,
      buttonText: "Apply",
    },
    offer: {
      label: "Offering",
      color: "bg-green-500/10 text-green-600 border-green-500/20",
      icon: Briefcase,
      buttonText: "Hire",
    },
    collab: {
      label: "Collaboration",
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      icon: Users,
      buttonText: "Join",
    },
  };

  const shouldTruncate = content.length > 280;
  const displayContent =
    shouldTruncate && !isExpanded ? content.slice(0, 280) + "..." : content;

  const isGig = type && type !== "info";
  const config = isGig
    ? gigTypeConfig[type as keyof typeof gigTypeConfig]
    : null;
  const GigIcon = config?.icon || Handshake;

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
              <p className="text-[12px] text-muted-foreground truncate">
                {bio || `@${username}`}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <Link href={`/${username}/post/${id}`} className="block">
          <p className="whitespace-pre-wrap text-[14px] leading-5 mb-1.5">
            {displayContent}
          </p>
          {shouldTruncate && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-[14px] text-[#1d9bf0] hover:underline mb-1.5"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}

          {imageCount > 0 && (
            <div className="mb-1.5">
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

        {/* Gig Details - Only show if not info type */}
        {isGig && config && (
          <div className="mb-1.5 rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[13px]">
                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                  <GigIcon className="h-4 w-4" />
                  <span>{config.label}</span>
                </div>
                {price ? (
                  <div className="text-foreground font-semibold">
                    ${price.toLocaleString()}
                  </div>
                ) : type === "collab" ? (
                  <div className="text-muted-foreground font-semibold">
                    Free
                  </div>
                ) : null}
              </div>
              <Button
                size="sm"
                className="h-8 rounded-full px-4 text-[13px] font-bold bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {config.buttonText}
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <PostCardActions
          postId={id}
          commentsCount={commentsCount}
          repostsCount={repostsCount}
          likesCount={likesCount}
          impressionsCount={impressionsCount}
          isLiked={isLiked}
          isBookmarked={isBookmarked}
          onCommentClick={() => setShowCommentBox(!showCommentBox)}
        />

        {/* Quick Comment Box */}
        {showCommentBox && (
          <div className="mt-3 border-t border-border pt-3">
            <QuickCommentBox
              postId={id}
              onSuccess={() => setShowCommentBox(false)}
              onCancel={() => setShowCommentBox(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
