"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Loader2 } from "lucide-react";

export default function DebugPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push("/signin");
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d9bf0] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-4">
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors"
        >
          {signingOut ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing out...
            </>
          ) : (
            <>
              <LogOut className="h-5 w-5" />
              Sign Out
            </>
          )}
        </button>

        {/* Session Data */}
        <div className="bg-muted/30 rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-semibold text-muted-foreground">
              Session Data
            </h2>
            <span className="text-[12px] text-green-500 font-medium">
              Active
            </span>
          </div>
          <pre className="bg-black/50 text-foreground rounded-lg p-3 overflow-x-auto text-[12px] leading-relaxed">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
