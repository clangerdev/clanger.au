import { createClient } from "@/supabase/client";
import type { League, LeagueMember, DraftPick } from "@/types/database";

export async function getLeagues(): Promise<League[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getLeagueById(id: string): Promise<League | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }
  return data;
}

export async function getLeagueMembers(
  leagueId: string
): Promise<LeagueMember[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("league_members")
    .select("*")
    .eq("league_id", leagueId)
    .order("draft_position");

  if (error) throw error;
  return data || [];
}

export async function getDraftPicks(leagueId: string): Promise<DraftPick[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("draft_picks")
    .select("*")
    .eq("league_id", leagueId)
    .order("pick_number");

  if (error) throw error;
  return data || [];
}

export async function createDraftPick(
  pick: Omit<DraftPick, "id" | "created_at">
): Promise<DraftPick> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("draft_picks")
    .insert(pick)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createLeague(
  league: Omit<League, "id" | "created_at" | "updated_at">
): Promise<League> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leagues")
    .insert(league)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function joinLeague(
  leagueId: string,
  userId: string
): Promise<LeagueMember> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("league_members")
    .insert({
      league_id: leagueId,
      user_id: userId,
      is_commissioner: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

