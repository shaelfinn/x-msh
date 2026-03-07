"use client";

import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toggleFollow } from "@/app/actions/profile";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Clock, CheckCircle2, Star } from "lucide-react";

interface NetworkUserCardProps {
  user: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
    bio: string | null;
    followersCount: number;
    isFollowing: boolean;
  };
}

// Mock data generator based on user ID
function getMockUserData(userId: string) {
  const hash = userId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const expertiseAreas = [
    "UI/UX Design & Prototyping",
    "Full Stack Development",
    "Content Writing & Strategy",
    "Video Production & Editing",
    "Digital Marketing & Growth",
    "Mobile App Development",
    "Brand Design & Identity",
    "Data Analysis & Insights",
    "3D Modeling & Animation",
    "Audio Production & Voice Work",
  ];

  const completedGigs = 15 + (hash % 85); // 15-100 gigs
  const onTimeRate = 85 + (hash % 15); // 85-100% on-time
  const rating = (4.0 + (hash % 11) / 10).toFixed(1); // 4.0-5.0 rating

  return {
    expertise: expertiseAreas[hash % expertiseAreas.length],
    completedGigs,
    onTimeRate,
    rating: parseFloat(rating),
  };
}

export function NetworkUserCard({ user }: NetworkUserCardProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [loading, setLoading] = useState(false);

  const mockData = getMockUserData(user.id);

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);

    const result = await toggleFollow(user.id);

    if (!result.success) {
      setIsFollowing(!newIsFollowing);
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <Link
      href={`/${user.username}`}
      className="block p-4 border-b border-border transition-colors hover:bg-muted/30 bg-zinc-900"
    >
      <div className="flex gap-3">
        <UserAvatar
          src={user.image}
          name={user.name}
          className="h-12 w-12 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-[15px] leading-tight">
                {user.name}
              </h3>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {mockData.expertise}
              </p>
            </div>
            <Button
              onClick={handleFollowClick}
              disabled={loading}
              className={`shrink-0 h-8 rounded-full px-4 text-[13px] font-bold ${
                isFollowing
                  ? "bg-transparent border border-border text-foreground hover:bg-red-500/10 hover:border-red-500 hover:text-red-500"
                  : "bg-[#1d9bf0] text-white hover:bg-[#1a8cd8]"
              }`}
              variant={isFollowing ? "outline" : "default"}
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : isFollowing ? (
                "Following"
              ) : (
                "Follow"
              )}
            </Button>
          </div>

          {user.bio && (
            <p className="mt-2 text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
              {user.bio}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3 text-[13px]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#00ba7c]" />
              <span className="text-foreground font-medium">
                {mockData.completedGigs}
              </span>
              <span className="text-muted-foreground">gigs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#1d9bf0]" />
              <span className="text-foreground font-medium">
                {mockData.onTimeRate}%
              </span>
              <span className="text-muted-foreground">on-time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-foreground font-medium">
                {mockData.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">rating</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
