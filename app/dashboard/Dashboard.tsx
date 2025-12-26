import Link from "next/link";
import { Trophy, Wallet, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  mockUser,
  mockUserEntries,
  mockContests,
  formatCurrency,
} from "@/data/mockData";

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {subtext && (
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const liveEntries = mockUserEntries.filter((e) => e.status === "live");
  const upcomingContests = mockContests
    .filter((c) => c.status === "upcoming")
    .slice(0, 3);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold font-display">
            Welcome back, {mockUser.username}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your contests
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Wallet}
            label="Balance"
            value={formatCurrency(mockUser.balance)}
          />
          <StatCard
            icon={TrendingUp}
            label="Total Winnings"
            value={formatCurrency(mockUser.totalWinnings)}
          />
          <StatCard
            icon={Trophy}
            label="Contests Won"
            value={mockUser.contestsWon.toString()}
            subtext={`of ${mockUser.contestsEntered} entered`}
          />
          <StatCard
            icon={Zap}
            label="Live Entries"
            value={liveEntries.length.toString()}
          />
        </div>

        {/* Live Entries */}
        {liveEntries.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Live Now
              </h2>
              <Link href="/my-contests">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {liveEntries.map((entry) => (
                <Link key={entry.id} href={`/live/${entry.contestId}`}>
                  <div className="p-4 rounded-xl bg-card border border-primary/30 hover:border-primary/50 transition-all card-hover">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{entry.sport}</Badge>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <Zap className="h-3 w-3 mr-1" />
                          Live
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        #{entry.currentRank} of {entry.totalEntrants}
                      </span>
                    </div>
                    <h3 className="font-semibold">{entry.contestName}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold text-primary">
                        {entry.points.toFixed(1)} pts
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Win up to {formatCurrency(entry.potentialWin)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Contests */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Featured Contests</h2>
            <Link href="/lobby">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingContests.map((contest) => (
              <Link key={contest.id} href={`/contest/${contest.id}`}>
                <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all card-hover">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{contest.sport}</Badge>
                    {contest.guaranteed && (
                      <Badge variant="secondary" className="text-xs">
                        Guaranteed
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{contest.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary font-bold">
                      {formatCurrency(contest.prizePool)}
                    </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(contest.entryFee)} entry
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
