import { Sidebar } from "@/components/shared/sidebar";
import { Trending } from "@/components/home/trending";
import { MobileNav } from "@/components/shared/mobile-nav";
import { CommentsList } from "@/components/comments/list";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MessageCircle,
  Heart,
  Bookmark,
  BarChart2,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  mockPostsData,
  getCommentsByPostId,
  getUserById,
} from "@/lib/mock-data";
import { notFound } from "next/navigation";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) {
  const { id } = await params;

  // Get post data
  const postData = mockPostsData.find((p) => p.id === parseInt(id));
  if (!postData) {
    notFound();
  }

  const user = getUserById(postData.userId);
  if (!user) {
    notFound();
  }

  const comments = getCommentsByPostId(parseInt(id));

  const post = {
    ...postData,
    author: user.displayName,
    username: user.username,
    avatarUrl: user.avatarUrl,
    commentsCount: comments.length,
    bookmarksCount: 156, // Mock data for now
  };

  return (
    <>
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
                <AvatarImage src={post.avatarUrl} alt={post.author} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold hover:underline">{post.author}</p>
                    <p className="text-muted-foreground">@{post.username}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xl leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
              {post.imageUrl && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                  <Image
                    src={post.imageUrl}
                    alt="Post image"
                    width={600}
                    height={400}
                    className="w-full object-cover"
                  />
                </div>
              )}
              <p className="mt-4 text-muted-foreground">{post.createdAt}</p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-around border-y border-border py-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">
                  {formatNumber(post.commentsCount)}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-pink-600"
              >
                <Heart className="h-5 w-5" />
                <span className="text-sm">{formatNumber(post.likesCount)}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
              >
                <BarChart2 className="h-5 w-5" />
                <span className="text-sm">
                  {formatNumber(post.impressionsCount)}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
              >
                <Bookmark className="h-5 w-5" />
                <span className="text-sm">
                  {formatNumber(post.bookmarksCount)}
                </span>
              </Button>
            </div>
          </div>

          <CommentsList postId={post.id} comments={comments} />
        </main>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
