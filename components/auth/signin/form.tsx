"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Eye, EyeOff } from "lucide-react";

export function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error: signInError } = await signIn.email({
      email,
      password,
    });

    if (signInError) {
      const errorMsg = signInError.message || "Failed to sign in";

      if (errorMsg.toLowerCase().includes("email")) {
        setFieldErrors({ email: errorMsg });
      } else if (errorMsg.toLowerCase().includes("password")) {
        setFieldErrors({ password: errorMsg });
      } else {
        setError(errorMsg);
      }

      setLoading(false);
      return;
    }

    if (data) {
      router.push("/");
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError("");

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setError("Failed to sign in with Google");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[400px] mx-auto px-4">
      <div className="mb-8 text-center">
        <div className="relative h-10 w-40 mx-auto mb-6">
          <Image
            src="/logo-text.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-[28px] font-bold leading-tight">Sign in</h1>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="p-3 text-[13px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg">
            {error}
          </div>
        )}

        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full h-[44px] rounded-full bg-white text-[15px] font-semibold text-black hover:bg-gray-200 border border-gray-300"
        >
          {googleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-[13px]">
            <span className="bg-background px-4 text-muted-foreground">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              disabled={loading || googleLoading}
              className={`h-[56px] bg-transparent border text-[15px] rounded-md focus-visible:ring-1 focus-visible:ring-[#1d9bf0] ${
                fieldErrors.email ? "border-red-500" : "border-border"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1.5 text-[13px] text-red-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              disabled={loading || googleLoading}
              className={`h-[56px] bg-transparent border text-[15px] rounded-md focus-visible:ring-1 focus-visible:ring-[#1d9bf0] pr-12 ${
                fieldErrors.password ? "border-red-500" : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[28px] -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={loading || googleLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-[#00ba7c]" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {fieldErrors.password && (
              <p className="mt-1.5 text-[13px] text-red-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-[44px] rounded-full bg-[#1d9bf0] text-[15px] font-bold text-white hover:bg-[#1a8cd8] disabled:opacity-50"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="pt-4 text-center">
          <span className="text-[15px] text-muted-foreground">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/signup"
            className="text-[15px] text-[#1d9bf0] hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
