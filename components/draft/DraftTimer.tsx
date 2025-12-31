import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface DraftTimerProps {
  timeRemaining: number;
  isMyTurn: boolean;
  pickTimeLimit: number;
}

export function DraftTimer({ timeRemaining, isMyTurn, pickTimeLimit: _pickTimeLimit }: DraftTimerProps) {
  // Keep pickTimeLimit in interface for API compatibility, but not used in current implementation
  void _pickTimeLimit;
  const isLow = timeRemaining <= 15;
  const isCritical = timeRemaining <= 5;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded border text-[10px]',
        isCritical
          ? 'bg-destructive/20 border-destructive text-destructive'
          : isLow
          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
          : isMyTurn
          ? 'bg-primary/20 border-primary text-primary'
          : 'bg-muted border-border text-muted-foreground'
      )}
    >
      <Clock className={cn('h-3 w-3', isCritical && 'animate-pulse')} />
      <span className={cn('font-bold tabular-nums', isCritical && 'animate-pulse')}>
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
}
