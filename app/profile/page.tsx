"use client";

import { useState, useEffect, useCallback } from "react";
import {
  User,
  Trophy,
  Wallet,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";
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
};

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Default stats (can be replaced with real data from database later)
  const [stats] = useState({
    balance: 0,
    totalWinnings: 0,
    contestsWon: 0,
    contestsEntered: 0,
  });

  const loadProfile = useCallback(async () => {
    if (!authUser) return;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("id, username, avatar_url, role, email, first_name, last_name")
        .eq("id", authUser.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
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
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="text-center">
          {profile.avatar_url ? (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-border">
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
              <User className="h-12 w-12 text-primary-foreground" />
            </div>
          )}
          <h1 className="text-2xl font-bold font-display">
            {profile.username}
          </h1>
          <p className="text-muted-foreground">
            {profile.email || authUser.email || "No email"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <Wallet className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {formatCurrency(stats.balance)}
            </p>
            <p className="text-sm text-muted-foreground">Balance</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <TrendingUp className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {formatCurrency(stats.totalWinnings)}
            </p>
            <p className="text-sm text-muted-foreground">Total Winnings</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.contestsWon}</p>
            <p className="text-sm text-muted-foreground">Contests Won</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <Trophy className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.contestsEntered}</p>
            <p className="text-sm text-muted-foreground">Contests Entered</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => router.push("/profile/edit")}
          >
            <Settings className="h-5 w-5" />
            Account Settings
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <Wallet className="h-5 w-5" />
            Deposit / Withdraw
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
