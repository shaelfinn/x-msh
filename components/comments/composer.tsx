"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { createComment } from "@/app/actions/post";

const MAX_CHARS = 280;

function CharacterCounter({ current, max }: { current: number; max: number }) {
  const percentage = (current / max) * 100;
  const remaining = max - current;
  const isWarning = percentage > 80 && percentage <= 100;
  const isExceeded = percentage > 100;

  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8">
        <svg className="h-8 w-8 -rotate-90 transform">
          <circle
            cx="16"
            cy="16"
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="16"
            cy="16"
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`transition-all duration-200 ${
              isExceeded
                ? "text-red-500"
                : isWarning
                  ? "text-yellow-500"
                  : "text-[#1d9bf0]"
            }`}
            strokeLinecap="round"
          />
        </svg>
      </div>
      {(isWarning || isExceeded) && (
        <span
          className={`text-sm ${
            isExceeded ? "text-red-500" : "text-yellow-500"
          }`}
        >
          {remaining}
        </span>
      )}
    </div>
  );
}

interface CommentComposerProps {
  postId: string;
  user?: {
    name: string;
    image: string | null;
  };
}

export function CommentComposer({ postId, user }: CommentComposerProps) {
  const [commentText, setCommentText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
  const charCount = commentText.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isActive = isFocused || commentText.length > 0;

  const handleSubmit = () => {
    if (!commentText.trim() || isOverLimit || isPending) return;

    startTransition(async () => {
      const result = await createComment(postId, commentText);
      if (result.success) {
        setCommentText("");
      }
    });
  };

  return (
    <div className="flex gap-3 border-b border-border p-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user?.image || undefined} alt={user?.name || "You"} />
        <AvatarFallback>{user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-start gap-2">
          <textarea
            placeholder="Post your reply"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
            className="flex-1 resize-none bg-transparent text-lg outline-none placeholder:text-muted-foreground"
            rows={isActive ? 2 : 1}
            disabled={isPending}
          />
          {!isActive && (
            <Button
              size="sm"
              className="rounded-full bg-[#1d9bf0] px-4 font-bold text-white hover:bg-[#1a8cd8]"
              disabled
            >
              Reply
            </Button>
          )}
        </div>
        {isActive && (
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              {charCount > 0 && (
                <CharacterCounter current={charCount} max={MAX_CHARS} />
              )}
            </div>
            <Button
              onClick={handleSubmit}
              className="rounded-full bg-[#1d9bf0] px-4 font-bold text-white hover:bg-[#1a8cd8] disabled:opacity-50"
              disabled={!commentText.trim() || isOverLimit || isPending}
            >
              {isPending ? "Posting..." : "Reply"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
