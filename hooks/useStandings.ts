import { useQuery } from "@tanstack/react-query";
import { getLeagueStandings } from "@/services/standings";
import { queryKeys } from "@/lib/query-keys";

export function useLeagueStandings(leagueId: string) {
  return useQuery({
    queryKey: queryKeys.standings.byLeague(leagueId),
    queryFn: () => getLeagueStandings(leagueId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!leagueId,
  });
}

