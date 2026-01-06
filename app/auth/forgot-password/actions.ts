"use server";

import { resetPassword } from "@/services/auth";
import type { ForgotPasswordActionState } from "@/types/auth";
export type { ForgotPasswordActionState } from "@/types/auth";

export async function forgotPasswordAction(
  _prevState: ForgotPasswordActionState,
  formData: FormData
): Promise<ForgotPasswordActionState> {
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    return { error: "Please enter your email address." };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const result = await resetPassword(email);

  if (!result.success) {
    return { error: result.error };
  }

  return { success: true };
}

