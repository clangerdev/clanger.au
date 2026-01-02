import { useState, useMemo } from 'react';
import type { AflPlayer, AflPosition } from '@/types/database';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraftPlayerPoolProps {
  availablePlayers: AflPlayer[];
  isMyTurn: boolean;
  onSelectPlayer: (player: AflPlayer) => void;
  selectedPlayerId?: string;
}

const POSITION_FILTERS: (AflPosition | 'ALL')[] = ['ALL', 'DEF', 'MID', 'RUC', 'FWD'];

export function DraftPlayerPool({
  availablePlayers,
  isMyTurn,
  onSelectPlayer,
  selectedPlayerId,
}: DraftPlayerPoolProps) {
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<AflPosition | 'ALL'>('ALL');
  const [localSelectedId, setLocalSelectedId] = useState<string | undefined>(selectedPlayerId);

  const filteredPlayers = useMemo(() => {
    let players = [...availablePlayers];

    if (search) {
      const searchLower = search.toLowerCase();
      players = players.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.team.toLowerCase().includes(searchLower)
      );
    }

    if (positionFilter !== 'ALL') {
      players = players.filter((p) => p.position === positionFilter);
    }

    players.sort((a, b) => (b.avg_points || 0) - (a.avg_points || 0));
    return players;
  }, [availablePlayers, search, positionFilter]);

  const handlePlayerClick = (player: AflPlayer) => {
    if (!isMyTurn) return;
    setLocalSelectedId(player.id);
  };

  const handleDraftPlayer = () => {
    const player = availablePlayers.find((p) => p.id === localSelectedId);
    if (player && isMyTurn) {
      onSelectPlayer(player);
      setLocalSelectedId(undefined);
    }
  };

  const positionColors: Record<AFLPosition, string> = {
    DEF: 'bg-blue-500/30 text-blue-300',
    MID: 'bg-green-500/30 text-green-300',
    RUC: 'bg-purple-500/30 text-purple-300',
    FWD: 'bg-orange-500/30 text-orange-300',
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-2 border-b border-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold">
            Players <span className="text-muted-foreground">({availablePlayers.length})</span>
          </span>
          {isMyTurn && (
            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded animate-pulse font-medium">
              Your Turn!
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-7 text-xs"
          />
        </div>

        {/* Position Filters */}
        <div className="flex gap-0.5">
          {POSITION_FILTERS.map((pos) => (
            <Button
              key={pos}
              variant={positionFilter === pos ? 'default' : 'ghost'}
              size="sm"
              className="h-6 px-2 text-[10px] flex-1"
              onClick={() => setPositionFilter(pos)}
            >
              {pos}
            </Button>
          ))}
        </div>
      </div>

      {/* Player List */}
      <ScrollArea className="flex-1">
        <div className="p-1 space-y-0.5">
          {filteredPlayers.map((player, idx) => (
            <div
              key={player.id}
              onClick={() => handlePlayerClick(player)}
              className={cn(
                'flex items-center justify-between p-1.5 rounded text-xs transition-all',
                isMyTurn ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
                localSelectedId === player.id
                  ? 'bg-primary/30 ring-1 ring-primary'
                  : 'hover:bg-muted/50'
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground w-4">{idx + 1}</span>
                <div
                  className={cn(
                    'w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold',
                    positionColors[player.position as AFLPosition]
                  )}
                >
                  {player.position}
                </div>
                <div>
                  <p className="font-medium text-[11px] leading-tight">{player.name}</p>
                  <p className="text-[9px] text-muted-foreground">{player.team}</p>
                </div>
              </div>
              <span className="font-bold text-primary text-[10px]">
                {player.avg_points?.toFixed(0) || "0"}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Draft Button */}
      {isMyTurn && (
        <div className="p-2 border-t border-border">
          <Button
            className="w-full h-8 text-xs"
            disabled={!localSelectedId}
            onClick={handleDraftPlayer}
          >
            <Zap className="h-3 w-3 mr-1" />
            {localSelectedId
              ? `Draft ${availablePlayers.find((p) => p.id === localSelectedId)?.name.split(' ').pop()}`
              : 'Select player'}
          </Button>
        </div>
      )}
    </div>
  );
}
