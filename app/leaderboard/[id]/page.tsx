"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Medal, Crown } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getContestById, formatCurrency } from "@/data/mockData";

// Mock leaderboard data
const mockLeaderboard = [
  { rank: 1, username: "BirdKing23", points: 187.4, prize: 2500 },
  { rank: 2, username: "FantasyPro99", points: 182.1, prize: 1500 },
  { rank: 3, username: "LuckyDuck", points: 176.8, prize: 1000 },
  { rank: 4, username: "PickMaster", points: 171.2, prize: 500 },
  { rank: 5, username: "SportsGuru", points: 168.9, prize: 250 },
  { rank: 6, username: "WinnerCircle", points: 165.3, prize: 150 },
  { rank: 7, username: "TopTierPicks", points: 162.7, prize: 100 },
  { rank: 8, username: "ChampMode", points: 159.4, prize: 75 },
  { rank: 9, username: "ElitePlayer", points: 156.1, prize: 50 },
  { rank: 10, username: "RisingStar", points: 153.8, prize: 25 },
  // Current user
  {
    rank: 127,
    username: "DuckMaster99",
    points: 142.5,
    prize: 0,
    isCurrentUser: true,
  },
];

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return null;
}

export default function LeaderboardPage() {
  const params = useParams();
  const id = params?.id as string;
  const contest = getContestById(id || "");

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
            Prize Pool: {formatCurrency(contest.prizePool)}
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
            {mockLeaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`grid grid-cols-4 gap-4 p-4 items-center ${
                  entry.isCurrentUser
                    ? "bg-primary/10 border-l-2 border-l-primary"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {getRankIcon(entry.rank)}
                  <span
                    className={`font-medium ${
                      entry.rank <= 3 ? "text-primary" : ""
                    }`}
                  >
                    #{entry.rank}
                  </span>
                </div>
                <div className="col-span-2">
                  <span
                    className={
                      entry.isCurrentUser ? "font-semibold text-primary" : ""
                    }
                  >
                    {entry.username}
                    {entry.isCurrentUser && " (You)"}
                  </span>
                  {entry.prize > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {formatCurrency(entry.prize)}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-semibold">
                    {entry.points.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
