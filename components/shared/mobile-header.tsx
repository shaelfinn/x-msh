import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-server";

export async function MobileHeader() {
  const user = await getCurrentUser();

  return (
    <div className="flex h-14 items-center justify-between px-4 lg:justify-center">
      {user && (
        <Link href={`/${user.username}`} className="lg:hidden">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
      )}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-7 w-7 fill-current"
      >
        <g>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </g>
      </svg>
      <div className="w-8 lg:hidden" />
    </div>
  );
}
