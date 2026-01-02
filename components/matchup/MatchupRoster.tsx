import { MatchupPlayerRow } from './MatchupPlayerRow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { AflPosition } from '@/types/database';

interface MatchupTeamWithPlayers {
  id: string;
  user_id: string;
  username: string;
  total_points: number;
  projected_total: number;
  players: Array<{
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
  }>;
}

interface MatchupRosterProps {
  team: MatchupTeamWithPlayers;
  isHome: boolean;
}

export function MatchupRoster({ team, isHome }: MatchupRosterProps) {
  // Group players by position
  const positions: AflPosition[] = ['DEF', 'MID', 'RUC', 'FWD'];
  const playersByPosition = positions.map(pos => ({
    position: pos,
    players: team.players.filter(p => p.player.position === pos)
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Team Header */}
      <div className={cn(
        'p-3 border-b border-border',
        isHome ? 'text-left' : 'text-right'
      )}>
        <p className="text-xs text-muted-foreground">
          {isHome ? 'HOME' : 'AWAY'}
        </p>
        <h3 className="font-bold text-lg">{team.username}</h3>
        <div className="flex items-baseline gap-2" style={{ justifyContent: isHome ? 'flex-start' : 'flex-end' }}>
          <span className="text-2xl font-bold text-primary">
            {team.total_points.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            / {team.projected_total.toFixed(1)} proj
          </span>
        </div>
      </div>

      {/* Player List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-3">
          {playersByPosition.map(({ position, players }) => (
            players.length > 0 && (
              <div key={position}>
                <p className={cn(
                  'text-[10px] text-muted-foreground font-medium mb-1 px-2',
                  !isHome && 'text-right'
                )}>
                  {position === 'DEF' ? 'DEFENDERS' :
                   position === 'MID' ? 'MIDFIELDERS' :
                   position === 'RUC' ? 'RUCKS' : 'FORWARDS'}
                </p>
                <div className="space-y-0.5">
                  {players.map((player) => (
                    <MatchupPlayerRow
                      key={player.id}
                      player={player}
                      isHome={isHome}
                    />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
