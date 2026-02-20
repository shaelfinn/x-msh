import { Sidebar } from "@/components/shared/sidebar";
import { PostCard } from "@/components/home/post-card";
import { Trending } from "@/components/home/trending";
import { Composer } from "@/components/home/composer";
import { MobileHeader } from "@/components/shared/mobile-header";
import { MobileNav } from "@/components/shared/mobile-nav";
import { mockPosts } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

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

          <Composer user={{ name: user.name, image: user.image }} />

          <div>
            {mockPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </main>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
