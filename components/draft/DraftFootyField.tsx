import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import type { AflPlayer, AflPosition } from '@/types/database';

interface SeasonLongRosterConfig {
  onField: { DEF: number; MID: number; RUC: number; FWD: number };
  emergencies: { DEF: number; MID: number; RUC: number; FWD: number };
  bench: number;
}

interface DraftFootyFieldProps {
  roster: AflPlayer[];
  rosterConfig: SeasonLongRosterConfig;
}

export function DraftFootyField({ roster, rosterConfig }: DraftFootyFieldProps) {
  const positions: AflPosition[] = ['DEF', 'MID', 'RUC', 'FWD'];

  const getPlayersByPosition = (pos: AflPosition) =>
    roster.filter((p) => p.position === pos);

  const getRequiredCount = (pos: AflPosition) =>
    rosterConfig.onField[pos] + rosterConfig.emergencies[pos];

  const positionConfig: Record<AflPosition, { label: string; color: string; bgColor: string }> = {
    DEF: { label: 'Defenders', color: 'text-blue-400', bgColor: 'bg-blue-500/20 border-blue-500/30' },
    MID: { label: 'Midfielders', color: 'text-green-400', bgColor: 'bg-green-500/20 border-green-500/30' },
    RUC: { label: 'Ruckmen', color: 'text-purple-400', bgColor: 'bg-purple-500/20 border-purple-500/30' },
    FWD: { label: 'Forwards', color: 'text-orange-400', bgColor: 'bg-orange-500/20 border-orange-500/30' },
  };

  return (
    <div className="h-full p-4 overflow-auto">
      {/* AFL Field Background */}
      <div className="relative w-full max-w-4xl mx-auto aspect-[3/4] max-h-full rounded-3xl bg-gradient-to-b from-emerald-900/40 via-emerald-800/30 to-emerald-900/40 border border-emerald-700/30 overflow-hidden">
        {/* Field markings */}
        <div className="absolute inset-0">
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-emerald-600/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-600/40" />

          {/* 50m arcs */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[80%] h-16 border-b-2 border-emerald-600/20 rounded-b-full" />
          <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[80%] h-16 border-t-2 border-emerald-600/20 rounded-t-full" />

          {/* Goal squares */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 border-2 border-t-0 border-emerald-600/30" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 border-2 border-b-0 border-emerald-600/30" />
        </div>

        {/* Position Rows */}
        <div className="absolute inset-0 flex flex-col py-6 px-4">
          {positions.map((pos) => {
            const players = getPlayersByPosition(pos);
            const required = getRequiredCount(pos);
            const config = positionConfig[pos];
            const emptySlots = Math.max(0, required - players.length);

            return (
              <div key={pos} className="flex-1 flex flex-col items-center justify-center">
                {/* Position Label */}
                <div className={cn('text-[10px] font-bold uppercase tracking-wider mb-2', config.color)}>
                  {config.label} ({players.length}/{required})
                </div>

                {/* Player Slots */}
                <div className="flex flex-wrap justify-center gap-2 max-w-full">
                  {/* Filled slots */}
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className={cn(
                        'flex flex-col items-center p-1.5 rounded-lg border backdrop-blur-sm transition-all hover:scale-105',
                        config.bgColor
                      )}
                    >
                      <div className="w-8 h-8 rounded-full bg-card/80 flex items-center justify-center mb-1">
                        <User className={cn('h-4 w-4', config.color)} />
                      </div>
                      <span className="text-[9px] font-medium text-foreground max-w-[60px] truncate text-center">
                        {player.name.split(' ').pop()}
                      </span>
                      <span className="text-[8px] text-muted-foreground">{player.team}</span>
                    </div>
                  ))}

                  {/* Empty slots */}
                  {Array.from({ length: emptySlots }).map((_, idx) => (
                    <div
                      key={`empty-${pos}-${idx}`}
                      className="flex flex-col items-center p-1.5 rounded-lg border border-dashed border-muted-foreground/30 opacity-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center mb-1">
                        <User className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                      <span className="text-[9px] text-muted-foreground">Empty</span>
                      <span className="text-[8px] text-muted-foreground/50">{pos}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bench Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border/50 px-4 py-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Bench ({rosterConfig.bench} slots)
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {/* Show bench players or empty slots */}
            {roster.length <= getRequiredCount('DEF') + getRequiredCount('MID') + getRequiredCount('RUC') + getRequiredCount('FWD') ? (
              Array.from({ length: rosterConfig.bench }).map((_, idx) => (
                <div
                  key={`bench-${idx}`}
                  className="flex-shrink-0 px-2 py-1 rounded border border-dashed border-muted-foreground/30 text-[9px] text-muted-foreground/50"
                >
                  Bench {idx + 1}
                </div>
              ))
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
