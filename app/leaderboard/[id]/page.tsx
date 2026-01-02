"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Medal, Crown } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useContest, useContestEntries } from "@/hooks/useContests";
import { useAuth } from "@/components/auth/AuthProvider";

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return null;
}

export default function LeaderboardPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();
  const { data: contest, isLoading: contestLoading } = useContest(id || "");
  const { data: entries = [], isLoading: entriesLoading } = useContestEntries(id || "");

  if (contestLoading || entriesLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </AppLayout>
    );
  }

  if (!contest) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Leaderboard Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This contest doesn&apos;t exist or has been removed.
          </p>
          <Link href="/lobby">
            <Button>Back to Lobby</Button>
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

        {/* Header */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{contest.sport}</Badge>
            <Badge
              className={
                contest.status === "live"
                  ? "bg-primary/20 text-primary border-primary/30"
                  : contest.status === "completed"
                  ? "bg-muted text-muted-foreground border-border"
                  : "bg-green-500/20 text-green-400 border-green-500/30"
              }
            >
              {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold font-display">{contest.name}</h1>
          <p className="text-muted-foreground mt-1">
            Prize Pool: {formatCurrency(contest.prize_pool)}
          </p>
        </div>

        {/* Leaderboard Table */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border">
            <span>Rank</span>
            <span className="col-span-2">Player</span>
            <span className="text-right">Points</span>
          </div>

          <div className="divide-y divide-border">
            {entries.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No entries yet</p>
              </div>
            ) : (
              entries.map((entry, index) => {
                const rank = entry.current_rank || index + 1;
                const isCurrentUser = entry.user_id === user?.id;
                return (
                  <div
                    key={entry.id}
                    className={`grid grid-cols-4 gap-4 p-4 items-center ${
                      isCurrentUser
                        ? "bg-primary/10 border-l-2 border-l-primary"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getRankIcon(rank)}
                      <span
                        className={`font-medium ${
                          rank <= 3 ? "text-primary" : ""
                        }`}
                      >
                        #{rank}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span
                        className={
                          isCurrentUser ? "font-semibold text-primary" : ""
                        }
                      >
                        User {entry.user_id.slice(0, 8)}
                        {isCurrentUser && " (You)"}
                      </span>
                      {entry.potential_win && entry.potential_win > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {formatCurrency(entry.potential_win)}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {entry.points.toFixed(1)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
