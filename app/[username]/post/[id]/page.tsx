import { Sidebar } from "@/components/shared/sidebar";
import { Trending } from "@/components/home/trending";
import { MobileNav } from "@/components/shared/mobile-nav";
import { CommentsList } from "@/components/comments/list";
import { PostDetailActions } from "@/components/comments/post-detail-actions";
import { ImpressionTracker } from "@/components/home/impression-tracker";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPostById, getPostComments } from "@/app/actions/post";
import { getCurrentUser } from "@/lib/auth-server";
import { notFound, redirect } from "next/navigation";

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

        <main className="flex-1 border-r border-border">
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
            <div className="flex gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={postData.author.image || undefined}
                  alt={postData.author.name}
                />
                <AvatarFallback>
                  {postData.author.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      href={`/${postData.author.username}`}
                      className="font-bold hover:underline"
                    >
                      {postData.author.name}
                    </Link>
                    <p className="text-muted-foreground">
                      @{postData.author.username}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <p className="whitespace-pre-wrap text-xl leading-relaxed">
                {postData.content}
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
                  {postData.media!.map((imageUrl, index) => (
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
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-4 text-muted-foreground">
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
