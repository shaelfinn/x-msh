import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostCardActions } from "../home/post-card-actions";
import { ImpressionTracker } from "../home/impression-tracker";

interface ProfilePostCardProps {
  id: string;
  username: string;
  createdAt: string;
  content: string;
  images?: string[] | null;
  commentsCount?: number;
  likesCount?: number;
  impressionsCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export function ProfilePostCard({
  id,
  username,
  createdAt,
  content,
  images,
  commentsCount = 0,
  likesCount = 0,
  impressionsCount = 0,
  isLiked = false,
  isBookmarked = false,
}: ProfilePostCardProps) {
  const imageCount = images?.length || 0;

  return (
    <Link
      href={`/${username}/post/${id}`}
      className="block border-b border-border p-4 transition-colors hover:bg-muted/30"
    >
      <ImpressionTracker postId={id} />
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{createdAt}</span>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
      <p className="mt-2 whitespace-pre-wrap">{content}</p>

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
      <PostCardActions
        postId={id}
        commentsCount={commentsCount}
        likesCount={likesCount}
        impressionsCount={impressionsCount}
        isLiked={isLiked}
        isBookmarked={isBookmarked}
      />
    </Link>
  );
}
