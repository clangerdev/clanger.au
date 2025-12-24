import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  // If the link is missing required params, send user back with an error
  if (!token_hash || !type) {
    redirect("/auth/signin?error=invalid_link");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type,
  });

  if (error) {
    redirect("/auth/signin?error=verification_failed");
  }

  // Handle different OTP types
  if (type === "recovery") {
    // For password reset, redirect to reset-password page with token
    redirect(
      next || `/auth/reset-password?token_hash=${token_hash}&type=${type}`
    );
  } else {
    // For email verification, redirect to signin
    redirect(next ?? "/auth/signin?verified=1");
  }
}
