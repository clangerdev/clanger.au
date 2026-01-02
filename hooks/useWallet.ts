import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWallet, getTransactions, createTransaction } from "@/services/wallet";
import { queryKeys } from "@/lib/query-keys";

export function useWallet(userId: string) {
  return useQuery({
    queryKey: queryKeys.wallet.byUser(userId),
    queryFn: () => getWallet(userId),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!userId,
  });
}

export function useTransactions(walletId: string) {
  return useQuery({
    queryKey: queryKeys.wallet.transactions.list(walletId),
    queryFn: () => getTransactions(walletId),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!walletId,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: (data) => {
      // Invalidate transactions list
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallet.transactions.all(data.wallet_id),
      });
      // Invalidate wallet balance
      // We'd need to get userId from wallet, but for now invalidate all wallets
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallet.all,
      });
    },
  });
}

