import { useState, useCallback, useEffect, useRef } from 'react';
import { useAflPlayers } from '@/hooks/useAfl';
import type { AflPlayer } from '@/types/database';

const TOTAL_DRAFT_PICKS = 28;

// Helper function to get pick info
function getPickInfo(
  pickNumber: number,
  teamCount: number
): { round: number; pickInRound: number; teamIndex: number } {
  const round = Math.floor(pickNumber / teamCount);
  const pickInRound = pickNumber % teamCount;
  const isReversed = round % 2 === 1;
  const teamIndex = isReversed ? teamCount - 1 - pickInRound : pickInRound;
  return { round: round + 1, pickInRound: pickInRound + 1, teamIndex };
}

// Mock League type for useSnakeDraft (matches mockData structure)
interface League {
  id: string;
  name: string;
  commissioner: string;
  members: LeagueMember[];
  maxMembers: number;
  entryFee: number;
  prizePool: number;
  draftStatus: 'waiting' | 'in-progress' | 'completed';
  rosterConfig: {
    onField: { DEF: number; MID: number; RUC: number; FWD: number };
    emergencies: { DEF: number; MID: number; RUC: number; FWD: number };
    bench: number;
  };
  pickTimeLimit: number;
  draftOrder?: string[];
  draftStartTime?: string;
}

interface LeagueMember {
  userId: string;
  username: string;
  isCommissioner: boolean;
  draftPosition?: number;
  roster: AflPlayer[];
}

interface DraftPick {
  pickNumber: number;
  round: number;
  userId: string;
  username: string;
  player: AflPlayer;
  timestamp: string;
}

interface UseSnakeDraftProps {
  league: League;
  currentUserId: string;
}

interface UseSnakeDraftReturn {
  // State
  draftStatus: 'waiting' | 'in-progress' | 'completed';
  currentPick: number;
  currentRound: number;
  currentTeamIndex: number;
  isMyTurn: boolean;
  timeRemaining: number;
  draftPicks: DraftPick[];
  availablePlayers: AflPlayer[];
  myRoster: AflPlayer[];

  // Actions
  startDraft: () => void;
  makePick: (player: AflPlayer) => boolean;

  // Computed
  getTeamRoster: (userId: string) => AflPlayer[];
  getPickHistory: () => DraftPick[];
  getTotalPicks: () => number;
  getCurrentDrafter: () => { userId: string; username: string } | null;
}

export function useSnakeDraft({
  league,
  currentUserId,
}: UseSnakeDraftProps): UseSnakeDraftReturn {
  const { data: allPlayers = [] } = useAflPlayers();
  const [draftStatus, setDraftStatus] = useState<'waiting' | 'in-progress' | 'completed'>(
    league.draftStatus
  );
  const [currentPick, setCurrentPick] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(league.pickTimeLimit);
  const [draftPicks, setDraftPicks] = useState<DraftPick[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<AflPlayer[]>([]);
  const [teamRosters, setTeamRosters] = useState<Record<string, AflPlayer[]>>(() => {
    const rosters: Record<string, AflPlayer[]> = {};
    league.members.forEach((m) => {
      rosters[m.userId] = [];
    });
    return rosters;
  });

  // Initialize available players when allPlayers loads
  useEffect(() => {
    if (allPlayers.length > 0 && availablePlayers.length === 0) {
      setAvailablePlayers([...allPlayers]);
    }
  }, [allPlayers, availablePlayers.length]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const teamCount = league.members.length;
  const totalPicks = teamCount * TOTAL_DRAFT_PICKS;

  // Calculate current round and team from pick number
  const { round: currentRound, teamIndex: currentTeamIndex } = getPickInfo(
    currentPick,
    teamCount
  );

  // Get current drafter
  const getCurrentDrafter = useCallback(() => {
    if (draftStatus !== 'in-progress' || currentPick >= totalPicks) return null;
    const member = league.members.find((m) => m.draftPosition === currentTeamIndex + 1);
    return member ? { userId: member.userId, username: member.username } : null;
  }, [draftStatus, currentPick, totalPicks, league.members, currentTeamIndex]);

  const currentDrafter = getCurrentDrafter();
  const isMyTurn = currentDrafter?.userId === currentUserId && draftStatus === 'in-progress';

  // Timer logic
  useEffect(() => {
    if (draftStatus !== 'in-progress') return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-pick when timer expires
          handleAutoPick();
          return league.pickTimeLimit;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [draftStatus, currentPick]);

  // Auto-pick highest projected player
  const handleAutoPick = useCallback(() => {
    if (availablePlayers.length === 0) return;

    const sortedPlayers = [...availablePlayers].sort(
      (a, b) => (b.avg_points || 0) - (a.avg_points || 0)
    );
    const autoPick = sortedPlayers[0];

    if (autoPick) {
      makePickInternal(autoPick);
    }
  }, [availablePlayers]);

  // Internal pick logic
  const makePickInternal = useCallback(
    (player: AflPlayer) => {
      const drafter = getCurrentDrafter();
      if (!drafter) return false;

      const pick: DraftPick = {
        pickNumber: currentPick + 1,
        round: currentRound,
        userId: drafter.userId,
        username: drafter.username,
        player,
        timestamp: new Date().toISOString(),
      };

      setDraftPicks((prev) => [...prev, pick]);
      setAvailablePlayers((prev) => prev.filter((p) => p.id !== player.id));
      setTeamRosters((prev) => ({
        ...prev,
        [drafter.userId]: [...prev[drafter.userId], player],
      }));

      const nextPick = currentPick + 1;
      if (nextPick >= totalPicks) {
        setDraftStatus('completed');
      } else {
        setCurrentPick(nextPick);
        setTimeRemaining(league.pickTimeLimit);
      }

      return true;
    },
    [currentPick, currentRound, totalPicks, league.pickTimeLimit, getCurrentDrafter]
  );

  // Public pick function (only works if it's user's turn)
  const makePick = useCallback(
    (player: AflPlayer): boolean => {
      if (!isMyTurn) return false;
      if (!availablePlayers.find((p) => p.id === player.id)) return false;
      return makePickInternal(player);
    },
    [isMyTurn, availablePlayers, makePickInternal]
  );

  // Start draft
  const startDraft = useCallback(() => {
    setDraftStatus('in-progress');
    setCurrentPick(0);
    setTimeRemaining(league.pickTimeLimit);
  }, [league.pickTimeLimit]);

  // Get team roster
  const getTeamRoster = useCallback(
    (userId: string): AflPlayer[] => {
      return teamRosters[userId] || [];
    },
    [teamRosters]
  );

  // Get pick history
  const getPickHistory = useCallback(() => {
    return draftPicks;
  }, [draftPicks]);

  // Get total picks needed
  const getTotalPicks = useCallback(() => {
    return totalPicks;
  }, [totalPicks]);

  // Current user's roster
  const myRoster = teamRosters[currentUserId] || [];

  return {
    draftStatus,
    currentPick,
    currentRound,
    currentTeamIndex,
    isMyTurn,
    timeRemaining,
    draftPicks,
    availablePlayers,
    myRoster,
    startDraft,
    makePick,
    getTeamRoster,
    getPickHistory,
    getTotalPicks,
    getCurrentDrafter,
  };
}
