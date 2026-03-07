"use client";

import { UserAvatar } from "@/components/ui/user-avatar";
import { useEffect, useState, useMemo, useCallback } from "react";

const spaceTopics = [
  "Freelancing Tips & Tricks",
  "Building SaaS Products",
  "Design Systems Discussion",
  "Remote Work Best Practices",
  "AI & Tech Innovations",
  "Marketing & Growth Hacks",
];

interface SpacesClientProps {
  users: Array<{ id: string; name: string; image: string | null }>;
}

interface Space {
  title: string;
  allUsers: Array<{ id: string; name: string; image: string | null }>;
  listeners: number;
}

export function SpacesClient({ users }: SpacesClientProps) {
  const spaces = useMemo(
    () =>
      spaceTopics.map((topic, index) => ({
        title: topic,
        allUsers: users,
        listeners: 50 + ((index * 17) % 100) + 50, // Deterministic but varied
      })),
    [users],
  );

  return (
    <div className="border-b border-border py-2">
      <div className="flex gap-3 overflow-x-scroll px-4 scrollbar-hide">
        {spaces.map((space, index) => (
          <SpaceCard key={index} space={space} />
        ))}
      </div>
    </div>
  );
}

function SpaceCard({ space }: { space: Space }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [avatarAnimating, setAvatarAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Use deterministic initial users based on space title
  const getInitialUsers = useCallback(() => {
    if (space.allUsers.length === 0) return [];
    // Use space title hash to deterministically pick users
    const hash = space.title
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const startIndex = hash % space.allUsers.length;
    const users = [];
    for (let i = 0; i < Math.min(3, space.allUsers.length); i++) {
      users.push(space.allUsers[(startIndex + i) % space.allUsers.length]);
    }
    return users;
  }, [space.allUsers, space.title]);

  const [visibleParticipants, setVisibleParticipants] = useState(() =>
    getInitialUsers(),
  );

  const texts = useMemo(
    () => [space.title, ...visibleParticipants.map((p) => `${p.name} is here`)],
    [space.title, visibleParticipants],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (
      !mounted ||
      space.allUsers.length === 0 ||
      visibleParticipants.length === 0
    )
      return;

    const interval = setInterval(() => {
      setAvatarAnimating(true);
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);

        setVisibleParticipants((prev) => {
          const availableUsers = space.allUsers.filter(
            (u) => !prev.some((p) => p.id === u.id),
          );

          if (availableUsers.length === 0) {
            const randomUser =
              space.allUsers[Math.floor(Math.random() * space.allUsers.length)];
            return [...prev.slice(1), randomUser];
          }

          const randomUser =
            availableUsers[Math.floor(Math.random() * availableUsers.length)];
          return [...prev.slice(1), randomUser];
        });
      }, 600);

      setTimeout(() => {
        setAvatarAnimating(false);
        setIsAnimating(false);
      }, 800);
    }, 5000);

    return () => clearInterval(interval);
  }, [mounted, texts.length, space.allUsers, visibleParticipants.length]);

  if (visibleParticipants.length === 0) {
    return null;
  }

  return (
    <div className="min-w-[300px] max-w-[300px] rounded-2xl bg-linear-to-br from-blue-500/10 to-purple-400/10 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex -space-x-2 shrink-0 overflow-hidden">
            {visibleParticipants.map((participant, idx) => (
              <div
                key={participant.id}
                className={`ring-2 ring-background rounded-full transition-all duration-700 ease-out ${
                  avatarAnimating && idx === 0
                    ? "opacity-0 -translate-x-10 scale-90"
                    : "opacity-100 translate-x-0 scale-100"
                }`}
                style={{ zIndex: visibleParticipants.length - idx }}
              >
                <UserAvatar
                  src={participant.image}
                  name={participant.name}
                  className="h-8 w-8"
                />
              </div>
            ))}
          </div>
          <span className="text-[12px] text-muted-foreground shrink-0">
            +{space.listeners}
          </span>
          <div className="overflow-hidden flex-1 relative h-5">
            <h3
              key={currentTextIndex}
              className={`font-semibold text-[14px] truncate absolute inset-0 transition-all ${
                isAnimating
                  ? "opacity-0 transform -translate-y-4 duration-600 ease-in"
                  : "opacity-100 transform translate-y-0 duration-700 ease-out"
              }`}
            >
              {texts[currentTextIndex]}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-[3px] h-4 shrink-0">
          <div
            className="w-[3px] bg-purple-400 rounded-full animate-pulse"
            style={{
              height: "40%",
              animationDelay: "0ms",
              animationDuration: "800ms",
            }}
          />
          <div
            className="w-[3px] bg-purple-400 rounded-full animate-pulse"
            style={{
              height: "70%",
              animationDelay: "200ms",
              animationDuration: "800ms",
            }}
          />
          <div
            className="w-[3px] bg-purple-400 rounded-full animate-pulse"
            style={{
              height: "100%",
              animationDelay: "400ms",
              animationDuration: "800ms",
            }}
          />
          <div
            className="w-[3px] bg-purple-400 rounded-full animate-pulse"
            style={{
              height: "60%",
              animationDelay: "600ms",
              animationDuration: "800ms",
            }}
          />
        </div>
      </div>
    </div>
  );
}
