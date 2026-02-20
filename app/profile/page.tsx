import { Sidebar } from "@/components/sidebar";
import { Trending } from "@/components/trending";
import { ProfileHeader } from "@/components/profile-header";
import { ProfileTabs } from "@/components/profile-tabs";
import { Tweet } from "@/components/tweet";
import { MobileNav } from "@/components/mobile-nav";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const userTweets = [
  {
    id: 1,
    author: "Mshan Cee",
    username: "mshancee",
    time: "3h",
    content:
      "Building something amazing with Next.js 15! The new features are incredible 🚀",
    avatar: "/avatar.jpg",
    image: "/1.jpg",
    replies: 12,
    retweets: 45,
    likes: 234,
    impressions: 5600,
  },
  {
    id: 2,
    author: "Mshan Cee",
    username: "mshancee",
    time: "1d",
    content: "Just shipped a new feature. Feeling productive today! 💪",
    avatar: "/avatar.jpg",
    replies: 8,
    retweets: 23,
    likes: 156,
    impressions: 3200,
  },
  {
    id: 3,
    author: "Mshan Cee",
    username: "mshancee",
    time: "2d",
    content: "Coffee + Code = Perfect morning ☕️",
    avatar: "/avatar.jpg",
    image: "/2.jpg",
    replies: 15,
    retweets: 34,
    likes: 289,
    impressions: 4500,
  },
];

export default function ProfilePage() {
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
                <h1 className="text-xl font-bold">Mshan Cee</h1>
                <p className="text-xs text-muted-foreground">247 posts</p>
              </div>
            </div>
          </div>

          <ProfileHeader />
          <ProfileTabs />

          <div>
            {userTweets.map((tweet) => (
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
