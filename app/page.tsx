import { Sidebar } from "@/components/shared/sidebar";
import { PostCard } from "@/components/home/post-card";
import { Trending } from "@/components/home/trending";
import { MobileHeader } from "@/components/shared/mobile-header";
import { MobileNav } from "@/components/shared/mobile-nav";
import { getPosts } from "@/app/actions/post";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const posts = await getPosts(user.id);

  return (
    <>
      <div className="flex min-h-screen pb-16 lg:pb-0">
        <Sidebar />

        <main className="flex-1 border-r border-border">
          <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
            <MobileHeader />
            <div className="flex">
              <button className="relative flex-1 py-4 font-bold transition-colors hover:bg-muted/50">
                For you
                <span className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-[#1d9bf0]"></span>
              </button>
              <button className="flex-1 py-4 text-muted-foreground transition-colors hover:bg-muted/50">
                Following
              </button>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No posts yet. Be the first to post!</p>
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={post.author.name}
                  username={post.author.username || ""}
                  createdAt={formatTimeAgo(new Date(post.createdAt))}
                  content={post.content}
                  images={post.media}
                  avatarUrl={post.author.image}
                  bio={post.author.bio}
                  commentsCount={post.commentsCount}
                  repostsCount={0}
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
