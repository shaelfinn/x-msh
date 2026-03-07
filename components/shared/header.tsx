import { UserAvatar } from "@/components/ui/user-avatar";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-server";
import Image from "next/image";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-12 items-center justify-between px-4 lg:justify-center">
        {user && (
          <Link href={`/${user.username}`} className="lg:hidden">
            <UserAvatar src={user.image} name={user.name} className="h-8 w-8" />
          </Link>
        )}
        <Link href="/" className="relative h-7 w-32">
          <Image
            src="/logo-text.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
        <div className="w-8 lg:hidden" />
      </div>

      {/* Separator */}
      <div className="flex justify-center">
        <div className="w-[70%] border-t border-border"></div>
      </div>

      {/* Tabs */}
      <div className="flex">
        <button className="relative flex-1 py-2 font-bold text-[#1d9bf0] transition-colors hover:bg-muted/50">
          For you
        </button>
        <button className="flex-1 py-2 text-muted-foreground transition-colors hover:bg-muted/50">
          Following
        </button>
      </div>
    </div>
  );
}
