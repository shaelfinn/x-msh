"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostCardActions } from "../home/post-card-actions";
import { ImpressionTracker } from "../home/impression-tracker";

interface ReplyCardProps {
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
  parentPost?: {
    id: string;
    content: string;
    media: string[] | null;
    likes: number;
    impressions: number;
    createdAt: Date;
    commentsCount: number;
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
      name: string;
      username: string | null;
      image: string | null;
    };
  } | null;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ReplyCard({
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
  parentPost,
}: ReplyCardProps) {
  const imageCount = images?.length || 0;
  const parentImageCount = parentPost?.media?.length || 0;

  return (
    <div className="border-b border-border">
      <ImpressionTracker postId={id} />

      {/* Parent Post - Full Display */}
      {parentPost && (
        <div className="p-4 pb-2 transition-colors hover:bg-muted/30">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <Link
                href={`/${parentPost.author.username}`}
                className="shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar className="h-12 w-12 transition-opacity hover:opacity-80">
                  <AvatarImage
                    src={parentPost.author.image || undefined}
                    alt={parentPost.author.name}
                  />
                  <AvatarFallback>
                    {parentPost.author.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="w-0.5 flex-1 bg-border my-1" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <Link
                  href={`/${parentPost.author.username}`}
                  className="font-bold hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {parentPost.author.name}
                </Link>
                <Link
                  href={`/${parentPost.author.username}`}
                  className="text-muted-foreground hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  @{parentPost.author.username}
                </Link>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {formatTimeAgo(new Date(parentPost.createdAt))}
                </span>
              </div>
              <Link
                href={`/${parentPost.author.username}/post/${parentPost.id}`}
                className="block"
              >
                <p className="mt-1 whitespace-pre-wrap">{parentPost.content}</p>

                {parentImageCount > 0 && (
                  <div
                    className={`mt-3 grid gap-2 ${
                      parentImageCount === 1
                        ? "grid-cols-1"
                        : parentImageCount === 2
                          ? "grid-cols-2"
                          : "grid-cols-2"
                    }`}
                  >
                    {parentPost.media!.map((imageUrl, index) => (
                      <div
                        key={index}
                        className={`relative overflow-hidden rounded-2xl border border-border ${
                          parentImageCount === 3 && index === 0
                            ? "col-span-2"
                            : ""
                        } ${
                          parentImageCount === 1
                            ? "h-96"
                            : parentImageCount === 3 && index === 0
                              ? "h-64"
                              : "h-48"
                        }`}
                      >
                        <Image
                          src={imageUrl}
                          alt={`Post image ${index + 1}`}
                          fill
                          sizes={
                            parentImageCount === 1
                              ? "(max-width: 768px) 100vw, 600px"
                              : parentImageCount === 3 && index === 0
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
                postId={parentPost.id}
                commentsCount={parentPost.commentsCount}
                likesCount={parentPost.likes}
                impressionsCount={parentPost.impressions}
                isLiked={parentPost.isLiked}
                isBookmarked={parentPost.isBookmarked}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reply */}
      <div className="p-4 pt-0 transition-colors hover:bg-muted/30">
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
                  className="max-w-[150px] truncate font-bold hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {author}
                </Link>
                <Link
                  href={`/${username}`}
                  className="shrink-0 text-muted-foreground hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  @{username}
                </Link>
                <span className="shrink-0 text-muted-foreground">·</span>
                <span className="shrink-0 text-muted-foreground">
                  {createdAt}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            <Link href={`/${username}/post/${id}`} className="block">
              <p className="mt-1 whitespace-pre-wrap">{content}</p>

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
    </div>
  );
}
