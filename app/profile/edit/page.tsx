"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { X, Save, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatCurrency } from "@/lib/utils";

type UserProfile = {
  id: string;
  username: string;
  avatar_url: string | null;
  role: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  mobile: string | null;
  dob: string | null;
  kyc_verified: boolean;
  created_at: string;
  last_signed_in: string | null;
  total_time_on_site: number;
  number_of_sessions: number;
  time_of_last_entry_into_contest: string | null;
  number_of_contests_entered: number;
  number_of_contests_won: number;
  total_amount_spent: number;
};

// Format date to readable string
function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format date and time to readable string
function formatDateTime(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Format seconds to human-readable duration
function formatDuration(seconds: number): string {
  if (seconds === 0) return "0 minutes";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);

  return parts.join(", ") || "Less than a minute";
}

export default function EditProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const loadProfile = useCallback(async () => {
    if (!authUser) return;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("id, username, avatar_url, role, email, first_name, last_name, mobile, dob, kyc_verified, created_at, last_signed_in, total_time_on_site, number_of_sessions, time_of_last_entry_into_contest, number_of_contests_entered, number_of_contests_won, total_amount_spent")
        .eq("id", authUser.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setUsername(data.username);
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setMobile(data.mobile || "");
        setDob(data.dob || "");
        setAvatarPreview(data.avatar_url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      router.replace("/auth/signin");
      return;
    }

    loadProfile();
  }, [authUser, authLoading, router, loadProfile]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(undefined);
    }
  };

  const removeAvatar = async () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // If there's an existing avatar, delete it from storage
    if (profile?.avatar_url && authUser) {
      try {
        const supabase = createClient();
        // Extract the file path from the URL
        const urlParts = profile.avatar_url.split("/");
        const fileName = urlParts.slice(-2).join("/"); // Get user_id/filename

        await supabase.storage.from("avatars").remove([fileName]);

        // Update the profile to remove avatar_url
        await supabase
          .from("users")
          .update({ avatar_url: null })
          .eq("id", authUser.id);

        setProfile({ ...profile, avatar_url: null });
      } catch (err) {
        console.error("Failed to remove avatar:", err);
      }
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
    setSuccess(undefined);

    if (!authUser || !profile) return;

    startTransition(async () => {
      try {
        const supabase = createClient();
        let avatarUrl = profile.avatar_url;

        // Upload new avatar if provided
        if (avatarFile) {
          const fileExt = avatarFile.name.split(".").pop();
          const fileName = `${authUser.id}/avatar.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(fileName, avatarFile, {
              cacheControl: "3600",
              upsert: true,
            });

          if (uploadError) {
            throw new Error(`Failed to upload avatar: ${uploadError.message}`);
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);
          avatarUrl = urlData.publicUrl;
        }

        // Check if username is already taken by another user
        if (username.trim() !== profile.username) {
          const { data: existingUser } = await supabase
            .from("users")
            .select("username")
            .eq("username", username.trim())
            .neq("id", authUser.id)
            .single();

          if (existingUser) {
            throw new Error(
              "This username is already taken. Please choose another one."
            );
          }
        }

        // Update user record
        const { error: updateError } = await supabase
          .from("users")
          .update({
            username: username.trim(),
            first_name: firstName.trim() || null,
            last_name: lastName.trim() || null,
            mobile: mobile.trim() || null,
            dob: dob.trim() || null,
            avatar_url: avatarUrl,
          })
          .eq("id", authUser.id);

        if (updateError) {
          // Check if it's a unique constraint error
          if (
            updateError.message.includes("duplicate") ||
            updateError.message.includes("unique") ||
            updateError.code === "23505"
          ) {
            throw new Error(
              "This username is already taken. Please choose another one."
            );
          }
          throw new Error(`Failed to update profile: ${updateError.message}`);
        }

        // Update local state
        setProfile({
          ...profile,
          username: username.trim(),
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
          mobile: mobile.trim() || null,
          dob: dob.trim() || null,
          avatar_url: avatarUrl,
        });
        setAvatarFile(null);
        setSuccess("Profile updated successfully!");

        // Redirect to profile page after successful update
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update profile"
        );
      }
    });
  };

  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (!authUser || !profile) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          {/* Avatar Upload */}
          <div className="space-y-2">
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-foreground"
            >
              Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarPreview ? (
                  <div className="relative">
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      width={120}
                      height={120}
                      className="rounded-full object-cover border-2 border-input"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90 shadow-sm"
                      aria-label="Remove avatar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-[120px] h-[120px] rounded-full border-2 border-input flex items-center justify-center bg-muted">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto"
                >
                  {avatarPreview ? "Change Avatar" : "Upload Avatar"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-foreground"
              >
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-foreground"
              >
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </div>
          </div>

          {/* Mobile and Date of Birth */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-foreground"
              >
                Mobile
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-foreground"
              >
                Date of Birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </div>
          </div>

          {/* Username */}
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="PickMaster99"
              className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              required
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
              {profile.email || authUser.email || "Not set"}
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          {/* Role (read-only) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Role
            </label>
            <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
              <span className="capitalize">{profile.role}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Role cannot be changed
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-6"></div>

          {/* Read-only Account Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Account Information</h2>

            {/* Name (combined first and last) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Name
              </label>
              <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {profile.first_name || profile.last_name
                  ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
                  : "Not set"}
              </div>
            </div>

            {/* Date of Account Creation */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Date of Account Creation
              </label>
              <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {formatDate(profile.created_at)}
              </div>
            </div>

            {/* Last Signed In */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Last Signed In
              </label>
              <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {formatDateTime(profile.last_signed_in)}
              </div>
            </div>

            {/* KYC Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                KYC Status
              </label>
              <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                <span
                  className={
                    profile.kyc_verified
                      ? "text-green-400 font-medium"
                      : "text-muted-foreground"
                  }
                >
                  {profile.kyc_verified ? "Verified" : "Not Verified"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                KYC verification status cannot be changed here
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-6"></div>

          {/* Read-only Activity Statistics */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Activity Statistics</h2>

            {/* Total Time on Site */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Total Time on Site
              </label>
              <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {formatDuration(profile.total_time_on_site)}
              </div>
            </div>

            {/* Number of Sessions */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Number of Sessions
              </label>
              <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {profile.number_of_sessions}
              </div>
            </div>

            {/* Time of Last Entry into Contest */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Time of Last Entry into Contest
              </label>
              <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {formatDateTime(profile.time_of_last_entry_into_contest)}
              </div>
            </div>

            {/* Number of Contests Entered */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Number of Contests Entered
              </label>
              <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {profile.number_of_contests_entered}
              </div>
            </div>

            {/* Number of Contests Won */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Number of Contests Won
              </label>
              <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {profile.number_of_contests_won}
              </div>
            </div>

            {/* Total Amount Spent */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Total Amount Spent
              </label>
              <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {formatCurrency(profile.total_amount_spent)}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive" aria-live="polite">
              {error}
            </p>
          )}

          {success && (
            <p
              className="text-sm text-green-600 dark:text-green-400"
              aria-live="polite"
            >
              {success}
            </p>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/profile")}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
