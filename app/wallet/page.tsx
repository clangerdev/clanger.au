"use client";

import { Wallet, Plus, ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useWallet, useTransactions } from "@/hooks/useWallet";
import { useAuth } from "@/components/auth/AuthProvider";

export default function WalletPage() {
  const { user } = useAuth();
  const { data: wallet, isLoading: walletLoading } = useWallet(user?.id || "");
  const { data: transactions = [], isLoading: transactionsLoading } =
    useTransactions(wallet?.id || "");

  if (walletLoading || transactionsLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading wallet...</p>
        </div>
      </AppLayout>
    );
  }

  const balance = wallet?.balance || 0;
  const recentTransactions = transactions.slice(0, 10).map((t) => ({
    id: t.id,
    type:
      t.type === "prize" ? "win" : t.type === "entry_fee" ? "entry" : "deposit",
    amount:
      t.type === "prize"
        ? t.amount
        : t.type === "entry_fee"
        ? -t.amount
        : t.amount,
    description:
      t.description ||
      (t.type === "prize"
        ? "Winnings"
        : t.type === "entry_fee"
        ? "Entry Fee"
        : "Deposit"),
    date: new Date(t.created_at).toLocaleDateString(),
  }));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-display">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your account balance and transactions
          </p>
        </div>

        {/* Balance Card */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/20">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
            <Button variant="outline">
              <ArrowDown className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === "deposit" ||
                        transaction.type === "win"
                          ? "bg-green-500/20"
                          : "bg-red-500/20"
                      }`}
                    >
                      {transaction.type === "deposit" ? (
                        <ArrowUp className="h-4 w-4 text-green-400" />
                      ) : transaction.type === "win" ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.amount > 0
                          ? "text-green-400"
                          : "text-foreground"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        transaction.type === "deposit" ||
                        transaction.type === "win"
                          ? "border-green-500/30 text-green-400"
                          : "border-red-500/30 text-red-400"
                      }
                    >
                      {transaction.type === "deposit"
                        ? "Deposit"
                        : transaction.type === "win"
                        ? "Winnings"
                        : "Entry Fee"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
