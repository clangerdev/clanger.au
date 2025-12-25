"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import clangerLogo from "@/assets/clanger-logo.png";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    setError(undefined);

    startTransition(async () => {
      const supabase = createClient();

      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .single();

      if (existingUser) {
        setError("This username is already taken. Please choose another one.");
        return;
      }

      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (authError) {
        // Check if error is related to unique constraint
        if (
          authError.message.includes("duplicate") ||
          authError.message.includes("unique") ||
          authError.message.includes("violates unique constraint")
        ) {
          setError(
            "This username is already taken. Please choose another one."
          );
        } else {
          setError(
            authError.message ||
              "Unable to sign up. Please check your details and try again."
          );
        }
        return;
      }

      if (!authData.user) {
        setError("Failed to create user account");
        return;
      }

      // Verify user record was created successfully
      const { data: userRecord, error: userCheckError } = await supabase
        .from("users")
        .select("id, username")
        .eq("id", authData.user.id)
        .single();

      if (userCheckError || !userRecord) {
        setError(
          "Account created but profile setup failed. Please contact support."
        );
        return;
      }

      // Redirect to verify email page
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    });
  };

  return (
    <PublicLayout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Image
              src={clangerLogo}
              alt="Clanger"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold font-display">
              Create your account
            </h1>
            <p className="text-muted-foreground">Join the fantasy revolution</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-foreground"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="PickMaster99"
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                required
              />
            </div>

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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
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

            {/* Password requirements */}
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3" />
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3" />
                <span>One uppercase letter</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3" />
                <span>One number</span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive" aria-live="polite">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Terms */}
          <p className="text-center text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-primary hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
