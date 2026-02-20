import { Home, Search, Bell, Mail, User, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Explore" },
    { icon: Bell, label: "Notifications" },
    { icon: Mail, label: "Messages" },
    { icon: User, label: "Profile" },
    { icon: MoreHorizontal, label: "More" },
  ];

  return (
    <div className="sticky top-0 hidden h-screen w-[275px] flex-col border-r border-border px-2 lg:flex">
      <div className="flex flex-col gap-2 py-4">
        <div className="px-3 py-2">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 fill-foreground"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>

        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={`justify-start gap-4 px-4 py-6 text-xl ${
              item.active ? "font-bold" : "font-normal"
            }`}
          >
            <item.icon className="h-7 w-7" />
            {item.label}
          </Button>
        ))}

        <Button className="mt-4 h-12 rounded-full text-base font-bold">
          Post
        </Button>
      </div>
    </div>
  );
}
