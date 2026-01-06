"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy, Wallet, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatCurrency } from "@/lib/utils";
import { useContests } from "@/hooks/useContests";
import { useUserTeams } from "@/hooks/useUserTeams";
import { useWallet } from "@/hooks/useWallet";
// import { useContestEntries } from "@/hooks/useContests";

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

export default function DashboardPage() {
  const { user, profile, loading, profileLoading } = useAuth();
  const router = useRouter();
  const { data: wallet } = useWallet(user?.id || "");
  const { data: userTeams = [] } = useUserTeams(user?.id || "");
  const { data: upcomingContests = [] } = useContests({
    status: "upcoming",
    sport: "AFL"
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
  }, [loading, user, router]);

  if (loading || !user || profileLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  // Get live entries - teams that have contest entries
  const liveEntries = userTeams.filter((t) => t.contest_id);
  const topContests = upcomingContests.slice(0, 3);

  // Use profile username if available, otherwise fallback to email or "there"
  const displayName = profile?.username || user.email?.split("@")[0] || "there";

  // Calculate stats (currently limited data on profile)
  const balance = wallet?.balance || 0;
  const totalWinnings = 0; // TODO: Calculate from transactions when available
  const contestsEntered = 0; // TODO: Derive from entries once available
  const contestsWon = 0; // TODO: Derive from results once available

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold font-display">
            Welcome back, {displayName}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your contests
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Wallet}
            label="Balance"
            value={formatCurrency(balance)}
          />
          <StatCard
            icon={TrendingUp}
            label="Total Winnings"
            value={formatCurrency(totalWinnings)}
          />
          <StatCard
            icon={Trophy}
            label="Contests Won"
            value={contestsWon.toString()}
            subtext={`of ${contestsEntered} entered`}
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
              {liveEntries.map((team) => (
                <Link key={team.id} href={team.contest_id ? `/live/${team.contest_id}` : "#"}>
                  <div className="p-4 rounded-xl bg-card border border-primary/30 hover:border-primary/50 transition-all card-hover">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">AFL</Badge>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <Zap className="h-3 w-3 mr-1" />
                          Live
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold">{team.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        View Details
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
            {topContests.map((contest) => (
              <Link key={contest.id} href={`/contests/${contest.id}`}>
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
                      {formatCurrency(contest.prize_pool)}
                    </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(contest.entry_fee)} entry
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
