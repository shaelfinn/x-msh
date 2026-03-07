"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Mail,
  MoreHorizontal,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { EditProfileDialog } from "./edit-profile-dialog";
import { toggleFollow } from "@/app/actions/profile";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/ui/user-avatar";

interface ProfileHeaderProps {
  userData: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
    cover: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
    createdAt: Date;
    followersCount: number;
    followingCount: number;
    isOwnProfile: boolean;
    isFollowing: boolean;
  };
}

export function ProfileHeader({ userData }: ProfileHeaderProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(userData.isFollowing);
  const [followLoading, setFollowLoading] = useState(false);

  // Format join date
  const joinDate = new Date(userData.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleFollowClick = async () => {
    setFollowLoading(true);
    const result = await toggleFollow(userData.id);

    if (result.success && result.isFollowing !== undefined) {
      setIsFollowing(result.isFollowing);
      router.refresh();
    }

    setFollowLoading(false);
  };

  return (
    <>
      <div>
        <div className="relative h-48 bg-muted">
          {userData.cover ? (
            <Image
              src={userData.cover}
              alt="Cover"
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-[#1d9bf0]/20 to-muted" />
          )}
        </div>

        <div className="px-4">
          <div className="flex items-start justify-between">
            <UserAvatar
              src={userData.image}
              name={userData.name}
              className="-mt-16 h-32 w-32 border-4 border-background"
            />
            {userData.isOwnProfile ? (
              <Button
                onClick={() => setIsEditOpen(true)}
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
                <Button
                  onClick={handleFollowClick}
                  disabled={followLoading}
                  className={
                    isFollowing
                      ? "rounded-full px-6 font-bold"
                      : "rounded-full bg-[#1d9bf0] px-6 font-bold text-white hover:bg-[#1a8cd8]"
                  }
                  variant={isFollowing ? "outline" : "default"}
                >
                  {followLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isFollowing ? (
                    "Following"
                  ) : (
                    "Follow"
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold">{userData.name}</h2>
            <p className="text-muted-foreground">@{userData.username}</p>
          </div>

          {userData.bio && <p className="mt-3">{userData.bio}</p>}

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {userData.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{userData.location}</span>
              </div>
            )}
            {userData.website && (
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <a
                  href={userData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1d9bf0] hover:underline"
                >
                  {userData.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          <div className="mt-3 flex gap-4 text-sm">
            <button className="hover:underline">
              <span className="font-bold">{userData.followingCount}</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold">{userData.followersCount}</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </button>
          </div>
        </div>
      </div>

      <EditProfileDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        userData={userData}
      />
    </>
  );
}
