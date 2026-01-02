import { createClient } from "@/supabase/client";
import type { Contest, ContestEntry } from "@/types/database";

export async function getContests(filters?: {
  type?: "daily" | "season-long";
  status?: "upcoming" | "live" | "completed";
  sport?: string;
}): Promise<Contest[]> {
  const supabase = createClient();
  let query = supabase.from("contests").select("*");

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.sport) {
    query = query.eq("sport", filters.sport);
  }

  const { data, error } = await query.order("start_time", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getContestById(id: string): Promise<Contest | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    throw error;
  }
  return data;
}

export async function getContestsByIds(ids: string[]): Promise<Contest[]> {
  if (ids.length === 0) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contests")
    .select("*")
    .in("id", ids);

  if (error) throw error;
  return data || [];
}

export async function getContestEntries(
  contestId: string
): Promise<ContestEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contest_entries")
    .select("*")
    .eq("contest_id", contestId)
    .order("points", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getContestEntriesByUser(
  userId: string
): Promise<ContestEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contest_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createContestEntry(
  entry: Omit<ContestEntry, "id" | "created_at" | "updated_at">
): Promise<ContestEntry> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contest_entries")
    .insert(entry)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateContestEntry(
  id: string,
  updates: Partial<ContestEntry>
): Promise<ContestEntry> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contest_entries")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

