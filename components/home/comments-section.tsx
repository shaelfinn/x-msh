"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, BarChart2 } from "lucide-react";
import { useState } from "react";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

interface Comment {
  id: number;
  author: string;
  username: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  likesCount: number;
  impressionsCount: number;
}

interface CommentsSectionProps {
  postId: number;
  comments: Comment[];
}

const MAX_CHARS = 280;

function CharacterCounter({ current, max }: { current: number; max: number }) {
  const percentage = (current / max) * 100;
  const remaining = max - current;
  const isWarning = percentage > 80 && percentage <= 100;
  const isExceeded = percentage > 100;

  // Calculate stroke dash offset for circular progress
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8">
        <svg className="h-8 w-8 -rotate-90 transform">
          {/* Background circle */}
          <circle
            cx="16"
            cy="16"
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-muted"
          />
          {/* Progress circle */}
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

export function CommentsSection({ comments }: CommentsSectionProps) {
  const [commentText, setCommentText] = useState("");
  const charCount = commentText.length;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="border-t border-border">
      {/* Comment Input */}
      <div className="flex gap-3 border-b border-border p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/avatar.jpg" alt="You" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            placeholder="Post your reply"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full resize-none bg-transparent text-lg outline-none placeholder:text-muted-foreground"
            rows={2}
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              {charCount > 0 && (
                <CharacterCounter current={charCount} max={MAX_CHARS} />
              )}
            </div>
            <Button
              className="rounded-full bg-[#1d9bf0] px-4 font-bold text-white hover:bg-[#1a8cd8] disabled:opacity-50"
              disabled={!commentText.trim() || isOverLimit}
            >
              Reply
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-border p-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.avatarUrl} alt={comment.author} />
                <AvatarFallback>{comment.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold hover:underline">
                    {comment.author}
                  </span>
                  <span className="text-muted-foreground">
                    @{comment.username}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {comment.createdAt}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>
                <div className="mt-2 flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-pink-600"
                  >
                    <Heart className="h-4 w-4" />
                    {comment.likesCount > 0 && (
                      <span className="text-sm">
                        {formatNumber(comment.likesCount)}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-primary"
                  >
                    <BarChart2 className="h-4 w-4" />
                    {comment.impressionsCount > 0 && (
                      <span className="text-sm">
                        {formatNumber(comment.impressionsCount)}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
