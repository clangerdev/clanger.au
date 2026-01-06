import { useQuery } from "@tanstack/react-query";
import { getAflTeams, getAflPlayers, getPlayerStats, getAflFixtures } from "@/services/afl";
import { queryKeys } from "@/lib/query-keys";

export function useAflTeams() {
  return useQuery({
    queryKey: queryKeys.afl.teams.list(),
    queryFn: getAflTeams,
    staleTime: 60 * 60 * 1000, // 1 hour - static data
  });
}

export function useAflPlayers(filters?: {
  position?: string;
  team_id?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: queryKeys.afl.players.list(filters),
    queryFn: () => getAflPlayers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes - semi-static
  });
}

export function usePlayerStats(playerId: string, round?: number) {
  return useQuery({
    queryKey: queryKeys.afl.stats.byPlayer(playerId, round),
    queryFn: () => getPlayerStats(playerId, round),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!playerId,
  });
}

export function useAflFixtures(round?: number) {
  return useQuery({
    queryKey: queryKeys.afl.fixtures.list(round),
    queryFn: () => getAflFixtures(round),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

