"use client";

import { useSession } from "@/lib/auth-client";
import { OnboardingDialog } from "./dialog";

export function OnboardingCheck() {
  const { data: session, isPending } = useSession();

  if (isPending) return null;
  if (!session) return null;

  const username = (session.user as { username?: string }).username;

  if (username) return null;

  return (
    <OnboardingDialog
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        username: username || null,
        country: (session.user as { country?: string }).country || null,
      }}
    />
  );
}
