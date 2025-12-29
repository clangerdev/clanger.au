import { MatchupTeam } from '@/data/mockData';
import { MatchupPlayerRow } from './MatchupPlayerRow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface MatchupRosterProps {
  team: MatchupTeam;
  isHome: boolean;
}

export function MatchupRoster({ team, isHome }: MatchupRosterProps) {
  // Group players by position
  const positions = ['DEF', 'MID', 'RUC', 'FWD'] as const;
  const playersByPosition = positions.map(pos => ({
    position: pos,
    players: team.players.filter(p => p.position === pos)
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
            {team.totalPoints.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            / {team.projectedTotal} proj
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
