import Link from "next/link";
import { Trophy, Wallet, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWallet } from "@/hooks/useWallet";
import { useContestEntriesByUser } from "@/hooks/useContests";
import { useContests } from "@/hooks/useContests";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/supabase/client";

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
  const { user, profile } = useAuth();
  const { data: wallet } = useWallet(user?.id || "");
  const { data: contestEntries = [] } = useContestEntriesByUser(user?.id || "");
  const { data: contests = [] } = useContests({ status: "upcoming" });

  // Fetch extended profile stats
  const { data: extendedProfile } = useQuery({
    queryKey: ["user-profile-extended", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const supabase = createClient();
      const { data } = await supabase
        .from("users")
        .select("number_of_contests_entered, number_of_contests_won")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const liveEntries = contestEntries.filter((e) => e.status === "live");
  const upcomingContests = contests.slice(0, 3);

  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Please sign in to view your dashboard</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold font-display">
            Welcome back, {profile?.username || user.email?.split("@")[0] || "User"}!
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
            value={formatCurrency(wallet?.balance || 0)}
          />
          <StatCard
            icon={TrendingUp}
            label="Total Winnings"
            value={formatCurrency(0)}
          />
          <StatCard
            icon={Trophy}
            label="Contests Won"
            value={(extendedProfile?.number_of_contests_won || 0).toString()}
            subtext={`of ${extendedProfile?.number_of_contests_entered || 0} entered`}
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
                <Link key={entry.id} href={`/live/${entry.contest_id}`}>
                  <div className="p-4 rounded-xl bg-card border border-primary/30 hover:border-primary/50 transition-all card-hover">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">AFL</Badge>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <Zap className="h-3 w-3 mr-1" />
                          Live
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        #{entry.current_rank || "-"} of {entry.total_entrants || "-"}
                      </span>
                    </div>
                    <h3 className="font-semibold">Contest Entry</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold text-primary">
                        {entry.points.toFixed(1)} pts
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Win up to {formatCurrency(entry.potential_win || 0)}
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
