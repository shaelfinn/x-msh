import { Sidebar } from "@/components/sidebar";
import { Tweet } from "@/components/tweet";
import { Trending } from "@/components/trending";
import { TweetComposer } from "@/components/tweet-composer";
import { MobileHeader } from "@/components/mobile-header";
import { MobileNav } from "@/components/mobile-nav";
import { mockTweets } from "@/lib/mock-data";

export default function Home() {
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

          <TweetComposer />

          <div>
            {mockTweets.map((tweet) => (
              <Tweet key={tweet.id} {...tweet} />
            ))}
          </div>
        </main>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
