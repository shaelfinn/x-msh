"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { setupUserProfile } from "@/app/actions/user";

interface OnboardingDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
    username: string | null;
    country: string | null;
  };
}

function generateUsername(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 15);

  const random = Math.floor(Math.random() * 9999);
  return `${base}${random}`;
}

export function OnboardingDialog({ user }: OnboardingDialogProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [username, setUsername] = useState(() =>
    user.name ? generateUsername(user.name) : "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await setupUserProfile({
        username: username.trim(),
        country: user.country || "KE",
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <Dialog open={true}>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 z-100" />
        <DialogPrimitive.Content
          className="fixed top-[50%] left-[50%] z-100 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="p-6 sm:p-8">
            <div className="mb-8 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1d9bf0]/10 mb-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 fill-[#1d9bf0]"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Choose your username</h2>
              <p className="text-[15px] text-muted-foreground">
                You can always change it later
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-base">
                  @
                </span>
                <Input
                  value={username}
                  onChange={(e) => {
                    setUsername(
                      e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                    );
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && username.trim() && !loading) {
                      handleSubmit();
                    }
                  }}
                  placeholder="username"
                  maxLength={20}
                  disabled={loading}
                  autoFocus
                  className="h-14 pl-9 text-base bg-transparent border-border focus-visible:ring-1 focus-visible:ring-[#1d9bf0] rounded-lg"
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full h-12 bg-[#1d9bf0] hover:bg-[#1a8cd8] rounded-full text-[15px] font-bold disabled:opacity-50"
                disabled={loading || !username.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating profile...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
