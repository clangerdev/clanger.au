import { createClient } from "@/supabase/client";
import type { LeagueStanding } from "@/types/database";

export async function getLeagueStandings(
  leagueId: string
): Promise<LeagueStanding[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("league_standings")
    .select("*")
    .eq("league_id", leagueId)
    .order("rank");

  if (error) throw error;
  return data || [];
}

export async function calculateStandings(
  leagueId: string
): Promise<LeagueStanding[]> {
  // This would typically be a database function or edge function
  // For now, just return the current standings
  return getLeagueStandings(leagueId);
}

