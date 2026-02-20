"use client";

import { Home, Search, Bell, Mail, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/notifications", icon: Bell, label: "Notifications" },
    { href: "/messages", icon: Mail, label: "Messages" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background lg:hidden">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors hover:bg-muted ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon
                  className="h-6 w-6"
                  fill={isActive ? "currentColor" : "none"}
                />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Post Button */}
      <button className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1d9bf0] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 lg:hidden">
        <Plus className="h-6 w-6" />
      </button>
    </>
  );
}
