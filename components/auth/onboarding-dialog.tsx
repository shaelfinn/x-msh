"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { Sparkles, MapPin, Loader2 } from "lucide-react";
import { setupUserProfile } from "@/app/actions/user";

// Register English locale
countries.registerLocale(en);

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
  // Remove special characters and spaces, convert to lowercase
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 15);

  // Add random numbers to make it unique
  const random = Math.floor(Math.random() * 9999);
  return `${base}${random}`;
}

export function OnboardingDialog({ user }: OnboardingDialogProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState(() =>
    user.name ? generateUsername(user.name) : "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get country name from code
  const countryName = user.country
    ? countries.getName(user.country, "en") || "Kenya"
    : "Kenya";

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    // Step 2: Save username
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

      // Refresh the page to update session
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleRegenerateUsername = () => {
    setUsername(generateUsername(user.name));
    setError("");
  };

  return (
    <Dialog open={true}>
      <DialogPortal>
        <DialogOverlay className="backdrop-blur-md bg-black/80" />
        <DialogPrimitive.Content
          className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-0 p-0 rounded-2xl border shadow-lg duration-200 outline-none sm:max-w-[600px]"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="p-8 pb-6 space-y-4">
            <div className="flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10 fill-[#1d9bf0]"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <DialogTitle className="text-3xl font-bold">
                {step === 1 ? "Pick a username" : "Confirm your location"}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Step {step} of 2
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="px-8 pb-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                      @
                    </span>
                    <Input
                      value={username}
                      onChange={(e) => {
                        setUsername(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9_]/g, ""),
                        );
                        setError("");
                      }}
                      placeholder="username"
                      maxLength={20}
                      disabled={loading}
                      className="h-14 pl-9 text-lg bg-transparent border-border focus-visible:ring-[#1d9bf0]"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground px-1">
                    Your username is how others will find you on X
                  </p>
                </div>

                {error && (
                  <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleRegenerateUsername}
                  variant="outline"
                  className="w-full h-12 rounded-full border-border hover:bg-muted/50"
                  disabled={loading}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate new username
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="p-6 bg-muted/30 rounded-2xl border border-border space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#1d9bf0]/10 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-[#1d9bf0]" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{countryName}</p>
                      <p className="text-sm text-muted-foreground">
                        Your location
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We detected your location to help show you relevant content
                    and connect you with people nearby.
                  </p>
                </div>

                {error && (
                  <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
                    {error}
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleContinue}
              className="w-full h-14 mt-8 bg-[#1d9bf0] hover:bg-[#1a8cd8] rounded-full text-base font-bold"
              disabled={loading || !username.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Just a moment...
                </>
              ) : step === 1 ? (
                "Next"
              ) : (
                "Get started"
              )}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
