"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { loginWithEmailPassword } from "@/services/auth";

export type LoginActionState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const result = await loginWithEmailPassword(email, password);

  if (!result.success) {
    return { error: result.error };
  }

  // Mark user as logged in (temporary app-level session)
  const cookieStore = await cookies();
  cookieStore.set("clanger_session", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  // Redirect to dashboard after successful login
  redirect("/dashboard");
}
