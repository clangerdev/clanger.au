"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Clock, Trophy, Zap } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RosterBuilder } from "@/components/roster/RosterBuilder";
import {
  getContestById,
  formatCurrency,
  formatNumber,
} from "@/data/mockData";

export default function ContestPage() {
  const params = useParams();
  const id = params?.id as string;
  const contest = getContestById(id || "");

  if (!contest) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Contest Not Found</h2>
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

  const isDailyContest = contest.type === "daily";

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/lobby"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lobby
        </Link>

        {/* Contest Header */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">AFL</Badge>
                <Badge variant="outline">
                  {contest.type === "daily" ? "Daily" : "Season-Long"}
                </Badge>
                <Badge
                  className={
                    contest.status === "live"
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "bg-green-500/20 text-green-400 border-green-500/30"
                  }
                >
                  {contest.status === "live" && <Zap className="h-3 w-3 mr-1" />}
                  {contest.status.charAt(0).toUpperCase() +
                    contest.status.slice(1)}
                </Badge>
                {contest.guaranteed && (
                  <Badge variant="secondary">Guaranteed</Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold font-display">
                {contest.name}
              </h1>
              {contest.round && (
                <p className="text-sm text-muted-foreground mt-1">
                  Round {contest.round}
                </p>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Prize Pool</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(contest.prizePool)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Entry Fee</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(contest.entryFee)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {formatNumber(contest.entries)} /{" "}
                {formatNumber(contest.maxEntries)} entries
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Round 1</span>
            </div>
          </div>
        </div>

        {/* Roster Builder for Daily Contests */}
        {isDailyContest ? (
          <RosterBuilder contest={contest} />
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Season-Long League</h2>
            <p className="text-muted-foreground mb-4">
              Snake draft coming soon!
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

