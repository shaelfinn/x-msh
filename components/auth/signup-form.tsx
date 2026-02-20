"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error: signUpError } = await signUp.email({
      name,
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message || "Failed to sign up");
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
        <h1 className="text-3xl font-bold mb-2">Join X today</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <Input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Name"
            disabled={loading}
            className="h-14 bg-transparent border-border text-base"
          />
        </div>

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
            minLength={8}
            disabled={loading}
            className="h-14 bg-transparent border-border text-base"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Must be at least 8 characters
          </p>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-full bg-[#1d9bf0] text-base font-bold text-white hover:bg-[#1a8cd8]"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="mt-10 text-center">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/signin" className="text-[#1d9bf0] hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
