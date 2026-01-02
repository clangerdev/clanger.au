import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserTeams,
  getUserTeamById,
  getTeamRoster,
  createUserTeam,
  updateUserTeam,
  addPlayerToRoster,
  removePlayerFromRoster,
} from "@/services/user-teams";
import { queryKeys } from "@/lib/query-keys";

export function useUserTeams(userId: string) {
  return useQuery({
    queryKey: queryKeys.userTeams.byUser(userId),
    queryFn: () => getUserTeams(userId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!userId,
  });
}

export function useUserTeam(id: string) {
  return useQuery({
    queryKey: queryKeys.userTeams.detail(id),
    queryFn: () => getUserTeamById(id),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!id,
  });
}

export function useTeamRoster(teamId: string) {
  return useQuery({
    queryKey: queryKeys.userTeams.roster.list(teamId),
    queryFn: () => getTeamRoster(teamId),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!teamId,
  });
}

export function useCreateUserTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserTeam,
    onSuccess: (data) => {
      // Invalidate user teams list
      queryClient.invalidateQueries({
        queryKey: queryKeys.userTeams.byUser(data.user_id),
      });
    },
  });
}

export function useUpdateUserTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Parameters<typeof updateUserTeam>[1]> }) =>
      updateUserTeam(id, updates),
    onSuccess: (data) => {
      // Invalidate team detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.userTeams.detail(data.id),
      });
      // Invalidate user teams list
      queryClient.invalidateQueries({
        queryKey: queryKeys.userTeams.byUser(data.user_id),
      });
    },
  });
}

export function useAddPlayerToRoster() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPlayerToRoster,
    onSuccess: (data) => {
      // Invalidate team roster
      queryClient.invalidateQueries({
        queryKey: queryKeys.userTeams.roster.all(data.team_id),
      });
      // Invalidate team detail (salary remaining might change)
      queryClient.invalidateQueries({
        queryKey: queryKeys.userTeams.detail(data.team_id),
      });
    },
  });
}

export function useRemovePlayerFromRoster() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePlayerFromRoster,
    onSuccess: (data) => {
      // Invalidate team roster
      queryClient.invalidateQueries({
        queryKey: queryKeys.userTeams.roster.all(data.teamId),
      });
      // Invalidate team detail (salary remaining might change)
      queryClient.invalidateQueries({
        queryKey: queryKeys.userTeams.detail(data.teamId),
      });
    },
  });
}

