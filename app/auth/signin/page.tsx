"use client";

import { useState, useTransition, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import clangerLogo from "@/assets/clanger-logo.png";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verified = searchParams.get("verified");
    const passwordReset = searchParams.get("password_reset");
    const errorParam = searchParams.get("error");

    if (verified === "1") {
      setSuccessMessage("Email verified successfully! You can now sign in.");
      // Clean up URL
      router.replace("/auth/signin", { scroll: false });
    } else if (passwordReset === "success") {
      setSuccessMessage("Password reset successfully! You can now sign in.");
      // Clean up URL
      router.replace("/auth/signin", { scroll: false });
    } else if (errorParam === "invalid_link") {
      setError("Invalid verification link. Please request a new one.");
      // Clean up URL
      router.replace("/auth/signin", { scroll: false });
    } else if (errorParam === "verification_failed") {
      setError("Verification failed. Please try again or request a new link.");
      // Clean up URL
      router.replace("/auth/signin", { scroll: false });
    }
  }, [searchParams, router]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    setError(undefined);

    startTransition(async () => {
      const { error } = await createClient().auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(
          error.message ||
            "Unable to sign in. Please check your credentials and try again."
        );
        return;
      }

      router.push("/dashboard");
    });
  };

  return (
    <PublicLayout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Image
              src={clangerLogo}
              alt="Clanger"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold font-display">Welcome back</h1>
            <p className="text-muted-foreground">
              Log in to your Clanger account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-input bg-card px-3 py-2 pr-10 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {successMessage && (
              <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3">
                <p
                  className="text-sm text-green-600 dark:text-green-400"
                  aria-live="polite"
                >
                  {successMessage}
                </p>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive" aria-live="polite">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Log In"}
            </Button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
