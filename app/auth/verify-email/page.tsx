"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import clangerLogo from "@/assets/clanger-logo.png";
import { Mail } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

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
              Check your email
            </h1>
            <p className="text-muted-foreground">
              We've sent a verification link to your email address
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-md bg-muted/50 border border-border p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-foreground mb-2">
                {email ? (
                  <>
                    We've sent a verification link to{" "}
                    <span className="font-medium">{email}</span>
                  </>
                ) : (
                  "We've sent a verification link to your email address"
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Please check your inbox and click the verification link to
                activate your account. The link will expire in 24 hours.
              </p>
            </div>

            <div className="rounded-md bg-muted/30 border border-border p-4">
              <p className="text-xs text-muted-foreground mb-2">
                <strong className="text-foreground">
                  Didn't receive the email?
                </strong>
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>Wait a few minutes and check again</li>
              </ul>
            </div>

            <div>
              <Link href="/auth/signin" className="block">
                <Button variant="outline" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <PublicLayout showFooter={false}>
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-8">
              <div className="text-center">
                <Image
                  src={clangerLogo}
                  alt="Clanger"
                  className="w-16 h-16 mx-auto mb-4"
                />
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          </div>
        </PublicLayout>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
