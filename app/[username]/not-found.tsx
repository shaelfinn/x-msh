import { Sidebar } from "@/components/shared/sidebar";
import { Trending } from "@/components/home/trending";
import { MobileNav } from "@/components/shared/mobile-nav";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
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
              <h1 className="text-xl font-bold">Profile</h1>
            </div>
          </div>

          <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-8">
            <div className="flex max-w-md flex-col items-center text-center">
              <h2 className="mb-3 text-2xl font-bold">
                This account doesn&apos;t exist
              </h2>
              <p className="mb-6 text-muted-foreground">
                Try searching for another user.
              </p>
              <Link
                href="/"
                className="rounded-full bg-[#1d9bf0] px-6 py-3 font-bold text-white hover:bg-[#1a8cd8]"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </main>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
