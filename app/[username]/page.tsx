import { Sidebar } from "@/components/shared/sidebar";
import { Trending } from "@/components/home/trending";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { MobileNav } from "@/components/shared/mobile-nav";
import { PostCard } from "@/components/home/posts";
import { ReplyCard } from "@/components/profile/reply-card";
import {
  getUserProfile,
  getUserPosts,
  getUserReplies,
  getUserBookmarks,
} from "@/app/actions/profile";
import { getCurrentUser } from "@/lib/auth-server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { username } = await params;
  const { tab = "posts" } = await searchParams;

  // Get current user
  const currentUser = await getCurrentUser();

  // Get user data from database
  const userData = await getUserProfile(username);

  // If user doesn't exist, show 404
  if (!userData) {
    notFound();
  }

  // Get posts based on active tab
  let posts: any[] = [];
  let emptyMessage = "No posts yet";

  switch (tab) {
    case "replies":
      posts = await getUserReplies(userData.id, currentUser?.id);
      emptyMessage = "No replies yet";
      break;
    case "bookmarks":
      posts = await getUserBookmarks(userData.id, currentUser?.id);
      emptyMessage = "No bookmarks yet";
      break;
    default:
      posts = await getUserPosts(userData.id, currentUser?.id);
      emptyMessage = "No posts yet";
  }

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
              <div>
                <h1 className="text-xl font-bold">{userData.name}</h1>
                <p className="text-xs text-muted-foreground">
                  {posts.length} {posts.length === 1 ? "post" : "posts"}
                </p>
              </div>
            </div>
          </div>

          <ProfileHeader userData={userData} />
          <ProfileTabs username={username} />

          {posts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>{emptyMessage}</p>
            </div>
          ) : (
            <div>
              {tab === "replies"
                ? posts.map((post) => (
                    <ReplyCard
                      key={post.id}
                      id={post.id}
                      author={post.author.name}
                      username={post.author.username || ""}
                      createdAt={formatTimeAgo(new Date(post.createdAt))}
                      content={post.content}
                      images={post.media}
                      avatarUrl={post.author.image}
                      commentsCount={post.commentsCount}
                      likesCount={post.likes}
                      impressionsCount={post.impressions}
                      isLiked={post.isLiked}
                      isBookmarked={post.isBookmarked}
                      parentPost={post.parentPost}
                    />
                  ))
                : posts.map((post) => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      author={post.author.name}
                      username={post.author.username || ""}
                      createdAt={formatTimeAgo(new Date(post.createdAt))}
                      content={post.content}
                      images={post.media}
                      avatarUrl={post.author.image}
                      commentsCount={post.commentsCount}
                      likesCount={post.likes}
                      impressionsCount={post.impressions}
                      isLiked={post.isLiked}
                      isBookmarked={post.isBookmarked}
                    />
                  ))}
            </div>
          )}
        </main>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
