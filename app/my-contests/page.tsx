"use client";

import Link from "next/link";
import {
  Trophy,
  Clock,
  Zap,
  TrendingUp,
  Swords,
  BarChart3,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useUserTeams } from "@/hooks/useUserTeams";
import { useContestEntriesByUser, useContestsByIds } from "@/hooks/useContests";
import { useLeagues } from "@/hooks/useLeagues";
import { useAuth } from "@/components/auth/AuthProvider";
import type { ContestEntry, MatchupWithDetails } from "@/types/database";

function EntryCard({ entry }: { entry: EntryCardData }) {
  const statusConfig = {
    upcoming: {
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      icon: Clock,
      label: "Upcoming",
    },
    live: {
      color: "bg-primary/20 text-primary border-primary/30",
      icon: Zap,
      label: "Live",
    },
    completed: {
      color: "bg-muted text-muted-foreground border-border",
      icon: Trophy,
      label: "Completed",
    },
  };

  const config = statusConfig[entry.status];
  const StatusIcon = config.icon;

  const linkTo =
    entry.status === "live"
      ? `/live/${entry.contest_id}`
      : `/contests/${entry.contest_id}`;

  return (
    <Link href={linkTo}>
      <div className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all card-hover">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {entry.sport}
              </Badge>
              <Badge className={`text-xs ${config.color}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {entry.contest_name}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Entry Fee</p>
            <p className="font-semibold">{formatCurrency(entry.entry_fee)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {entry.status === "completed" ? "Final Points" : "Current Points"}
            </p>
            <p className="font-semibold text-primary">
              {entry.points.toFixed(1)}
            </p>
          </div>
        </div>

        {entry.current_rank && entry.total_entrants && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span>
              Rank{" "}
              <span className="font-medium text-foreground">
                #{entry.current_rank}
              </span>{" "}
              of {entry.total_entrants}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

function MatchupCard({ matchup, currentUserId }: { matchup: MatchupWithDetails; currentUserId?: string }) {
  const isUserHome = matchup.homeTeam.user_id === currentUserId;
  const userTeam = isUserHome ? matchup.homeTeam : matchup.awayTeam;
  const opponentTeam = isUserHome ? matchup.awayTeam : matchup.homeTeam;
  const scoreDiff = userTeam.total_points - opponentTeam.total_points;
  const isWinning = scoreDiff > 0;

  const statusConfig = {
    upcoming: {
      color: "bg-muted text-muted-foreground",
      label: "Upcoming",
    },
    live: {
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      label: "Live",
    },
    completed: {
      color: "bg-muted text-muted-foreground",
      label: "Final",
    },
  };
  const config = statusConfig[matchup.status];

  return (
    <Link href={`/matchup/${matchup.id}`}>
      <div className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all card-hover">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-xs">
            {matchup.leagueName || "League"}
          </Badge>
          <Badge className={`text-xs ${config.color}`}>
            {matchup.status === "live" && <Zap className="h-3 w-3 mr-1" />}
            {config.label}
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="text-center flex-1">
            <p className="text-sm font-medium">{userTeam.username}</p>
            <p
              className={`text-2xl font-bold ${
                matchup.status !== "upcoming" && isWinning
                  ? "text-green-400"
                  : ""
              }`}
            >
              {userTeam.total_points.toFixed(1)}
            </p>
          </div>
          <div className="px-3">
            <span className="text-sm text-muted-foreground">vs</span>
          </div>
          <div className="text-center flex-1">
            <p className="text-sm font-medium">{opponentTeam.username}</p>
            <p
              className={`text-2xl font-bold ${
                matchup.status !== "upcoming" && !isWinning && scoreDiff !== 0
                  ? "text-green-400"
                  : ""
              }`}
            >
              {opponentTeam.total_points.toFixed(1)}
            </p>
          </div>
        </div>

        {matchup.status !== "upcoming" && (
          <div className="text-center">
            <span
              className={`text-sm font-medium ${
                isWinning
                  ? "text-green-400"
                  : scoreDiff < 0
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {isWinning ? "+" : ""}
              {scoreDiff.toFixed(1)} pts
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function MyContestsPage() {
  const { user } = useAuth();
  const { data: contestEntries = [], isLoading: entriesLoading } = useContestEntriesByUser(user?.id || "");
  const { data: allLeagues = [] } = useLeagues();

  // Get unique contest IDs from entries
  const contestIds = [...new Set(contestEntries.map(e => e.contest_id))];

  // Fetch contest details in batch
  const { data: contests = [] } = useContestsByIds(contestIds);

  // Transform contest entries to entry cards with contest data
  const entries: EntryCardData[] = contestEntries.map(entry => {
    const contest = contests.find(c => c.id === entry.contest_id);
    return {
      id: entry.id,
      contest_id: entry.contest_id,
      contest_name: contest?.name || "Contest",
      status: entry.status,
      sport: contest?.sport || "AFL",
      entry_fee: entry.entry_fee,
      points: entry.points,
      current_rank: entry.current_rank || undefined,
      total_entrants: entry.total_entrants || undefined,
      potential_win: entry.potential_win || undefined,
    };
  });

  // Get user's leagues (from teams that have league_id)
  const { data: userTeams = [] } = useUserTeams(user?.id || "");
  const userLeagues = allLeagues.filter(l =>
    userTeams.some(ut => ut.league_id === l.id)
  );

  const liveEntries = entries.filter((e) => e.status === "live");
  const upcomingEntries = entries.filter((e) => e.status === "upcoming");
  const completedEntries = entries.filter((e) => e.status === "completed");

  // For matchups, we'll need to fetch them differently
  // For now, show empty state if no leagues
  const liveMatchups: MatchupWithDetails[] = [];
  const upcomingMatchups: MatchupWithDetails[] = [];

  if (entriesLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading your contests...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display">My Contests</h1>
            <p className="text-muted-foreground">
              Track your entries and view results
            </p>
          </div>
          <Link href="/lobby">
            <Button>Enter New Contest</Button>
          </Link>
        </div>

        {/* Season-Long Section */}
        {userLeagues.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Swords className="h-5 w-5 text-primary" />
                Season-Long Leagues
              </h2>
              {userLeagues[0] && (
                <Link href={`/standings/${userLeagues[0].id}`}>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    View Standings
                  </Button>
                </Link>
              )}
            </div>

            {/* Matchups */}
            {(liveMatchups.length > 0 || upcomingMatchups.length > 0) && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...liveMatchups, ...upcomingMatchups].map((matchup) => (
                  <MatchupCard key={matchup.id} matchup={matchup} currentUserId={user?.id} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Live Entries */}
        {liveEntries.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Live ({liveEntries.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {liveEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Entries */}
        {upcomingEntries.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400" />
              Upcoming ({upcomingEntries.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Entries */}
        {completedEntries.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              Completed ({completedEntries.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {entries.length === 0 && userLeagues.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Entries Yet</h2>
            <p className="text-muted-foreground mb-4">
              Join your first contest to get started!
            </p>
            <Link href="/lobby">
              <Button>Browse Contests</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
