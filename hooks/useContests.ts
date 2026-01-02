import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContests,
  getContestById,
  getContestsByIds,
  getContestEntries,
  getContestEntriesByUser,
  createContestEntry,
  updateContestEntry,
} from "@/services/contests";
import { queryKeys } from "@/lib/query-keys";

export function useContests(filters?: {
  type?: "daily" | "season-long";
  status?: "upcoming" | "live" | "completed";
  sport?: string;
}) {
  return useQuery({
    queryKey: queryKeys.contests.list(filters),
    queryFn: () => getContests(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useContest(id: string) {
  return useQuery({
    queryKey: queryKeys.contests.detail(id),
    queryFn: () => getContestById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
}

export function useContestsByIds(ids: string[]) {
  return useQuery({
    queryKey: [...queryKeys.contests.all, "byIds", ids.sort().join(",")],
    queryFn: () => getContestsByIds(ids),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: ids.length > 0,
  });
}

export function useContestEntries(contestId: string) {
  return useQuery({
    queryKey: queryKeys.contests.entries.list(contestId),
    queryFn: () => getContestEntries(contestId),
    staleTime: 30 * 1000, // 30 seconds - dynamic data
    enabled: !!contestId,
  });
}

export function useContestEntriesByUser(userId: string) {
  return useQuery({
    queryKey: [...queryKeys.contests.entries.all(""), "user", userId],
    queryFn: () => getContestEntriesByUser(userId),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!userId,
  });
}

export function useCreateContestEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContestEntry,
    onSuccess: (data) => {
      // Invalidate contest entries list
      queryClient.invalidateQueries({
        queryKey: queryKeys.contests.entries.all(data.contest_id),
      });
      // Invalidate contest detail to update entry count
      queryClient.invalidateQueries({
        queryKey: queryKeys.contests.detail(data.contest_id),
      });
    },
  });
}

export function useUpdateContestEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Parameters<typeof updateContestEntry>[1]> }) =>
      updateContestEntry(id, updates),
    onSuccess: (data) => {
      // Invalidate contest entries
      queryClient.invalidateQueries({
        queryKey: queryKeys.contests.entries.all(data.contest_id),
      });
    },
  });
}

