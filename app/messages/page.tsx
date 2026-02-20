import { Sidebar } from "@/components/sidebar";
import { Trending } from "@/components/trending";
import { MobileNav } from "@/components/mobile-nav";
import { PinSetup } from "@/components/pin-setup";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MessagesPage() {
  return (
    <>
      <div className="flex  lg:pb-0">
        <Sidebar />

        <main className="flex-1 border-r border-border">
          <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="flex h-14 items-center gap-8 px-4">
              <Link
                href="/"
                className="rounded-full p-2 hover:bg-muted lg:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold">Messages</h1>
            </div>
          </div>

          <PinSetup />
        </main>

        <Trending />
      </div>
      <MobileNav />
    </>
  );
}
