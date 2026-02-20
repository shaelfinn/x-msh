"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
    setLoading(false);
  }

  return (
    <Button onClick={handleSignOut} disabled={loading} variant="outline">
      {loading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
