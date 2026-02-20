"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("rememberMe") === "on";

    const { data, error: signInError } = await signIn.email({
      email,
      password,
      rememberMe,
    });

    if (signInError) {
      setError(signInError.message || "Failed to sign in");
      setLoading(false);
      return;
    }

    if (data) {
      router.push("/");
    }
  }

  return (
    <div className="w-full">
      <div className="mb-10">
        <svg
          viewBox="0 0 24 24"
          className="h-10 w-10 fill-foreground mx-auto mb-8"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <h1 className="text-3xl font-bold mb-2">Sign in to X</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            disabled={loading}
            className="h-14 bg-transparent border-border text-base"
          />
        </div>

        <div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            disabled={loading}
            className="h-14 bg-transparent border-border text-base"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            className="h-4 w-4 rounded border-border bg-transparent"
            defaultChecked
          />
          <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
            Remember me
          </label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-full bg-[#1d9bf0] text-base font-bold text-white hover:bg-[#1a8cd8]"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="mt-10 text-center">
        <span className="text-muted-foreground">
          Don&apos;t have an account?{" "}
        </span>
        <Link href="/signup" className="text-[#1d9bf0] hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
