import { createClient } from "@/supabase/client";
import type { UserTeam, TeamRoster } from "@/types/database";

export async function getUserTeams(userId: string): Promise<UserTeam[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_teams")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getUserTeamById(id: string): Promise<UserTeam | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_teams")
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

export async function getTeamRoster(teamId: string): Promise<TeamRoster[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("team_rosters")
    .select("*")
    .eq("team_id", teamId)
    .order("position_slot")
    .order("slot_number");

  if (error) throw error;
  return data || [];
}

export async function createUserTeam(
  team: Omit<UserTeam, "id" | "created_at" | "updated_at">
): Promise<UserTeam> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_teams")
    .insert(team)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserTeam(
  id: string,
  updates: Partial<UserTeam>
): Promise<UserTeam> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_teams")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addPlayerToRoster(
  roster: Omit<TeamRoster, "id" | "created_at">
): Promise<TeamRoster> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("team_rosters")
    .insert(roster)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removePlayerFromRoster(rosterId: string): Promise<{ teamId: string }> {
  const supabase = createClient();

  // First get the team_id before deleting
  const { data: roster } = await supabase
    .from("team_rosters")
    .select("team_id")
    .eq("id", rosterId)
    .single();

  if (!roster) {
    throw new Error("Roster not found");
  }

  const { error } = await supabase
    .from("team_rosters")
    .delete()
    .eq("id", rosterId);

  if (error) throw error;
  return { teamId: roster.team_id };
}

