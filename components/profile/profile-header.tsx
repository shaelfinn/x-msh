"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Mail,
  MoreHorizontal,
  Link as LinkIcon,
  Loader2,
  DollarSign,
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
        {/* Cover Image */}
        <div className="relative h-24 bg-muted">
          {userData.cover ? (
            <Image
              src={userData.cover}
              alt="Cover"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-[#1d9bf0]/20 to-muted" />
          )}
        </div>

        <div className="px-4 pb-4">
          {/* Avatar and Action Buttons */}
          <div className="flex items-start justify-between mb-4">
            <UserAvatar
              src={userData.image}
              name={userData.name}
              className="-mt-10 h-20 w-20 border-4 border-background"
            />
            {userData.isOwnProfile ? (
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full border-border hover:bg-muted/50"
                  title="Send tip"
                >
                  <DollarSign className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setIsEditOpen(true)}
                  className="h-9 rounded-full px-5 text-[15px] font-bold"
                  variant="outline"
                >
                  Edit profile
                </Button>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full border-border hover:bg-muted/50"
                  title="Send message"
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full border-border hover:bg-muted/50"
                  title="Send tip"
                >
                  <DollarSign className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full border-border hover:bg-muted/50"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleFollowClick}
                  disabled={followLoading}
                  className={
                    isFollowing
                      ? "h-9 rounded-full px-5 text-[15px] font-bold border-border hover:bg-red-500/10 hover:border-red-500 hover:text-red-500"
                      : "h-9 rounded-full bg-[#1d9bf0] px-5 text-[15px] font-bold text-white hover:bg-[#1a8cd8]"
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

          {/* Name and Username */}
          <div>
            <h2 className="text-[20px] font-bold leading-tight">
              {userData.name}
            </h2>
            <p className="text-[15px] text-muted-foreground">
              @{userData.username}
            </p>
          </div>

          {/* Bio */}
          {userData.bio && (
            <p className="mt-3 text-[15px] leading-relaxed">{userData.bio}</p>
          )}

          {/* Metadata */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[15px] text-muted-foreground">
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

          {/* Following/Followers */}
          <div className="mt-3 flex gap-5 text-[15px]">
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
