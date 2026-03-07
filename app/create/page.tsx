import { Sidebar } from "@/components/shared/sidebar";
import { Trending } from "@/components/home/trending";
import { Composer } from "@/components/home/composer";
import { MobileHeader } from "@/components/shared/mobile-header";
import { MobileNav } from "@/components/shared/mobile-nav";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Post",
  description: "Share your thoughts and ideas",
};

export default async function CreatePage() {
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
            <div className="px-4 py-4">
              <h1 className="text-xl font-bold">Create Post</h1>
            </div>
          </div>

          <Composer user={{ name: user.name, image: user.image ?? null }} />
        </main>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
