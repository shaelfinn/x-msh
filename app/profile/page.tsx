import { Sidebar } from "@/components/shared/sidebar";
import { Trending } from "@/components/home/trending";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { PostCard } from "@/components/home/post-card";
import { MobileNav } from "@/components/shared/mobile-nav";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const userPosts = [
  {
    id: 1,
    author: "Mshan Cee",
    username: "mshancee",
    createdAt: "3h",
    content:
      "Building something amazing with Next.js 15! The new features are incredible 🚀",
    avatarUrl: "/avatar.jpg",
    imageUrl: "/1.jpg",
    commentsCount: 12,
    likesCount: 234,
    impressionsCount: 5600,
  },
  {
    id: 2,
    author: "Mshan Cee",
    username: "mshancee",
    createdAt: "1d",
    content: "Just shipped a new feature. Feeling productive today! 💪",
    avatarUrl: "/avatar.jpg",
    commentsCount: 8,
    likesCount: 156,
    impressionsCount: 3200,
  },
  {
    id: 3,
    author: "Mshan Cee",
    username: "mshancee",
    createdAt: "2d",
    content: "Coffee + Code = Perfect morning ☕️",
    avatarUrl: "/avatar.jpg",
    imageUrl: "/2.jpg",
    commentsCount: 15,
    likesCount: 289,
    impressionsCount: 4500,
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
            {userPosts.map((post) => (
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
