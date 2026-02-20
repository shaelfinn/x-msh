import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

export function ProfileHeader() {
  return (
    <div>
      <div className="relative h-48 bg-muted">
        <Image src="/cover.jpg" alt="Cover" fill className="object-cover" />
      </div>

      <div className="px-4">
        <div className="flex items-start justify-between">
          <Avatar className="-mt-16 h-32 w-32 border-4 border-background">
            <AvatarImage src="/avatar.jpg" alt="Mshan Cee" />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          <Button
            className="mt-3 rounded-full px-6 font-bold"
            variant="outline"
          >
            Edit profile
          </Button>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold">Mshan Cee</h2>
          <p className="text-muted-foreground">@mshancee</p>
        </div>

        <p className="mt-3">
          Full-stack developer | Building cool stuff with React & Next.js 🚀 |
          Coffee enthusiast ☕
        </p>

        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Joined March 2020</span>
          </div>
        </div>

        <div className="mt-3 flex gap-4 text-sm">
          <div>
            <span className="font-bold">247</span>{" "}
            <span className="text-muted-foreground">Following</span>
          </div>
          <div>
            <span className="font-bold">1,892</span>{" "}
            <span className="text-muted-foreground">Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
