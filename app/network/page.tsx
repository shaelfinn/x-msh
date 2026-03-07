import { Sidebar } from "@/components/shared/sidebar";
import { Trending } from "@/components/home/trending";
import { Header } from "@/components/shared/header";
import { MobileNav } from "@/components/shared/mobile-nav";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import {
  getSuggestedUsers,
  getTopRatedUsers,
  getNewTalent,
} from "@/app/actions/profile";
import { NetworkUserCard } from "@/components/network/user-card";
import type { Metadata } from "next";
import { Sparkles, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Network - Discover Talent",
  description: "Find and hire skilled professionals for your projects",
};

type TabType = "for-you" | "top-rated" | "new-talent";

export default async function NetworkPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const params = await searchParams;
  const activeTab = (params.tab || "for-you") as TabType;

  let users = [];
  if (activeTab === "top-rated") {
    users = await getTopRatedUsers(user.id);
  } else if (activeTab === "new-talent") {
    users = await getNewTalent(user.id);
  } else {
    users = await getSuggestedUsers(user.id);
  }

  return (
    <>
      <div className="flex min-h-screen pb-16 lg:pb-0">
        <Sidebar />

        <main className="flex-1 min-w-0 border-r border-border">
          <Header />

          {/* Hero Section */}
          <div className="relative h-32 overflow-hidden border-b border-border">
            <div className="absolute inset-0">
              <Image
                src="/discover.jpg"
                alt="Discover Network"
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
            </div>
            <div className="relative h-full flex flex-col justify-end p-4 pb-3">
              <h1 className="text-2xl font-bold mb-1">Discover Talent</h1>
              <p className="text-[14px] text-muted-foreground">
                Connect with skilled professionals ready to bring your ideas to
                life
              </p>
            </div>
          </div>

          {/* Professional Categories */}
          <div className="border-b border-border py-4 px-4">
            <h2 className="text-[15px] font-semibold mb-3">
              Browse by Category
            </h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {[
                { name: "Developers", image: "develop.jpg" },
                { name: "Photographers", image: "camera.jpg" },
                { name: "Designers", image: "design.jpg" },
                { name: "Writers", image: "write.jpg" },
                { name: "Marketers", image: "market.png" },
                { name: "Video Editors", image: "video.jpg" },
              ].map((category) => (
                <button
                  key={category.name}
                  className="relative shrink-0 w-32 h-24 rounded-xl overflow-hidden group"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={`/${category.image}`}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                  </div>
                  <div className="relative h-full flex items-end p-3">
                    <span className="text-[14px] font-semibold text-white">
                      {category.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="border-b border-border sticky top-0 z-10 bg-background">
            <div className="flex">
              <Link
                href="/network?tab=for-you"
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[15px] font-medium transition-colors ${
                  activeTab === "for-you"
                    ? "text-[#1d9bf0]"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                For You
              </Link>
              <Link
                href="/network?tab=top-rated"
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[15px] font-medium transition-colors ${
                  activeTab === "top-rated"
                    ? "text-[#1d9bf0]"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Top Rated
              </Link>
              <Link
                href="/network?tab=new-talent"
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[15px] font-medium transition-colors ${
                  activeTab === "new-talent"
                    ? "text-[#1d9bf0]"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Users className="h-4 w-4" />
                New Talent
              </Link>
            </div>
          </div>

          {/* User List */}
          <div>
            {users.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-[15px] text-muted-foreground">
                  No talent available right now
                </p>
                <p className="text-[13px] text-muted-foreground mt-1">
                  Check back soon for new professionals
                </p>
              </div>
            ) : (
              <div>
                {users.map((suggestedUser) => (
                  <NetworkUserCard
                    key={suggestedUser.id}
                    user={suggestedUser}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
