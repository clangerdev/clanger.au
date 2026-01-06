import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeagues,
  getLeagueById,
  getLeagueMembers,
  getDraftPicks,
  createDraftPick,
  createLeague,
  joinLeague,
} from "@/services/leagues";
import { queryKeys } from "@/lib/query-keys";

export function useLeagues() {
  return useQuery({
    queryKey: queryKeys.leagues.list(),
    queryFn: getLeagues,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLeague(id: string) {
  return useQuery({
    queryKey: queryKeys.leagues.detail(id),
    queryFn: () => getLeagueById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
}

export function useLeagueMembers(leagueId: string) {
  return useQuery({
    queryKey: queryKeys.leagues.members.list(leagueId),
    queryFn: () => getLeagueMembers(leagueId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!leagueId,
  });
}

export function useDraftPicks(leagueId: string) {
  return useQuery({
    queryKey: queryKeys.leagues.draftPicks.list(leagueId),
    queryFn: () => getDraftPicks(leagueId),
    staleTime: 30 * 1000, // 30 seconds - dynamic during draft
    enabled: !!leagueId,
    // Refetch every 5 seconds during active drafts
    refetchInterval: 5000,
  });
}

export function useCreateDraftPick() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDraftPick,
    onSuccess: (data) => {
      // Invalidate draft picks
      queryClient.invalidateQueries({
        queryKey: queryKeys.leagues.draftPicks.all(data.league_id),
      });
      // Invalidate league to update draft status if needed
      queryClient.invalidateQueries({
        queryKey: queryKeys.leagues.detail(data.league_id),
      });
    },
  });
}

export function useCreateLeague() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLeague,
    onSuccess: () => {
      // Invalidate leagues list
      queryClient.invalidateQueries({
        queryKey: queryKeys.leagues.list(),
      });
    },
  });
}

export function useJoinLeague() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leagueId, userId }: { leagueId: string; userId: string }) =>
      joinLeague(leagueId, userId),
    onSuccess: (data) => {
      // Invalidate league members
      queryClient.invalidateQueries({
        queryKey: queryKeys.leagues.members.all(data.league_id),
      });
      // Invalidate league detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.leagues.detail(data.league_id),
      });
    },
  });
}

