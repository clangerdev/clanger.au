"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, TrendingUp, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useContest } from "@/hooks/useContests";
import { useContestEntriesByUser } from "@/hooks/useContests";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LivePage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();
  const { data: contest, isLoading: contestLoading } = useContest(id || "");
  const { data: userEntries = [] } = useContestEntriesByUser(user?.id || "");
  const entry = userEntries.find((e) => e.contest_id === id);

  if (contestLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (!entry || !contest || entry.status !== "live") {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Live Contest Found</h2>
          <p className="text-muted-foreground mb-4">
            This contest isn&apos;t currently live.
          </p>
          <Link href="/my-contests">
            <Button>View My Contests</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/my-contests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Contests
        </Link>

        {/* Live Header */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary/30 text-primary border-primary/50 animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
            <Badge variant="outline">{contest.sport}</Badge>
          </div>
          <h1 className="text-2xl font-bold font-display mb-4">
            {contest.name}
          </h1>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-background/50">
              <p className="text-xs text-muted-foreground mb-1">Your Points</p>
              <p className="text-3xl font-bold text-primary">
                {entry.points.toFixed(1)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Rank</p>
              </div>
              <p className="text-3xl font-bold">#{entry.current_rank || "-"}</p>
              <p className="text-xs text-muted-foreground">
                of {entry.total_entrants || "-"}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <p className="text-xs text-muted-foreground mb-1">
                Potential Win
              </p>
              <p className="text-3xl font-bold text-accent">
                {formatCurrency(entry.potential_win || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Live Players - TODO: Fetch actual roster */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Lineup</h2>
          <div className="text-center py-8 text-muted-foreground">
            <p>Roster data coming soon</p>
          </div>
        </div>

        {/* View Leaderboard */}
        <div>
          <Link href={`/leaderboard/${entry.contest_id}`}>
            <Button variant="outline" className="w-full gap-2">
              <Users className="h-4 w-4" />
              View Full Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
