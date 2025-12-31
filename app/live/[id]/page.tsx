"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, TrendingUp, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockUserEntries, mockPlayers, formatCurrency } from "@/data/mockData";

export default function LivePage() {
  const params = useParams();
  const id = params?.id as string;
  const entry = mockUserEntries.find((e) => e.contestId === id);

  if (!entry || entry.status !== "live") {
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

  // Mock live player data with scores
  const livePlayers = mockPlayers
    .filter((p) => p.sport === entry.sport)
    .slice(0, 5)
    .map((p, i) => ({
      ...p,
      actualPoints: Math.random() * 30 + 5,
      isPlaying: i < 2,
    }));

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
            <Badge variant="outline">{entry.sport}</Badge>
          </div>
          <h1 className="text-2xl font-bold font-display mb-4">
            {entry.contestName}
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
              <p className="text-3xl font-bold">#{entry.currentRank}</p>
              <p className="text-xs text-muted-foreground">
                of {entry.totalEntrants}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <p className="text-xs text-muted-foreground mb-1">
                Potential Win
              </p>
              <p className="text-3xl font-bold text-accent">
                {formatCurrency(entry.potentialWin)}
              </p>
            </div>
          </div>
        </div>

        {/* Live Players */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Lineup</h2>
          <div className="space-y-3">
            {livePlayers.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  player.isPlaying
                    ? "bg-primary/5 border-primary/30"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      player.isPlaying
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {player.position}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{player.name}</p>
                      {player.isPlaying && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          Playing
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {player.team} • {player.opponent}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    {player.actualPoints?.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Proj: {player.projectedPoints}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Leaderboard */}
        <Link href={`/leaderboard/${entry.contestId}`}>
          <Button variant="outline" className="w-full gap-2">
            <Users className="h-4 w-4" />
            View Full Leaderboard
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}

