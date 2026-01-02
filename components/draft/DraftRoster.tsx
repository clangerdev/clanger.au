import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { AflPlayer, AflPosition } from '@/types/database';

interface SeasonLongRosterConfig {
  onField: { DEF: number; MID: number; RUC: number; FWD: number };
  emergencies: { DEF: number; MID: number; RUC: number; FWD: number };
  bench: number;
}

interface DraftRosterProps {
  roster: AflPlayer[];
  rosterConfig: SeasonLongRosterConfig;
  username: string;
  isCurrentUser?: boolean;
}

export function DraftRoster({
  roster,
  rosterConfig,
  isCurrentUser = false,
}: DraftRosterProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const positions: AflPosition[] = ['DEF', 'MID', 'RUC', 'FWD'];

  // Count players by position
  const countByPosition: Record<AflPosition, number> = {
    DEF: roster.filter((p) => p.position === 'DEF').length,
    MID: roster.filter((p) => p.position === 'MID').length,
    RUC: roster.filter((p) => p.position === 'RUC').length,
    FWD: roster.filter((p) => p.position === 'FWD').length,
  };

  const totalPlayers = roster.length;
  const maxPlayers =
    Object.values(rosterConfig.onField).reduce((a, b) => a + b, 0) +
    Object.values(rosterConfig.emergencies).reduce((a, b) => a + b, 0) +
    rosterConfig.bench;

  const positionColors: Record<AFLPosition, string> = {
    DEF: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    MID: 'bg-green-500/20 text-green-400 border-green-500/30',
    RUC: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    FWD: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  return (
    <div
      className={cn(
        'bg-card border-t transition-all',
        isCurrentUser ? 'border-primary/50' : 'border-border'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold">My Roster</span>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {totalPlayers}/{maxPlayers}
            </span>
          </div>

          {/* Position pills */}
          <div className="flex items-center gap-1">
            {positions.map((pos) => {
              const count = countByPosition[pos];
              const target = rosterConfig.onField[pos] + rosterConfig.emergencies[pos];
              const isFull = count >= target;

              return (
                <div
                  key={pos}
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[9px] font-bold border',
                    isFull ? positionColors[pos] : 'bg-muted/50 text-muted-foreground border-transparent'
                  )}
                >
                  {pos}:{count}
                </div>
              );
            })}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
        </Button>
      </div>

      {/* Expanded roster */}
      {isExpanded && roster.length > 0 && (
        <div className="px-3 pb-2">
          <div className="flex gap-1 overflow-x-auto">
            {roster.map((player) => (
              <div
                key={player.id}
                className={cn(
                  'flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] border',
                  positionColors[player.position as AFLPosition]
                )}
              >
                <span className="font-semibold">{player.name.split(' ').pop()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
