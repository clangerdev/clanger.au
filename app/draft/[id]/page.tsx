"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSnakeDraft } from "@/hooks/useSnakeDraft";
import { DraftTimer } from "@/components/draft/DraftTimer";
import { DraftBoard } from "@/components/draft/DraftBoard";
import { DraftBottomDrawer } from "@/components/draft/DraftBottomDrawer";
import { AppLayout } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { useLeague, useLeagueMembers } from "@/hooks/useLeagues";
import { useAuth } from "@/components/auth/AuthProvider";

// Local type matching the league shape expected by useSnakeDraft
type SnakeDraftLeague = {
  id: string;
  name: string;
  commissioner: string;
  members: {
    userId: string;
    username: string;
    isCommissioner: boolean;
    draftPosition?: number;
    roster: never[];
  }[];
  maxMembers: number;
  entryFee: number;
  prizePool: number;
  draftStatus: "waiting" | "in-progress" | "completed";
  rosterConfig: {
    onField: { DEF: number; MID: number; RUC: number; FWD: number };
    emergencies: { DEF: number; MID: number; RUC: number; FWD: number };
    bench: number;
  };
  pickTimeLimit: number;
  draftOrder?: string[];
  draftStartTime?: string;
};

export default function DraftPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: league, isLoading: leagueLoading } = useLeague(id || "");
  const { data: members = [] } = useLeagueMembers(id || "");

  // Create a minimal dummy league to satisfy React hooks rules (always call hooks)
  const dummyLeague: SnakeDraftLeague = {
    id: "",
    name: "",
    commissioner: "",
    members: [],
    maxMembers: 0,
    entryFee: 0,
    prizePool: 0,
    draftStatus: "waiting",
    rosterConfig: {
      onField: {
        DEF: 5,
        MID: 7,
        RUC: 1,
        FWD: 5,
      },
      emergencies: {
        DEF: 1,
        MID: 1,
        RUC: 1,
        FWD: 1,
      },
      bench: 6,
    },
    pickTimeLimit: 90,
    draftOrder: undefined,
    draftStartTime: undefined,
  };

  // Transform league data for useSnakeDraft hook
  const transformedLeague: SnakeDraftLeague = league
    ? {
        id: league.id,
        name: league.name,
        commissioner: league.commissioner_id,
        members: members.map((m) => ({
          userId: m.user_id,
          username: "", // TODO: Get from users table
          isCommissioner: m.is_commissioner,
          draftPosition: m.draft_position || undefined,
          roster: [],
        })),
        maxMembers: league.max_members,
        entryFee: league.entry_fee,
        prizePool: league.prize_pool,
        draftStatus: league.draft_status,
        rosterConfig: {
          onField: {
            DEF: league.roster_config_onfield_def,
            MID: league.roster_config_onfield_mid,
            RUC: league.roster_config_onfield_ruc,
            FWD: league.roster_config_onfield_fwd,
          },
          emergencies: {
            DEF: league.roster_config_emergencies_def,
            MID: league.roster_config_emergencies_mid,
            RUC: league.roster_config_emergencies_ruc,
            FWD: league.roster_config_emergencies_fwd,
          },
          bench: league.roster_config_bench,
        },
        pickTimeLimit: league.pick_time_limit,
        draftOrder: league.draft_order || undefined,
        draftStartTime: league.draft_start_time || undefined,
      }
    : dummyLeague;

  // Always call the hook unconditionally to satisfy React rules
  const draft = useSnakeDraft({
    league: transformedLeague,
    currentUserId: user?.id || "",
  });

  if (leagueLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading league...</p>
        </div>
      </AppLayout>
    );
  }

  if (!league || !draft) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center p-6">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">League Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This league doesn&apos;t exist or has been removed.
            </p>
            <Link href="/lobby">
              <Button>Back to Lobby</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleStartDraft = () => {
    draft.startDraft();
    toast({
      title: "Draft Started!",
      description: "Good luck picking your squad!",
    });
  };

  const handleSelectPlayer = (player: (typeof draft.availablePlayers)[0]) => {
    const success = draft.makePick(player);
    if (success) {
      toast({
        title: "Player Drafted!",
        description: `${player.name} has been added to your roster`,
      });
    }
  };

  const currentDrafter = draft.getCurrentDrafter();

  // Waiting state
  if (draft.draftStatus === "waiting") {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Link
            href="/lobby"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Lobby
          </Link>

          <div className="p-6 rounded-xl bg-card border border-border text-center">
            <Badge variant="outline" className="mb-4">
              Season-Long
            </Badge>
            <h1 className="text-2xl font-bold font-display mb-2">
              {league.name}
            </h1>
            <p className="text-muted-foreground mb-6">Snake Draft</p>

            <div className="flex items-center justify-center gap-8 mb-6">
              <div>
                <p className="text-xs text-muted-foreground">Prize Pool</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(league.prize_pool)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entry Fee</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(league.entry_fee)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Members</p>
                <p className="text-2xl font-bold">
                  {members.length}/{league.max_members}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 max-w-2xl mx-auto">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <p className="font-medium text-sm">
                    User {member.user_id.slice(0, 8)}
                    {member.user_id === user?.id && (
                      <span className="text-primary ml-1">(You)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pick #{member.draft_position || "TBD"}
                  </p>
                </div>
              ))}
            </div>

            <Button size="lg" onClick={handleStartDraft}>
              <Play className="h-5 w-5 mr-2" />
              Start Draft
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Draft completed
  if (draft.draftStatus === "completed") {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="p-6 rounded-xl bg-card border border-border text-center max-w-2xl">
            <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold font-display mb-2">
              Draft Complete!
            </h1>
            <p className="text-muted-foreground mb-6">
              All teams have completed their rosters. You drafted{" "}
              {draft.myRoster.length} players.
            </p>
            <Button onClick={() => router.push("/my-contests")}>
              View My Contests
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Active Draft - Draft board with bottom drawer
  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-4 lg:-m-6 overflow-hidden">
        {/* Compact Header */}
        <header className="h-9 flex-shrink-0 flex items-center justify-between px-4 border-b border-border bg-card z-30">
          <div className="flex items-center gap-2">
            <Link
              href="/lobby"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
            <span className="text-xs font-semibold">{league.name}</span>
            <span className="text-[10px] text-muted-foreground">
              R{draft.currentRound} • {draft.currentPick + 1}/
              {draft.getTotalPicks()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <DraftTimer
              timeRemaining={draft.timeRemaining}
              isMyTurn={draft.isMyTurn}
              pickTimeLimit={league.pick_time_limit}
            />
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 py-0.5 h-auto",
                draft.isMyTurn
                  ? "bg-primary/20 text-primary border-primary/30 animate-pulse"
                  : "bg-muted"
              )}
            >
              {draft.isMyTurn ? "Your Turn!" : currentDrafter?.username}
            </Badge>
          </div>
        </header>

        {/* Main Content - Draft Board */}
        <div className="flex-1 overflow-hidden">
          <DraftBoard
            members={transformedLeague.members}
            draftPicks={draft.draftPicks}
            currentPick={draft.currentPick}
            currentUserId={user?.id || ""}
          />
        </div>

        {/* Bottom Drawer - My Roster / Available Players */}
        <DraftBottomDrawer
          roster={draft.myRoster}
          rosterConfig={transformedLeague.rosterConfig}
          availablePlayers={draft.availablePlayers}
          isMyTurn={draft.isMyTurn}
          onSelectPlayer={handleSelectPlayer}
        />
      </div>
    </AppLayout>
  );
}
