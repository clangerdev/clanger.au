import type { AflPosition } from '@/types/database';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

interface MatchupPlayerData {
  id: string;
  matchup_team_id: string;
  player_id: string;
  live_points: number;
  is_playing: boolean;
  game_status: 'upcoming' | 'live' | 'completed';
  player: {
    id: string;
    name: string;
    position: AflPosition;
    salary: number;
    avg_points: number | null;
  };
}

interface MatchupPlayerRowProps {
  player: MatchupPlayerData;
  isHome: boolean;
}

export function MatchupPlayerRow({ player, isHome }: MatchupPlayerRowProps) {
  const positionColors: Record<AflPosition, string> = {
    DEF: 'bg-blue-500/30 text-blue-300',
    MID: 'bg-green-500/30 text-green-300',
    RUC: 'bg-purple-500/30 text-purple-300',
    FWD: 'bg-orange-500/30 text-orange-300',
  };

  const statusColors = {
    upcoming: 'text-muted-foreground',
    live: 'text-green-400',
    completed: 'text-muted-foreground',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg',
        player.is_playing && 'bg-green-500/10',
        isHome ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      {/* Position Badge */}
      <div
        className={cn(
          'w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0',
          positionColors[player.player.position]
        )}
      >
        {player.player.position}
      </div>

      {/* Player Info */}
      <div className={cn('flex-1 min-w-0', !isHome && 'text-right')}>
        <div className="flex items-center gap-1.5" style={{ justifyContent: isHome ? 'flex-start' : 'flex-end' }}>
          {player.is_playing && (
            <Circle className="h-2 w-2 fill-green-400 text-green-400 animate-pulse" />
          )}
          <span className="font-medium text-sm truncate">{player.player.name}</span>
        </div>
        <div className={cn('flex items-center gap-1 text-[10px]', !isHome && 'justify-end')}>
          <span className={statusColors[player.game_status]}>
            {player.game_status === 'live' ? '• LIVE' : player.game_status === 'completed' ? '• FT' : ''}
          </span>
        </div>
      </div>

      {/* Points */}
      <div className={cn('text-right flex-shrink-0', !isHome && 'text-left')}>
        <p className={cn(
          'font-bold text-sm',
          player.game_status === 'live' && 'text-green-400',
          player.game_status === 'upcoming' && 'text-muted-foreground'
        )}>
          {player.live_points > 0 ? player.live_points.toFixed(1) : '-'}
        </p>
        <p className="text-[10px] text-muted-foreground">
          proj {player.player.avg_points?.toFixed(0) || '0'}
        </p>
      </div>
    </div>
  );
}
