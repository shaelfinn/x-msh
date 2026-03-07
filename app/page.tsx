import { Sidebar } from "@/components/shared/sidebar";
import { PostCard } from "@/components/home/posts";
import { Trending } from "@/components/home/trending";
import { Header } from "@/components/shared/header";
import { MobileNav } from "@/components/shared/mobile-nav";
import { Spaces } from "@/components/home/spaces";
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

        <div className="flex-1 min-w-0 flex flex-col border-r border-border">
          <main className="flex-1">
            <Header />

            {/* Spaces - Horizontal scroll at top */}
            <Spaces />

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
                    type={post.type as "offer" | "hire" | "collab" | "info"}
                    price={post.price}
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
        </div>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
