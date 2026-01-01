"use client";

import { Wallet, Plus, ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/data/mockData";

export default function WalletPage() {
  // Mock wallet data
  const balance = 1250.50;
  const recentTransactions = [
    { id: 1, type: "deposit", amount: 500, description: "Deposit", date: "2024-01-15" },
    { id: 2, type: "entry", amount: -25, description: "Entry Fee - Daily Contest", date: "2024-01-14" },
    { id: 3, type: "win", amount: 150, description: "Winnings - Top 3 Finish", date: "2024-01-13" },
    { id: 4, type: "entry", amount: -50, description: "Entry Fee - Season League", date: "2024-01-12" },
    { id: 5, type: "deposit", amount: 200, description: "Deposit", date: "2024-01-10" },
  ];

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
                        transaction.type === "deposit" || transaction.type === "win"
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
                        transaction.type === "deposit" || transaction.type === "win"
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

