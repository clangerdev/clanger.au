"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction } from "./actions";
import clangerLogo from "@/assets/clanger-logo.png";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await forgotPasswordAction(
        { error: undefined, success: false },
        formData
      );
      if (result?.error) {
        setError(result.error);
        setSuccess(false);
      } else if (result?.success) {
        setSuccess(true);
        setError(undefined);
      }
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
            <h1 className="text-2xl font-bold font-display">
              Reset your password
            </h1>
            <p className="text-muted-foreground">
              {success
                ? "Check your email for a password reset link"
                : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="rounded-md bg-muted/50 border border-border p-4 text-center">
                <p className="text-sm text-foreground">
                  We've sent a password reset link to your email address. Please
                  check your inbox and follow the instructions to reset your
                  password.
                </p>
              </div>
              <div className="space-y-4">
                <Link href="/auth/signin">
                  <Button variant="outline" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-4" action={onSubmit}>
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

              {error && (
                <p className="text-sm text-destructive" aria-live="polite">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}

          {/* Back to sign in link */}
          {!success && (
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                href="/auth/signin"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
