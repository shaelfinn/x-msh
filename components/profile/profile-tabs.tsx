"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface ProfileTabsProps {
  username: string;
}

export function ProfileTabs({ username }: ProfileTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "posts";

  const tabs = [
    { id: "posts", label: "Posts" },
    { id: "replies", label: "Replies" },
    { id: "bookmarks", label: "Bookmarks" },
  ];

  return (
    <div className="border-b border-border">
      <div className="flex">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/${username}${tab.id === "posts" ? "" : `?tab=${tab.id}`}`}
            className={`relative flex-1 py-4 text-center font-semibold transition-colors hover:bg-muted/50 ${
              activeTab === tab.id ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-[#1d9bf0]"></span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
