import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Mail, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { MockUser } from "@/lib/mock-users";

interface ProfileHeaderProps {
  userData: MockUser;
  isOwnProfile?: boolean;
}

export function ProfileHeader({
  userData,
  isOwnProfile = false,
}: ProfileHeaderProps) {
  return (
    <div>
      <div className="relative h-48 bg-muted">
        <Image
          src={userData.coverUrl}
          alt="Cover"
          fill
          className="object-cover"
        />
      </div>

      <div className="px-4">
        <div className="flex items-start justify-between">
          <Avatar className="-mt-16 h-32 w-32 border-4 border-background">
            <AvatarImage src={userData.avatarUrl} alt={userData.displayName} />
            <AvatarFallback>{userData.displayName[0]}</AvatarFallback>
          </Avatar>
          {isOwnProfile ? (
            <Button
              className="mt-3 rounded-full px-6 font-bold"
              variant="outline"
            >
              Edit profile
            </Button>
          ) : (
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
                <Mail className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button className="rounded-full bg-[#1d9bf0] px-6 font-bold text-white hover:bg-[#1a8cd8]">
                Follow
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold">{userData.displayName}</h2>
          <p className="text-muted-foreground">@{userData.username}</p>
        </div>

        <p className="mt-3">{userData.bio}</p>

        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{userData.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {userData.joinedDate}</span>
          </div>
        </div>

        <div className="mt-3 flex gap-4 text-sm">
          <div>
            <span className="font-bold">{userData.followingCount}</span>{" "}
            <span className="text-muted-foreground">Following</span>
          </div>
          <div>
            <span className="font-bold">{userData.followersCount}</span>{" "}
            <span className="text-muted-foreground">Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
