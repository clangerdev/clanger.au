import { PlayerCard } from './PlayerCard';
import { cn } from '@/lib/utils';
import type { AflPlayer, AflPosition } from '@/types/database';
import type { RosterConfig } from '@/hooks/useRosterBuilder';

interface RosterSlot {
  position: AflPosition;
  player: AflPlayer | null;
}

interface SelectedRosterProps {
  roster: RosterSlot[];
  rosterConfig: RosterConfig;
  onRemovePlayer: (playerId: string) => void;
}

export function SelectedRoster({
  roster,
  rosterConfig,
  onRemovePlayer,
}: SelectedRosterProps) {
  const positions: AflPosition[] = ['DEF', 'MID', 'RUC', 'FWD'];

  // Group roster by position
  const rosterByPosition = positions.reduce((acc, pos) => {
    acc[pos] = roster.filter((slot) => slot.position === pos);
    return acc;
  }, {} as Record<AflPosition, RosterSlot[]>);

  return (
    <div className="space-y-4">
      {positions.map((position) => {
        const slots = rosterByPosition[position];
        const required = rosterConfig[position];
        const filled = slots.filter((s) => s.player).length;

        return (
          <div key={position}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">
                {position === 'DEF' && 'Defenders'}
                {position === 'MID' && 'Midfielders'}
                {position === 'RUC' && 'Ruckmen'}
                {position === 'FWD' && 'Forwards'}
              </h3>
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  filled >= required
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {filled}/{required}
              </span>
            </div>

            <div className="space-y-2">
              {slots.map((slot, index) => (
                <div key={`${position}-${index}`}>
                  {slot.player ? (
                    <PlayerCard
                      player={slot.player}
                      isSelected
                      compact
                      onRemove={onRemovePlayer}
                    />
                  ) : (
                    <div className="flex items-center justify-center p-3 rounded-lg border-2 border-dashed border-muted bg-muted/20">
                      <span className="text-sm text-muted-foreground">
                        Select {position}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
