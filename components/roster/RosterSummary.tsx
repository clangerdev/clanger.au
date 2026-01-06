import { cn } from '@/lib/utils';
import { Check, AlertCircle } from 'lucide-react';
import type { AflPosition } from '@/types/database';
import type { RosterConfig } from '@/hooks/useRosterBuilder';

interface RosterSummaryProps {
  rosterConfig: RosterConfig;
  filledSlots: Record<AflPosition, number>;
  projectedTotal: number;
  isRosterValid: boolean;
  isRosterFull: boolean;
}

export function RosterSummary({
  rosterConfig,
  filledSlots,
  projectedTotal,
  isRosterValid,
}: RosterSummaryProps) {
  const positions: AflPosition[] = ['DEF', 'MID', 'RUC', 'FWD'];
  const totalRequired = Object.values(rosterConfig).reduce((a, b) => a + b, 0);
  const totalFilled = Object.values(filledSlots).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Position Progress */}
      <div className="grid grid-cols-4 gap-2">
        {positions.map((pos) => {
          const required = rosterConfig[pos];
          const filled = filledSlots[pos];
          const isComplete = filled >= required;

          return (
            <div
              key={pos}
              className={cn(
                'text-center p-2 rounded-lg border transition-colors',
                isComplete
                  ? 'bg-primary/10 border-primary/50'
                  : 'bg-card border-border'
              )}
            >
              <p className="text-xs text-muted-foreground">{pos}</p>
              <p
                className={cn(
                  'font-bold text-lg',
                  isComplete ? 'text-primary' : 'text-foreground'
                )}
              >
                {filled}/{required}
              </p>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
        <div>
          <p className="text-xs text-muted-foreground">Projected Points</p>
          <p className="text-xl font-bold text-primary">{projectedTotal.toFixed(1)}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">Roster Status</p>
          <div className="flex items-center gap-1 justify-end">
            {isRosterValid ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-500">Ready</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">
                  {totalFilled}/{totalRequired} filled
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
