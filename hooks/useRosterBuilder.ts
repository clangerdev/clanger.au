import { useState, useCallback, useMemo } from 'react';
import type { AflPlayer, AflPosition } from '@/types/database';

const DAILY_SALARY_CAP = 100000;

export interface RosterConfig {
  DEF: number;
  MID: number;
  RUC: number;
  FWD: number;
}

interface RosterSlot {
  position: AflPosition;
  player: AflPlayer | null;
}

interface UseRosterBuilderProps {
  rosterConfig: RosterConfig;
  salaryCap?: number;
}

interface UseRosterBuilderReturn {
  roster: RosterSlot[];
  selectedPlayerIds: Set<string>;
  salaryUsed: number;
  remainingBudget: number;
  projectedTotal: number;
  addPlayer: (player: AflPlayer) => boolean;
  removePlayer: (playerId: string) => void;
  clearRoster: () => void;
  isRosterValid: boolean;
  isRosterFull: boolean;
  canAddPlayer: (player: AflPlayer) => { canAdd: boolean; reason?: string };
  getOpenSlots: () => { position: AflPosition; count: number }[];
  getRosterByPosition: () => Record<AflPosition, AflPlayer[]>;
}

export function useRosterBuilder({
  rosterConfig,
  salaryCap = DAILY_SALARY_CAP,
}: UseRosterBuilderProps): UseRosterBuilderReturn {
  // Initialize roster slots based on config
  const initialRoster = useMemo(() => {
    const slots: RosterSlot[] = [];
    (Object.keys(rosterConfig) as AflPosition[]).forEach((pos) => {
      for (let i = 0; i < rosterConfig[pos]; i++) {
        slots.push({ position: pos, player: null });
      }
    });
    return slots;
  }, [rosterConfig]);

  const [roster, setRoster] = useState<RosterSlot[]>(initialRoster);

  // Derived state
  const selectedPlayerIds = useMemo(() => {
    return new Set(roster.filter((s) => s.player).map((s) => s.player!.id));
  }, [roster]);

  const salaryUsed = useMemo(() => {
    return roster.reduce((total, slot) => total + (slot.player?.salary || 0), 0);
  }, [roster]);

  const remainingBudget = salaryCap - salaryUsed;

  const projectedTotal = useMemo(() => {
    return roster.reduce(
      (total, slot) => total + (slot.player?.avg_points || 0),
      0
    );
  }, [roster]);

  const isRosterFull = useMemo(() => {
    return roster.every((slot) => slot.player !== null);
  }, [roster]);

  const isRosterValid = useMemo(() => {
    return isRosterFull && salaryUsed <= salaryCap;
  }, [isRosterFull, salaryUsed, salaryCap]);

  // Check if player can be added
  const canAddPlayer = useCallback(
    (player: AflPlayer): { canAdd: boolean; reason?: string } => {
      // Already selected
      if (selectedPlayerIds.has(player.id)) {
        return { canAdd: false, reason: 'Already selected' };
      }

      // Check if there's an open slot for this position
      const openSlot = roster.find(
        (slot) => slot.position === player.position && slot.player === null
      );
      if (!openSlot) {
        return { canAdd: false, reason: `No ${player.position} slot available` };
      }

      // Check salary cap
      if (salaryUsed + player.salary > salaryCap) {
        return { canAdd: false, reason: 'Over salary cap' };
      }

      // Player is injured
      if (player.status === 'out') {
        return { canAdd: false, reason: 'Player is OUT' };
      }

      return { canAdd: true };
    },
    [roster, salaryUsed, salaryCap, selectedPlayerIds]
  );

  // Add player to roster
  const addPlayer = useCallback(
    (player: AflPlayer): boolean => {
      const { canAdd } = canAddPlayer(player);
      if (!canAdd) return false;

      setRoster((prev) => {
        const newRoster = [...prev];
        const slotIndex = newRoster.findIndex(
          (slot) => slot.position === player.position && slot.player === null
        );
        if (slotIndex !== -1) {
          newRoster[slotIndex] = { ...newRoster[slotIndex], player };
        }
        return newRoster;
      });

      return true;
    },
    [canAddPlayer]
  );

  // Remove player from roster
  const removePlayer = useCallback((playerId: string) => {
    setRoster((prev) =>
      prev.map((slot) =>
        slot.player?.id === playerId ? { ...slot, player: null } : slot
      )
    );
  }, []);

  // Clear entire roster
  const clearRoster = useCallback(() => {
    setRoster(initialRoster);
  }, [initialRoster]);

  // Get open slots by position
  const getOpenSlots = useCallback(() => {
    const openByPosition: Record<AflPosition, number> = {
      DEF: 0,
      MID: 0,
      RUC: 0,
      FWD: 0,
    };

    roster.forEach((slot) => {
      if (!slot.player) {
        openByPosition[slot.position]++;
      }
    });

    return (Object.keys(openByPosition) as AflPosition[])
      .filter((pos) => openByPosition[pos] > 0)
      .map((pos) => ({ position: pos, count: openByPosition[pos] }));
  }, [roster]);

  // Get roster organized by position
  const getRosterByPosition = useCallback(() => {
    const byPosition: Record<AflPosition, AflPlayer[]> = {
      DEF: [],
      MID: [],
      RUC: [],
      FWD: [],
    };

    roster.forEach((slot) => {
      if (slot.player) {
        byPosition[slot.position].push(slot.player);
      }
    });

    return byPosition;
  }, [roster]);

  return {
    roster,
    selectedPlayerIds,
    salaryUsed,
    remainingBudget,
    projectedTotal,
    addPlayer,
    removePlayer,
    clearRoster,
    isRosterValid,
    isRosterFull,
    canAddPlayer,
    getOpenSlots,
    getRosterByPosition,
  };
}
