import {
  User,
  Trophy,
  Wallet,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { mockUser, formatCurrency } from "@/data/mockData";

export default function Profile() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
            <User className="h-12 w-12 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-display">
            {mockUser.username}
          </h1>
          <p className="text-muted-foreground">{mockUser.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <Wallet className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {formatCurrency(mockUser.balance)}
            </p>
            <p className="text-sm text-muted-foreground">Balance</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <TrendingUp className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {formatCurrency(mockUser.totalWinnings)}
            </p>
            <p className="text-sm text-muted-foreground">Total Winnings</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{mockUser.contestsWon}</p>
            <p className="text-sm text-muted-foreground">Contests Won</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <Trophy className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold">{mockUser.contestsEntered}</p>
            <p className="text-sm text-muted-foreground">Contests Entered</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-3">
            <Settings className="h-5 w-5" />
            Account Settings
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <Wallet className="h-5 w-5" />
            Deposit / Withdraw
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
