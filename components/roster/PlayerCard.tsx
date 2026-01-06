import { formatSalary } from '@/lib/utils';
import type { AflPlayer } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: AflPlayer;
  isSelected?: boolean;
  canAdd?: { canAdd: boolean; reason?: string };
  onAdd?: (player: AflPlayer) => void;
  onRemove?: (playerId: string) => void;
  compact?: boolean;
}

export function PlayerCard({
  player,
  isSelected = false,
  canAdd = { canAdd: true },
  onAdd,
  onRemove,
  compact = false,
}: PlayerCardProps) {
  const statusColor = {
    healthy: 'bg-green-500/20 text-green-400 border-green-500/30',
    questionable: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    out: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {player.position}
          </div>
          <div>
            <p className="font-medium text-sm">{player.name}</p>
            <p className="text-xs text-muted-foreground">Team ID: {player.team_id.slice(0, 8)}</p>
          </div>
        </div>
        {onRemove && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(player.id)}
          >
            <Minus className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border transition-all',
        isSelected
          ? 'bg-primary/10 border-primary/50'
          : 'bg-card border-border hover:border-primary/30',
        !canAdd.canAdd && !isSelected && 'opacity-50'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
          {player.position}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{player.name}</p>
            {player.status && player.status !== 'healthy' && (
              <Badge
                variant="outline"
                className={cn('text-xs px-1.5 py-0', statusColor[player.status])}
              >
                {player.status === 'questionable' ? 'Q' : 'OUT'}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {player.position} • {formatSalary(player.salary)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-primary">{formatSalary(player.salary)}</p>
          <p className="text-xs text-muted-foreground">
            {player.avg_points?.toFixed(1) || '0.0'} pts
          </p>
        </div>

        {isSelected ? (
          onRemove && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={() => onRemove(player.id)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          )
        ) : onAdd ? (
          <div className="relative group">
            <Button
              size="sm"
              variant="outline"
              className={cn(
                'h-8 w-8 p-0',
                canAdd.canAdd
                  ? 'border-primary/50 text-primary hover:bg-primary/10'
                  : 'border-muted text-muted-foreground cursor-not-allowed'
              )}
              onClick={() => canAdd.canAdd && onAdd(player)}
              disabled={!canAdd.canAdd}
            >
              <Plus className="h-4 w-4" />
            </Button>
            {!canAdd.canAdd && canAdd.reason && (
              <div className="absolute right-0 top-full mt-1 z-10 hidden group-hover:block">
                <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap border border-border">
                  <AlertCircle className="h-3 w-3 inline mr-1" />
                  {canAdd.reason}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
