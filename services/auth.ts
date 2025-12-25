import { createClient } from "@/supabase/server";

export type AuthResult = { success: true } | { success: false; error: string };

export async function loginWithEmailPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error:
        error.message ||
        "Unable to sign in. Please check your credentials and try again.",
    };
  }

  return { success: true };
}

export async function signUpWithEmailPassword(
  email: string,
  password: string,
  username: string
): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    return {
      success: false,
      error:
        error.message ||
        "Unable to sign up. Please check your details and try again.",
    };
  }

  return { success: true };
}

export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = await createClient();

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const redirectUrl = `${siteUrl}/auth/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    return {
      success: false,
      error:
        error.message ||
        "Unable to send password reset email. Please try again.",
    };
  }

  return { success: true };
}
