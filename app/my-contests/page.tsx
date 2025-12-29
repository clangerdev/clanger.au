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
import {
  mockUserEntries,
  mockMatchups,
  mockLeagueStandings,
  formatCurrency,
  type UserEntry,
  type Matchup,
} from "@/data/mockData";

function EntryCard({ entry }: { entry: UserEntry }) {
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
      ? `/live/${entry.contestId}`
      : `/contest/${entry.contestId}`;

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
              {entry.contestName}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Entry Fee</p>
            <p className="font-semibold">{formatCurrency(entry.entryFee)}</p>
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

        {entry.currentRank && entry.totalEntrants && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span>
              Rank{" "}
              <span className="font-medium text-foreground">
                #{entry.currentRank}
              </span>{" "}
              of {entry.totalEntrants}
            </span>
          </div>
        )}

        {entry.picks.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Your Picks</p>
            <div className="flex flex-wrap gap-1">
              {entry.picks.slice(0, 3).map((player) => (
                <Badge key={player.id} variant="secondary" className="text-xs">
                  {player.name.split(" ").pop()}
                </Badge>
              ))}
              {entry.picks.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{entry.picks.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

function MatchupCard({ matchup }: { matchup: Matchup }) {
  const isUserHome = matchup.homeTeam.userId === "user-1";
  const userTeam = isUserHome ? matchup.homeTeam : matchup.awayTeam;
  const opponentTeam = isUserHome ? matchup.awayTeam : matchup.homeTeam;
  const scoreDiff = userTeam.totalPoints - opponentTeam.totalPoints;
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
            {matchup.leagueName}
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
              {userTeam.totalPoints.toFixed(1)}
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
              {opponentTeam.totalPoints.toFixed(1)}
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
  const liveEntries = mockUserEntries.filter((e) => e.status === "live");
  const upcomingEntries = mockUserEntries.filter(
    (e) => e.status === "upcoming"
  );
  const completedEntries = mockUserEntries.filter(
    (e) => e.status === "completed"
  );

  const liveMatchups = mockMatchups.filter((m) => m.status === "live");
  const upcomingMatchups = mockMatchups.filter((m) => m.status === "upcoming");

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
        {mockLeagueStandings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Swords className="h-5 w-5 text-primary" />
                Season-Long Leagues
              </h2>
              <Link href={`/standings/${mockLeagueStandings[0].leagueId}`}>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  View Standings
                </Button>
              </Link>
            </div>

            {/* Matchups */}
            {(liveMatchups.length > 0 || upcomingMatchups.length > 0) && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...liveMatchups, ...upcomingMatchups].map((matchup) => (
                  <MatchupCard key={matchup.id} matchup={matchup} />
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

        {mockUserEntries.length === 0 && (
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
