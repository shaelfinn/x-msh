"use client";

import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  DollarSign,
  Clock,
  Users,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostCardActions } from "./post-card-actions";
import { ImpressionTracker } from "./impression-tracker";
import { UserAvatar } from "@/components/ui/user-avatar";
import { QuickCommentBox } from "./quick-comment-box";
import { useState } from "react";

// Mock function to determine gig type and details based on content
function getGigDetails(content: string, postId: string) {
  const hash = postId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const types = ["hiring", "offering", "collaboration"];
  const gigType = types[hash % types.length];

  const budgets = [50, 100, 200, 500, 1000, 2000];
  const durations = ["1-2 days", "3-5 days", "1 week", "2 weeks", "1 month"];

  return {
    type: gigType,
    budget: budgets[hash % budgets.length],
    duration: durations[hash % durations.length],
    applicants: hash % 20,
  };
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
  const gigDetails = getGigDetails(content, id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const gigTypeConfig = {
    hiring: {
      label: "Hiring",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: Briefcase,
    },
    offering: {
      label: "Offer",
      color: "bg-green-500/10 text-green-600 border-green-500/20",
      icon: Briefcase,
    },
    collaboration: {
      label: "Collab",
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      icon: Users,
    },
  };

  const config = gigTypeConfig[gigDetails.type as keyof typeof gigTypeConfig];
  const GigIcon = config.icon;

  // Determine if content needs truncation (more than 280 characters)
  const shouldTruncate = content.length > 280;
  const displayContent =
    shouldTruncate && !isExpanded ? content.slice(0, 280) + "..." : content;

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

        {/* Gig Type Badge */}
        {/* <div className="mb-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border ${config.color}`}
          >
            <GigIcon className="h-3 w-3" />
            {config.label}
          </span>
        </div> */}

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
                  alt="Gig image"
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

        {/* Gig Details Card */}
        <div className="mb-1.5 rounded-lg overflow-hidden relative">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-40">
            <Image
              src={`/posts/${gigDetails.type}.jpg`}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Content */}
          <div className="relative bg-linear-to-r from-background/70 to-background/50 p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[13px]">
                {/* Gig Type */}
                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                  <GigIcon className="h-4 w-4" />
                  <span>{config.label}</span>
                </div>

                {/* Budget */}
                {gigDetails.type !== "collaboration" && (
                  <div className="flex items-center gap-1 text-foreground">
                    <DollarSign className="h-4 w-4 text-[#00ba7c]" />
                    <span className="font-semibold">${gigDetails.budget}</span>
                  </div>
                )}

                {/* Duration */}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{gigDetails.duration}</span>
                </div>

                {/* Applicants */}
                {gigDetails.applicants > 0 && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{gigDetails.applicants}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Button
                size="sm"
                className="h-8 rounded-full px-4 text-[13px] font-bold bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {gigDetails.type === "hiring"
                  ? "Apply"
                  : gigDetails.type === "offering"
                    ? "Hire"
                    : "Join"}
              </Button>
            </div>
          </div>
        </div>

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
