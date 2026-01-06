"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, Clock, Trophy, Circle, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchupRoster } from "@/components/matchup/MatchupRoster";
import { useMatchup } from "@/hooks/useMatchups";
import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/layout/AppLayout";

export default function MatchupPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: matchup, isLoading, error } = useMatchup(id || "");

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading matchup...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !matchup) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
          <div className="text-center p-6">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Matchup Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This matchup doesn't exist or has been removed.
            </p>
            <Link href="/my-contests">
              <Button>Back to My Contests</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const scoreDiff = matchup.homeTeam.total_points - matchup.awayTeam.total_points;
  const isHomeWinning = scoreDiff > 0;
  const isTied = scoreDiff === 0;

  const statusConfig = {
    upcoming: {
      icon: Clock,
      label: "Upcoming",
      color: "bg-muted text-muted-foreground",
    },
    live: {
      icon: Zap,
      label: "Live",
      color: "bg-green-500/20 text-green-400 border-green-500/30",
    },
    completed: {
      icon: Trophy,
      label: "Final",
      color: "bg-muted text-muted-foreground",
    },
  };

  const config = statusConfig[matchup.status];
  const StatusIcon = config.icon;

  return (
    <AppLayout>
      <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-background overflow-hidden -m-4 lg:-m-6">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-border bg-card">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <Link
                href="/my-contests"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <p className="text-[10px] text-muted-foreground">
                  {matchup.leagueName || "League"}
                </p>
                <p className="text-xs font-medium">Round {matchup.round}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/standings/${matchup.league_id}`}>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <BarChart3 className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Standings</span>
                </Button>
              </Link>
              <Badge className={cn("text-xs", config.color)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>
          </div>

          {/* Score Header */}
          <div className="px-4 py-4 flex items-center justify-between">
            {/* Home Team */}
            <div className="flex-1 text-center">
              <p className="text-sm font-semibold mb-1">
                {matchup.homeTeam.username}
              </p>
              <p
                className={cn(
                  "text-4xl font-bold font-display",
                  matchup.status !== "upcoming" &&
                    (isHomeWinning
                      ? "text-green-400"
                      : isTied
                      ? "text-foreground"
                      : "text-muted-foreground")
                )}
              >
                {matchup.homeTeam.total_points.toFixed(1)}
              </p>
              {matchup.status === "live" && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Circle className="h-1.5 w-1.5 fill-green-400 text-green-400 animate-pulse" />
                  <span className="text-[10px] text-green-400">
                    {matchup.homeTeam.players.filter((p) => p.is_playing).length}{" "}
                    playing
                  </span>
                </div>
              )}
            </div>

            {/* VS / Diff */}
            <div className="px-4 text-center">
              {matchup.status === "upcoming" ? (
                <span className="text-lg font-bold text-muted-foreground">
                  VS
                </span>
              ) : (
                <div>
                  <span
                    className={cn(
                      "text-lg font-bold",
                      isHomeWinning
                        ? "text-green-400"
                        : isTied
                        ? "text-muted-foreground"
                        : "text-destructive"
                    )}
                  >
                    {scoreDiff > 0 ? "+" : ""}
                    {scoreDiff.toFixed(1)}
                  </span>
                  <p className="text-[10px] text-muted-foreground">diff</p>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 text-center">
              <p className="text-sm font-semibold mb-1">
                {matchup.awayTeam.username}
              </p>
              <p
                className={cn(
                  "text-4xl font-bold font-display",
                  matchup.status !== "upcoming" &&
                    (!isHomeWinning && !isTied
                      ? "text-green-400"
                      : isTied
                      ? "text-foreground"
                      : "text-muted-foreground")
                )}
              >
                {matchup.awayTeam.total_points.toFixed(1)}
              </p>
              {matchup.status === "live" && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Circle className="h-1.5 w-1.5 fill-green-400 text-green-400 animate-pulse" />
                  <span className="text-[10px] text-green-400">
                    {matchup.awayTeam.players.filter((p) => p.is_playing).length}{" "}
                    playing
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Rosters Side by Side */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 border-r border-border overflow-hidden">
            <MatchupRoster team={matchup.homeTeam} isHome={true} />
          </div>
          <div className="flex-1 overflow-hidden">
            <MatchupRoster team={matchup.awayTeam} isHome={false} />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex-shrink-0 border-t border-border bg-card px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-muted-foreground">Projected: </span>
              <span className="font-medium">
                {matchup.homeTeam.projected_total.toFixed(1)}
              </span>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground">
                Games remaining this round
              </span>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground">Projected: </span>
              <span className="font-medium">
                {matchup.awayTeam.projected_total.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
