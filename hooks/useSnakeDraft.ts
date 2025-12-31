import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Player,
  League,
  DraftPick,
  mockPlayers,
  TOTAL_DRAFT_PICKS,
  getPickInfo,
} from '@/data/mockData';

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
  availablePlayers: Player[];
  myRoster: Player[];
  
  // Actions
  startDraft: () => void;
  makePick: (player: Player) => boolean;
  
  // Computed
  getTeamRoster: (userId: string) => Player[];
  getPickHistory: () => DraftPick[];
  getTotalPicks: () => number;
  getCurrentDrafter: () => { userId: string; username: string } | null;
}

export function useSnakeDraft({
  league,
  currentUserId,
}: UseSnakeDraftProps): UseSnakeDraftReturn {
  const [draftStatus, setDraftStatus] = useState<'waiting' | 'in-progress' | 'completed'>(
    league.draftStatus
  );
  const [currentPick, setCurrentPick] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(league.pickTimeLimit);
  const [draftPicks, setDraftPicks] = useState<DraftPick[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([...mockPlayers]);
  const [teamRosters, setTeamRosters] = useState<Record<string, Player[]>>(() => {
    const rosters: Record<string, Player[]> = {};
    league.members.forEach((m) => {
      rosters[m.userId] = [];
    });
    return rosters;
  });

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
      (a, b) => b.projectedPoints - a.projectedPoints
    );
    const autoPick = sortedPlayers[0];
    
    if (autoPick) {
      makePickInternal(autoPick);
    }
  }, [availablePlayers]);

  // Internal pick logic
  const makePickInternal = useCallback(
    (player: Player) => {
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
    (player: Player): boolean => {
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
    (userId: string): Player[] => {
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
