"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Loader2, MapPin, CheckCircle2 } from "lucide-react";
import { setupUserProfile, detectCountry } from "@/app/actions/user";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { authClient } from "@/lib/auth-client";

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
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 15);

  const random = Math.floor(Math.random() * 9999);
  return `${base}${random}`;
}

export function OnboardingDialog({ user }: OnboardingDialogProps) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState(() =>
    user.name ? generateUsername(user.name) : "",
  );
  const [detectedCountryCode, setDetectedCountryCode] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Detect country when component mounts
    detectCountry().then((country) => {
      setDetectedCountryCode(country);
    });
  }, []);

  const countryName = detectedCountryCode
    ? countries.getName(detectedCountryCode, "en")
    : null;

  const handleNext = () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await setupUserProfile({
        username: username.trim(),
        country: detectedCountryCode || undefined,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Show success state
      setSuccess(true);

      // Force session refresh and reload
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
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
            {success ? (
              <div className="text-center space-y-6 py-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#00ba7c]/10">
                  <CheckCircle2 className="h-10 w-10 text-[#00ba7c]" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">All set!</h2>
                  <p className="text-[15px] text-muted-foreground">
                    Redirecting to your feed...
                  </p>
                </div>
              </div>
            ) : step === 1 ? (
              <>
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
                    Step 1 of 2
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
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9_]/g, ""),
                        );
                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && username.trim() && !loading) {
                          handleNext();
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
                    onClick={handleNext}
                    className="w-full h-12 bg-[#1d9bf0] hover:bg-[#1a8cd8] rounded-full text-[15px] font-bold disabled:opacity-50"
                    disabled={!username.trim()}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-8 text-center space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1d9bf0]/10 mb-2">
                    <MapPin className="h-6 w-6 text-[#1d9bf0]" />
                  </div>
                  <h2 className="text-2xl font-bold">Confirm your location</h2>
                  <p className="text-[15px] text-muted-foreground">
                    Step 2 of 2
                  </p>
                </div>

                <div className="space-y-4">
                  {countryName ? (
                    <div className="p-6 bg-muted/30 rounded-xl border border-border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-[#1d9bf0]/10 flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5 text-[#1d9bf0]" />
                        </div>
                        <div>
                          <p className="text-lg font-bold">{countryName}</p>
                          <p className="text-sm text-muted-foreground">
                            Detected location
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We detected your location to show you relevant content
                        and trends.
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 bg-muted/30 rounded-xl border border-border text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Detecting your location...
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleSubmit}
                    className="w-full h-12 bg-[#1d9bf0] hover:bg-[#1a8cd8] rounded-full text-[15px] font-bold disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      "Accept and continue"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
