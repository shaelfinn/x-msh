"use client";

import { useSession } from "@/lib/auth-client";
import { SignOutButton } from "@/components/auth/signout-button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DebugPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d9bf0] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Debug Session</h1>
            <SignOutButton />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[#1d9bf0]">
                ✓ You are logged in!
              </h2>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold mb-3">User Information</h3>
              <div className="bg-muted/30 rounded-md p-4 space-y-2">
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium text-muted-foreground">ID:</span>
                  <span className="col-span-2">{session.user.id}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium text-muted-foreground">
                    Name:
                  </span>
                  <span className="col-span-2">{session.user.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium text-muted-foreground">
                    Email:
                  </span>
                  <span className="col-span-2">{session.user.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium text-muted-foreground">
                    Email Verified:
                  </span>
                  <span className="col-span-2">
                    {session.user.emailVerified ? "Yes" : "No"}
                  </span>
                </div>
                {session.user.image && (
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium text-muted-foreground">
                      Image:
                    </span>
                    <span className="col-span-2">{session.user.image}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold mb-3">
                Session Information
              </h3>
              <div className="bg-muted/30 rounded-md p-4 space-y-2">
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium text-muted-foreground">
                    Session ID:
                  </span>
                  <span className="col-span-2 break-all">
                    {session.session.id}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium text-muted-foreground">
                    Expires At:
                  </span>
                  <span className="col-span-2">
                    {new Date(session.session.expiresAt).toLocaleString()}
                  </span>
                </div>
                {session.session.ipAddress && (
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium text-muted-foreground">
                      IP Address:
                    </span>
                    <span className="col-span-2">
                      {session.session.ipAddress}
                    </span>
                  </div>
                )}
                {session.session.userAgent && (
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium text-muted-foreground">
                      User Agent:
                    </span>
                    <span className="col-span-2 text-sm break-all">
                      {session.session.userAgent}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold mb-3">
                Full Session Object
              </h3>
              <pre className="bg-black/50 text-foreground rounded-md p-4 overflow-x-auto text-sm border border-border">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
