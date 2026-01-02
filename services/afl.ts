import { createClient } from "@/supabase/client";
import type { AflTeam, AflPlayer, PlayerStats, AflFixture } from "@/types/database";

export async function getAflTeams(): Promise<AflTeam[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("afl_teams")
    .select("*")
    .order("name");

  if (error) throw error;
  return data || [];
}

export async function getAflPlayers(filters?: {
  position?: string;
  team_id?: string;
  status?: string;
}): Promise<AflPlayer[]> {
  const supabase = createClient();
  let query = supabase.from("afl_players").select("*");

  if (filters?.position) {
    query = query.eq("position", filters.position);
  }
  if (filters?.team_id) {
    query = query.eq("team_id", filters.team_id);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query.order("name");

  if (error) throw error;
  return data || [];
}

export async function getPlayerStats(
  playerId: string,
  round?: number
): Promise<PlayerStats[]> {
  const supabase = createClient();
  let query = supabase
    .from("player_stats")
    .select("*")
    .eq("player_id", playerId);

  if (round) {
    query = query.eq("round", round);
  }

  const { data, error } = await query.order("round", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAflFixtures(round?: number): Promise<AflFixture[]> {
  const supabase = createClient();
  let query = supabase.from("afl_fixtures").select("*");

  if (round) {
    query = query.eq("round", round);
  }

  const { data, error } = await query.order("start_time");

  if (error) throw error;
  return data || [];
}

