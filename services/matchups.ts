import { createClient } from "@/supabase/client";
import type {
  Matchup,
  MatchupTeam,
  MatchupPlayer,
  AflPlayer,
} from "@/types/database";

// Extended type for matchup with full team and player data
export interface MatchupWithDetails {
  id: string;
  league_id: string;
  round: number;
  home_team_id: string;
  away_team_id: string;
  status: "upcoming" | "live" | "completed";
  game_time: string;
  created_at: string;
  updated_at: string;
  homeTeam: {
    id: string;
    user_id: string;
    username: string;
    total_points: number;
    projected_total: number;
    players: Array<MatchupPlayer & { player: AflPlayer }>;
  };
  awayTeam: {
    id: string;
    user_id: string;
    username: string;
    total_points: number;
    projected_total: number;
    players: Array<MatchupPlayer & { player: AflPlayer }>;
  };
  leagueName?: string;
}

export async function getMatchups(
  leagueId: string,
  round?: number
): Promise<Matchup[]> {
  const supabase = createClient();
  let query = supabase.from("matchups").select("*").eq("league_id", leagueId);

  if (round) {
    query = query.eq("round", round);
  }

  const { data, error } = await query.order("round").order("game_time");

  if (error) throw error;
  return data || [];
}

export async function getMatchupById(
  id: string
): Promise<MatchupWithDetails | null> {
  const supabase = createClient();

  // Get matchup
  const { data: matchup, error: matchupError } = await supabase
    .from("matchups")
    .select("*")
    .eq("id", id)
    .single();

  if (matchupError) {
    if (matchupError.code === "PGRST116") {
      return null;
    }
    throw matchupError;
  }

  if (!matchup) return null;

  // Get league name
  const { data: league } = await supabase
    .from("leagues")
    .select("name")
    .eq("id", matchup.league_id)
    .single();

  // Get home and away teams
  const { data: homeTeamData } = await supabase
    .from("user_teams")
    .select("id, user_id, name")
    .eq("id", matchup.home_team_id)
    .single();

  const { data: awayTeamData } = await supabase
    .from("user_teams")
    .select("id, user_id, name")
    .eq("id", matchup.away_team_id)
    .single();

  // Get matchup teams
  const { data: matchupTeams, error: teamsError } = await supabase
    .from("matchup_teams")
    .select("*")
    .eq("matchup_id", id);

  if (teamsError) throw teamsError;

  const homeMatchupTeam = matchupTeams?.find(
    (mt) => mt.user_id === homeTeamData?.user_id
  );
  const awayMatchupTeam = matchupTeams?.find(
    (mt) => mt.user_id === awayTeamData?.user_id
  );

  // Get users for usernames
  const userIds = [homeTeamData?.user_id, awayTeamData?.user_id].filter(
    Boolean
  ) as string[];
  const { data: users } = await supabase
    .from("users")
    .select("id, username")
    .in("id", userIds);

  const homeUser = users?.find((u) => u.id === homeTeamData?.user_id);
  const awayUser = users?.find((u) => u.id === awayTeamData?.user_id);

  // Get matchup players for home team
  const homePlayers: Array<MatchupPlayer & { player: AflPlayer }> = [];
  if (homeMatchupTeam) {
    const { data: matchupPlayers } = await supabase
      .from("matchup_players")
      .select("*")
      .eq("matchup_team_id", homeMatchupTeam.id);

    if (matchupPlayers) {
      const playerIds = matchupPlayers.map((mp) => mp.player_id);
      const { data: players } = await supabase
        .from("afl_players")
        .select("*")
        .in("id", playerIds);

      homePlayers.push(
        ...matchupPlayers
          .map((mp) => {
            const player = players?.find((p) => p.id === mp.player_id);
            return player ? { ...mp, player } : null;
          })
          .filter(
            (mp): mp is MatchupPlayer & { player: AflPlayer } => mp !== null
          )
      );
    }
  }

  // Get matchup players for away team
  const awayPlayers: Array<MatchupPlayer & { player: AflPlayer }> = [];
  if (awayMatchupTeam) {
    const { data: matchupPlayers } = await supabase
      .from("matchup_players")
      .select("*")
      .eq("matchup_team_id", awayMatchupTeam.id);

    if (matchupPlayers) {
      const playerIds = matchupPlayers.map((mp) => mp.player_id);
      const { data: players } = await supabase
        .from("afl_players")
        .select("*")
        .in("id", playerIds);

      awayPlayers.push(
        ...matchupPlayers
          .map((mp) => {
            const player = players?.find((p) => p.id === mp.player_id);
            return player ? { ...mp, player } : null;
          })
          .filter(
            (mp): mp is MatchupPlayer & { player: AflPlayer } => mp !== null
          )
      );
    }
  }

  return {
    ...matchup,
    leagueName: league?.name,
    homeTeam: {
      id: homeMatchupTeam?.id || "",
      user_id: homeTeamData?.user_id || "",
      username: homeUser?.username || homeTeamData?.name || "Unknown",
      total_points: homeMatchupTeam?.total_points || 0,
      projected_total: homeMatchupTeam?.projected_total || 0,
      players: homePlayers,
    },
    awayTeam: {
      id: awayMatchupTeam?.id || "",
      user_id: awayTeamData?.user_id || "",
      username: awayUser?.username || awayTeamData?.name || "Unknown",
      total_points: awayMatchupTeam?.total_points || 0,
      projected_total: awayMatchupTeam?.projected_total || 0,
      players: awayPlayers,
    },
  };
}

export async function getMatchupTeams(
  matchupId: string
): Promise<MatchupTeam[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("matchup_teams")
    .select("*")
    .eq("matchup_id", matchupId);

  if (error) throw error;
  return data || [];
}
