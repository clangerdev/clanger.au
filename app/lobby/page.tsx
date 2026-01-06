"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Users, Clock, Zap } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useContests } from "@/hooks/useContests";
import type { Contest } from "@/types/database";

const sportFilters = ["All", "NFL", "NBA", "MLB", "NHL"] as const;

function ContestCard({ contest }: { contest: Contest }) {
  const statusColors = {
    upcoming: "bg-green-500/20 text-green-400 border-green-500/30",
    live: "bg-primary/20 text-primary border-primary/30",
    completed: "bg-muted text-muted-foreground border-border",
  };

  const linkTo =
    contest.type === "season-long"
      ? `/draft/league-1`
      : `/contests/${contest.id}`;

  return (
    <Link href={linkTo}>
      <div className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-200 card-hover">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {contest.sport}
              </Badge>
              <Badge className={`text-xs ${statusColors[contest.status]}`}>
                {contest.status === "live" && <Zap className="h-3 w-3 mr-1" />}
                {contest.status.charAt(0).toUpperCase() +
                  contest.status.slice(1)}
              </Badge>
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {contest.name}
            </h3>
          </div>
          {contest.guaranteed && (
            <Badge variant="secondary" className="text-xs bg-secondary/50">
              Guaranteed
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Prize Pool</p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(contest.prize_pool)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Entry</p>
            <p className="text-lg font-bold">
              {formatCurrency(contest.entry_fee)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              {formatNumber(contest.max_entries)} max
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Today</span>
          </div>
        </div>

        {/* Entry progress bar */}
        <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
            style={{
              width: `50%`, // TODO: Calculate from actual entries count
            }}
          />
        </div>
      </div>
    </Link>
  );
}

export default function LobbyPage() {
  const [activeSport, setActiveSport] = useState<string>("All");
  const { data: contests = [], isLoading, error } = useContests({ sport: "AFL" });

  const filteredContests =
    activeSport === "All"
      ? contests
      : contests.filter((c) => c.sport === activeSport);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading contests...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Contests</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Failed to load contests"}
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display">Contest Lobby</h1>
            <p className="text-muted-foreground">
              Find and enter contests across all sports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              {contests.length} Active Contests
            </span>
          </div>
        </div>

        {/* Sport Filters */}
        <div className="flex flex-wrap gap-2">
          {sportFilters.map((sport) => (
            <Button
              key={sport}
              variant={activeSport === sport ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSport(sport)}
            >
              {sport}
            </Button>
          ))}
        </div>

        {/* Contest Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>

        {filteredContests.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No contests available for {activeSport}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
