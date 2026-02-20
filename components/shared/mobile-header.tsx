import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export function MobileHeader() {
  return (
    <div className="flex h-14 items-center justify-between px-4 lg:justify-center">
      <Link href="/mshancee" className="lg:hidden">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatar.jpg" alt="Mshan Cee" />
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
      </Link>
      <h1 className="text-xl font-bold">Home</h1>
      <div className="w-8 lg:hidden" />
    </div>
  );
}
