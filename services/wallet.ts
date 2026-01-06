import { createClient } from "@/supabase/client";
import type { Wallet, Transaction } from "@/types/database";

export async function getWallet(userId: string): Promise<Wallet | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }
  return data;
}

export async function getTransactions(
  walletId: string
): Promise<Transaction[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("wallet_id", walletId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createTransaction(
  transaction: Omit<Transaction, "id" | "created_at">
): Promise<Transaction> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .insert(transaction)
    .select()
    .single();

  if (error) throw error;
  return data;
}

