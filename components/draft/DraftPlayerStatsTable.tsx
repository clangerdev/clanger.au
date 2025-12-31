import { useState, useMemo } from 'react';
import { Player, AFLPosition } from '@/data/mockData';
import { getPlayerStats, CLANGER_SAUCE_CONFIG } from '@/data/playerStats';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Zap, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DraftPlayerStatsTableProps {
  availablePlayers: Player[];
  isMyTurn: boolean;
  onSelectPlayer: (player: Player) => void;
}

type SortField =
  | 'projectedPoints'
  | 'disposals'
  | 'disposalEfficiency'
  | 'kicks'
  | 'handballs'
  | 'marks'
  | 'tackles'
  | 'hitouts'
  | 'contestedPossessions';

type SortDirection = 'asc' | 'desc';

const POSITION_FILTERS: (AFLPosition | 'ALL')[] = ['ALL', 'DEF', 'MID', 'RUC', 'FWD'];

const positionColors: Record<AFLPosition, string> = {
  DEF: 'bg-blue-500/30 text-blue-300',
  MID: 'bg-green-500/30 text-green-300',
  RUC: 'bg-purple-500/30 text-purple-300',
  FWD: 'bg-orange-500/30 text-orange-300',
};

export function DraftPlayerStatsTable({
  availablePlayers,
  isMyTurn,
  onSelectPlayer,
}: DraftPlayerStatsTableProps) {
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<AFLPosition | 'ALL'>('ALL');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>();
  const [sortField, setSortField] = useState<SortField>('projectedPoints');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

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

    // Sort by selected field
    players.sort((a, b) => {
      const statsA = getPlayerStats(a.id);
      const statsB = getPlayerStats(b.id);

      let valA: number;
      let valB: number;

      if (sortField === 'projectedPoints') {
        valA = a.projectedPoints;
        valB = b.projectedPoints;
      } else {
        valA = statsA?.[sortField] ?? 0;
        valB = statsB?.[sortField] ?? 0;
      }

      return sortDirection === 'desc' ? valB - valA : valA - valB;
    });

    return players;
  }, [availablePlayers, search, positionFilter, sortField, sortDirection]);

  const handlePlayerClick = (player: Player) => {
    if (!isMyTurn) return;
    setSelectedPlayerId(player.id);
  };

  const handleDraftPlayer = () => {
    const player = availablePlayers.find((p) => p.id === selectedPlayerId);
    if (player && isMyTurn) {
      onSelectPlayer(player);
      setSelectedPlayerId(undefined);
    }
  };

  const SortHeader = ({ field, label, short }: { field: SortField; label: string; short?: string }) => (
    <th
      className="px-2 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-0.5">
        <span className="hidden lg:inline">{label}</span>
        <span className="lg:hidden">{short || label}</span>
        {sortField === field ? (
          sortDirection === 'desc' ? (
            <ArrowDown className="h-3 w-3" />
          ) : (
            <ArrowUp className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-30" />
        )}
      </div>
    </th>
  );

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col">
        {/* Filters */}
        <div className="flex-shrink-0 p-3 border-b border-border/50 flex items-center gap-3 flex-wrap">
          <div className="relative w-48">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

          <div className="flex gap-0.5">
            {POSITION_FILTERS.map((pos) => (
              <Button
                key={pos}
                variant={positionFilter === pos ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2.5 text-[10px]"
                onClick={() => setPositionFilter(pos)}
              >
                {pos}
              </Button>
            ))}
          </div>

          {isMyTurn && selectedPlayerId && (
            <Button
              size="sm"
              className="h-7 text-xs ml-auto"
              onClick={handleDraftPlayer}
            >
              <Zap className="h-3 w-3 mr-1" />
              Draft {availablePlayers.find((p) => p.id === selectedPlayerId)?.name.split(' ').pop()}
            </Button>
          )}
        </div>

        {/* Stats Table */}
        <ScrollArea className="flex-1">
          <div className="min-w-[900px]">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card z-10 border-b border-border/50">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-8">#</th>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Player</th>
                  <th className="px-2 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pos</th>
                  <SortHeader field="projectedPoints" label="Proj" short="Proj" />
                  <SortHeader field="disposals" label="Disp" short="D" />
                  <SortHeader field="disposalEfficiency" label="Eff%" short="E%" />
                  <SortHeader field="kicks" label="Kicks" short="K" />
                  <SortHeader field="handballs" label="HB" short="HB" />
                  <SortHeader field="marks" label="Marks" short="M" />
                  <SortHeader field="tackles" label="Tack" short="T" />
                  <SortHeader field="hitouts" label="HO" short="HO" />
                  <SortHeader field="contestedPossessions" label="CP" short="CP" />
                  <th className="px-2 py-2 text-[10px] font-semibold text-primary uppercase tracking-wider sticky right-0 bg-card border-l border-border/30">
                    🌶️ Clanger Sauce
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player, idx) => {
                  const stats = getPlayerStats(player.id);
                  const isSelected = selectedPlayerId === player.id;

                  return (
                    <tr
                      key={player.id}
                      onClick={() => handlePlayerClick(player)}
                      className={cn(
                        'border-b border-border/20 transition-colors',
                        isMyTurn ? 'cursor-pointer' : 'cursor-not-allowed opacity-60',
                        isSelected
                          ? 'bg-primary/20 border-primary/30'
                          : 'hover:bg-muted/30'
                      )}
                    >
                      <td className="px-2 py-2 text-muted-foreground">{idx + 1}</td>
                      <td className="px-2 py-2">
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-[10px] text-muted-foreground">{player.team}</div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span
                          className={cn(
                            'px-1.5 py-0.5 rounded text-[9px] font-bold',
                            positionColors[player.position]
                          )}
                        >
                          {player.position}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center font-bold text-primary">
                        {player.projectedPoints.toFixed(1)}
                      </td>
                      <td className="px-2 py-2 text-center">{stats?.disposals.toFixed(1) || '-'}</td>
                      <td className="px-2 py-2 text-center">{stats?.disposalEfficiency || '-'}%</td>
                      <td className="px-2 py-2 text-center">{stats?.kicks.toFixed(1) || '-'}</td>
                      <td className="px-2 py-2 text-center">{stats?.handballs.toFixed(1) || '-'}</td>
                      <td className="px-2 py-2 text-center">{stats?.marks.toFixed(1) || '-'}</td>
                      <td className="px-2 py-2 text-center">{stats?.tackles.toFixed(1) || '-'}</td>
                      <td className="px-2 py-2 text-center">
                        {stats?.hitouts ? stats.hitouts.toFixed(1) : '-'}
                      </td>
                      <td className="px-2 py-2 text-center">{stats?.contestedPossessions.toFixed(1) || '-'}</td>
                      <td className="px-2 py-2 sticky right-0 bg-card border-l border-border/30">
                        <div className="flex gap-1 flex-wrap">
                          {stats?.clangerSauce.map((tag) => {
                            const config = CLANGER_SAUCE_CONFIG[tag];
                            return (
                              <Tooltip key={tag}>
                                <TooltipTrigger asChild>
                                  <span
                                    className={cn(
                                      'px-1.5 py-0.5 rounded text-[9px] font-medium border cursor-help whitespace-nowrap',
                                      config.color
                                    )}
                                  >
                                    {config.emoji} {config.label}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="text-xs">
                                  <p className="font-semibold">{config.label}</p>
                                  <p className="text-muted-foreground">{config.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          }) || '-'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
