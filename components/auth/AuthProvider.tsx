"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/supabase/client";

type UserProfile = {
  id: string;
  username: string;
  avatar_url: string | null;
  role: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  refetchProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("id, username, avatar_url, role, email, first_name, last_name")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const refetchProfile = useCallback(async () => {
    if (session?.user?.id) {
      setProfileLoading(true);
      await loadProfile(session.user.id);
    }
  }, [session?.user?.id, loadProfile]);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      const {
        data: { session },
      } = await createClient().auth.getSession();

      if (!isMounted) return;
      setSession(session ?? null);
      setLoading(false);

      // Load profile if user is authenticated
      if (session?.user?.id) {
        setProfileLoading(true);
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    }

    init();

    const {
      data: { subscription },
    } = createClient().auth.onAuthStateChange(async (_event, session) => {
      setSession(session ?? null);

      // Load profile when auth state changes
      if (session?.user?.id) {
        setProfileLoading(true);
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    profileLoading,
    refetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
