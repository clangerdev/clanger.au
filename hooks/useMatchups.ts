import { useQuery } from "@tanstack/react-query";
import {
  getMatchups,
  getMatchupById,
  getMatchupTeams,
  type MatchupWithDetails,
} from "@/services/matchups";
import { queryKeys } from "@/lib/query-keys";

export function useMatchups(leagueId: string, round?: number) {
  return useQuery({
    queryKey: queryKeys.matchups.byLeague(leagueId, round),
    queryFn: () => getMatchups(leagueId, round),
    staleTime: 30 * 1000, // 30 seconds - dynamic during live games
    enabled: !!leagueId,
    refetchInterval: 10000, // Refetch every 10 seconds for live matchups
  });
}

export function useMatchup(id: string) {
  return useQuery<MatchupWithDetails | null>({
    queryKey: queryKeys.matchups.detail(id),
    queryFn: () => getMatchupById(id),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!id,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useMatchupTeams(matchupId: string) {
  return useQuery({
    queryKey: queryKeys.matchups.teams.list(matchupId),
    queryFn: () => getMatchupTeams(matchupId),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!matchupId,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}
