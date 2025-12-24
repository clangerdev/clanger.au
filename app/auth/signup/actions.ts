"use server";

import { redirect } from "next/navigation";
import { signUpWithEmailPassword } from "@/services/auth";

export type SignupActionState = {
  error?: string;
};

export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> {
  const username = String(formData.get("username") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !email || !password) {
    return { error: "Please fill in username, email and password." };
  }

  const result = await signUpWithEmailPassword(email, password, username);

  if (!result.success) {
    return { error: result.error };
  }

  // After successful signup, send the user to sign in
  redirect("/auth/signin");
}


