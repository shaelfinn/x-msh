import { Sidebar } from "@/components/shared/sidebar";
import { Trending } from "@/components/home/trending";
import { MobileNav } from "@/components/shared/mobile-nav";
import { CommentsList } from "@/components/comments/list";
import { PostDetailActions } from "@/components/comments/post-detail-actions";
import { ImpressionTracker } from "@/components/home/posts/impression-tracker";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPostById, getPostComments } from "@/app/actions/post";
import { getCurrentUser } from "@/lib/auth-server";
import { notFound, redirect } from "next/navigation";
import { UserAvatar } from "@/components/ui/user-avatar";

function formatFullDate(date: Date): string {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) {
  const { id } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/signin");
  }

  const postData = await getPostById(id, currentUser.id);
  if (!postData) {
    notFound();
  }

  const comments = await getPostComments(id);
  const imageCount = postData.media?.length || 0;

  return (
    <>
      <ImpressionTracker postId={id} />
      <div className="flex min-h-screen pb-16 lg:pb-0">
        <Sidebar />

        <main className="flex-1 min-w-0 border-r border-border overflow-x-hidden">
          <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="flex h-14 items-center gap-8 px-4">
              <Link href="/" className="rounded-full p-2 hover:bg-muted">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold">Post</h1>
            </div>
          </div>

          {/* Post Detail */}
          <div className="border-b border-border p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <Link
                  href={`/${postData.author.username}`}
                  className="shrink-0"
                >
                  <UserAvatar
                    src={postData.author.image}
                    name={postData.author.name}
                    className="h-10 w-10 transition-opacity hover:opacity-80"
                  />
                </Link>
                <div className="flex flex-col overflow-hidden min-w-0">
                  <Link
                    href={`/${postData.author.username}`}
                    className="text-[14px] font-semibold hover:underline truncate"
                  >
                    {postData.author.name}
                  </Link>
                  <p className="text-[12px] text-muted-foreground truncate">
                    @{postData.author.username}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-3">
              <p className="whitespace-pre-wrap text-[15px] leading-5">
                {postData.content}
              </p>

              {/* All Images - Horizontal Scroll */}
              {imageCount > 0 && (
                <div className="mt-3">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
                    {postData.media!.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative shrink-0 w-64 h-48 overflow-hidden rounded-lg border border-border"
                      >
                        <Image
                          src={imageUrl}
                          alt={`Post image ${index + 1}`}
                          fill
                          sizes="256px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-3 text-[13px] text-muted-foreground">
                {formatFullDate(new Date(postData.createdAt))}
              </p>
            </div>

            {/* Actions */}
            <PostDetailActions
              postId={id}
              commentsCount={postData.commentsCount}
              likesCount={postData.likes}
              impressionsCount={postData.impressions}
              isLiked={postData.isLiked}
              isBookmarked={postData.isBookmarked}
            />
          </div>

          <CommentsList
            postId={id}
            comments={comments}
            user={{ name: currentUser.name, image: currentUser.image ?? null }}
          />
        </main>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
