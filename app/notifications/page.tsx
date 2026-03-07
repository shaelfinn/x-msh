import { Sidebar } from "@/components/shared/sidebar";
import { Trending } from "@/components/home/trending";
import { MobileNav } from "@/components/shared/mobile-nav";
import { Header } from "@/components/shared/header";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { getNotifications } from "@/app/actions/notifications";
import { requireAuth } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await requireAuth();

  if (!user) {
    redirect("/signin");
  }

  const { tab } = await searchParams;
  const activeTab = (tab === "mentions" ? "mentions" : "all") as
    | "all"
    | "mentions";

  const notifications = await getNotifications(activeTab);

  return (
    <>
      <div className="flex min-h-screen pb-16 lg:pb-0">
        <Sidebar />

        <main className="flex-1 border-r border-border">
          <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
            <Header />
            <div className="hidden h-14 items-center px-4 lg:flex">
              <h1 className="text-xl font-bold">Notifications</h1>
            </div>
          </div>

          <div className="flex border-b border-border">
            <Link
              href="/notifications"
              className={`relative flex-1 py-4 text-center font-bold transition-colors hover:bg-muted/50 ${
                activeTab === "all" ? "" : "font-normal text-muted-foreground"
              }`}
            >
              All
              {activeTab === "all" && (
                <span className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-[#1d9bf0]"></span>
              )}
            </Link>
            <Link
              href="/notifications?tab=mentions"
              className={`relative flex-1 py-4 text-center font-bold transition-colors hover:bg-muted/50 ${
                activeTab === "mentions"
                  ? ""
                  : "font-normal text-muted-foreground"
              }`}
            >
              Mentions
              {activeTab === "mentions" && (
                <span className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-[#1d9bf0]"></span>
              )}
            </Link>
          </div>

          <NotificationsList notifications={notifications} />
        </main>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
