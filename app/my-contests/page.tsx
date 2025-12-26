"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Clock, Zap, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  mockUserEntries,
  formatCurrency,
  formatNumber,
  type UserEntry,
} from "@/data/mockData";

const statusFilters = ["All", "Live", "Upcoming", "Completed"] as const;

function EntryCard({ entry }: { entry: UserEntry }) {
  const statusColors = {
    upcoming: "bg-green-500/20 text-green-400 border-green-500/30",
    live: "bg-primary/20 text-primary border-primary/30",
    completed: "bg-muted text-muted-foreground border-border",
  };

  const linkTo = `/contest/${entry.contestId}`;

  return (
    <Link href={linkTo}>
      <div className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-200 card-hover">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {entry.sport}
              </Badge>
              <Badge className={`text-xs ${statusColors[entry.status]}`}>
                {entry.status === "live" && <Zap className="h-3 w-3 mr-1" />}
                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
              </Badge>
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {entry.contestName}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Points</p>
            <p className="text-lg font-bold text-primary">
              {entry.points.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Entry Fee</p>
            <p className="text-lg font-bold">
              {formatCurrency(entry.entryFee)}
            </p>
          </div>
        </div>

        {entry.status === "live" && entry.currentRank && entry.totalEntrants && (
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>
                Rank #{formatNumber(entry.currentRank)} /{" "}
                {formatNumber(entry.totalEntrants)}
              </span>
            </div>
            <div className="text-primary font-semibold">
              Win up to {formatCurrency(entry.potentialWin)}
            </div>
          </div>
        )}

        {entry.status === "upcoming" && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Starting soon</span>
            </div>
            <div className="text-primary font-semibold">
              Win up to {formatCurrency(entry.potentialWin)}
            </div>
          </div>
        )}

        {entry.status === "completed" && entry.currentRank && entry.totalEntrants && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span>
                Finished #{formatNumber(entry.currentRank)} /{" "}
                {formatNumber(entry.totalEntrants)}
              </span>
            </div>
            <div className="text-lg font-bold">
              {entry.points.toFixed(1)} pts
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function MyContestsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredEntries =
    activeFilter === "All"
      ? mockUserEntries
      : mockUserEntries.filter(
          (e) => e.status.toLowerCase() === activeFilter.toLowerCase()
        );

  const liveCount = mockUserEntries.filter((e) => e.status === "live").length;
  const upcomingCount = mockUserEntries.filter(
    (e) => e.status === "upcoming"
  ).length;
  const completedCount = mockUserEntries.filter(
    (e) => e.status === "completed"
  ).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display">My Contests</h1>
            <p className="text-muted-foreground">
              Track your entries and see how you're performing
            </p>
          </div>
          <Link href="/lobby">
            <Button variant="outline" className="gap-2">
              <Trophy className="h-4 w-4" />
              Browse Contests
            </Button>
          </Link>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => {
            let count = 0;
            if (filter === "All") count = mockUserEntries.length;
            else if (filter === "Live") count = liveCount;
            else if (filter === "Upcoming") count = upcomingCount;
            else if (filter === "Completed") count = completedCount;

            return (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
                {count > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 text-xs"
                  >
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Entries Grid */}
        {filteredEntries.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No {activeFilter.toLowerCase()} contests</h2>
            <p className="text-muted-foreground mb-4">
              {activeFilter === "All"
                ? "You haven't entered any contests yet."
                : `You don't have any ${activeFilter.toLowerCase()} contests.`}
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

