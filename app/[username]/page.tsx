import { Sidebar } from "@/components/shared/sidebar";
import { Trending } from "@/components/home/trending";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { PostCard } from "@/components/home/post-card";
import { MobileNav } from "@/components/shared/mobile-nav";
import { mockUsers } from "@/lib/mock-users";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // Get user data from mock data
  const userData = mockUsers[username as keyof typeof mockUsers];

  // If user doesn't exist, show 404
  if (!userData) {
    notFound();
  }

  // Check if viewing own profile (in production, check against authenticated user)
  const isOwnProfile = username === "mshancee";

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
                <h1 className="text-xl font-bold">{userData.displayName}</h1>
                <p className="text-xs text-muted-foreground">
                  {userData.postsCount} posts
                </p>
              </div>
            </div>
          </div>

          <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} />
          <ProfileTabs />

          <div>
            {userData.posts.map((post) => (
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
