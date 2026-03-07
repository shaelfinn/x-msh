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
import { Sparkles, TrendingUp, Users, Briefcase } from "lucide-react";
import Link from "next/link";

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
          <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
            <Header />
            <div className="px-4 py-4">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="h-5 w-5 text-[#1d9bf0]" />
                <h1 className="text-xl font-bold">Discover Talent</h1>
              </div>
              <p className="text-[13px] text-muted-foreground">
                Find skilled professionals ready to bring your projects to life
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="border-b border-border">
            <div className="flex overflow-x-auto scrollbar-hide">
              <Link
                href="/network?tab=for-you"
                className={`flex items-center gap-2 px-4 py-3 text-[15px] font-medium whitespace-nowrap ${
                  activeTab === "for-you"
                    ? "border-b-2 border-[#1d9bf0] text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                For You
              </Link>
              <Link
                href="/network?tab=top-rated"
                className={`flex items-center gap-2 px-4 py-3 text-[15px] font-medium whitespace-nowrap ${
                  activeTab === "top-rated"
                    ? "border-b-2 border-[#1d9bf0] text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Top Rated
              </Link>
              <Link
                href="/network?tab=new-talent"
                className={`flex items-center gap-2 px-4 py-3 text-[15px] font-medium whitespace-nowrap ${
                  activeTab === "new-talent"
                    ? "border-b-2 border-[#1d9bf0] text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Users className="h-4 w-4" />
                New Talent
              </Link>
            </div>
          </div>

          <div className="">
            {users.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  No talent available right now
                </p>
              </div>
            ) : (
              <div className="border-b border-border">
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
