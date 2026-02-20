import { Sidebar } from "@/components/shared/sidebar";
import { Trending } from "@/components/home/trending";
import { MobileNav } from "@/components/shared/mobile-nav";
import { MobileHeader } from "@/components/shared/mobile-header";
import { Button } from "@/components/ui/button";
import { Search, Home } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  return (
    <>
      <div className="flex min-h-screen pb-16 lg:pb-0">
        <Sidebar />

        <main className="flex-1 border-r border-border">
          <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
            <MobileHeader />
            <div className="hidden h-14 items-center px-4 lg:flex">
              <h1 className="text-xl font-bold">Search</h1>
            </div>
          </div>

          <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1d9bf0]/10">
              <Search className="h-10 w-10 text-[#1d9bf0]" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">Search is coming soon</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              We&apos;re working on bringing you powerful search functionality
              to find posts, people, and topics.
            </p>
            <Link href="/">
              <Button className="mt-6 rounded-full bg-[#1d9bf0] px-6 font-bold hover:bg-[#1a8cd8]">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </Link>
          </div>
        </main>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
