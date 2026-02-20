"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Smile, Calendar, MapPin, Settings2, ImageIcon } from "lucide-react";
import { useState } from "react";

interface ComposerProps {
  user: {
    name: string;
    image: string | null;
  };
}

const MAX_CHARS = 280;

export function Composer({ user }: ComposerProps) {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const charCount = content.length;
  const remaining = MAX_CHARS - charCount;
  const percentage = (charCount / MAX_CHARS) * 100;

  // Determine circle color based on remaining chars
  const getCircleColor = () => {
    if (remaining < 0) return "#f4212e"; // Red when over limit
    if (remaining <= 20) return "#ffd400"; // Yellow when close
    return "#1d9bf0"; // Blue normally
  };

  // Calculate circle stroke
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="border-b border-border p-4">
      <div className="flex gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image || undefined} alt={user.name} />
          <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <textarea
              placeholder="What is happening?!"
              className="flex-1 resize-none bg-transparent text-xl outline-none placeholder:text-muted-foreground"
              rows={isFocused ? 3 : 1}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              maxLength={MAX_CHARS + 20}
            />
            {!isFocused && (
              <Button
                onClick={() => setIsFocused(true)}
                className="rounded-full bg-[#1d9bf0] px-4 font-bold text-white hover:bg-[#1a8cd8]"
              >
                Post
              </Button>
            )}
          </div>

          {isFocused && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                >
                  <Calendar className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                >
                  <MapPin className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                >
                  <Settings2 className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                {charCount > 0 && (
                  <div className="relative flex items-center justify-center">
                    <svg className="h-8 w-8 -rotate-90 transform">
                      <circle
                        cx="16"
                        cy="16"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-muted-foreground/20"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r={radius}
                        stroke={getCircleColor()}
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-150"
                      />
                    </svg>
                    {remaining <= 20 && (
                      <span
                        className="absolute text-xs font-medium"
                        style={{ color: getCircleColor() }}
                      >
                        {remaining}
                      </span>
                    )}
                  </div>
                )}
                <Button
                  disabled={charCount === 0 || remaining < 0}
                  className="rounded-full bg-[#1d9bf0] px-4 font-bold text-white hover:bg-[#1a8cd8] disabled:opacity-50"
                >
                  Post
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
