"use client";

import { useSession } from "@/lib/auth-client";
import { OnboardingDialog } from "./onboarding-dialog";

export function OnboardingCheck() {
  const { data: session, isPending } = useSession();

  // Don't show anything while loading
  if (isPending) return null;

  // Don't show if not logged in
  if (!session) return null;

  // Check if user has username (now available in session via additionalFields)
  const username = (session.user as any).username;
  const country = (session.user as any).country;

  // Don't show if user already has username
  if (username) return null;

  // Show onboarding dialog
  return (
    <OnboardingDialog
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        username: username || null,
        country: country || null,
      }}
    />
  );
}
