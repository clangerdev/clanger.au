import { useState, useMemo } from 'react';
import { formatSalary } from '@/lib/utils';
import type { AflPlayer, AflPosition } from '@/types/database';
import { PlayerCard } from './PlayerCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PlayerPoolProps {
  players: AflPlayer[];
  selectedPlayerIds: Set<string>;
  canAddPlayer: (player: AflPlayer) => { canAdd: boolean; reason?: string };
  onAddPlayer: (player: AflPlayer) => void;
  remainingBudget: number;
}

type SortOption = 'salary-desc' | 'salary-asc' | 'points-desc' | 'points-asc' | 'value-desc';

const POSITION_FILTERS: (AflPosition | 'ALL')[] = ['ALL', 'DEF', 'MID', 'RUC', 'FWD'];

export function PlayerPool({
  players,
  selectedPlayerIds,
  canAddPlayer,
  onAddPlayer,
  remainingBudget,
}: PlayerPoolProps) {
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<AflPosition | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('salary-desc');

  const filteredPlayers = useMemo(() => {
    let filtered = [...players];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by position
    if (positionFilter !== 'ALL') {
      filtered = filtered.filter((p) => p.position === positionFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'salary-desc':
          return b.salary - a.salary;
        case 'salary-asc':
          return a.salary - b.salary;
        case 'points-desc':
          return (b.avg_points || 0) - (a.avg_points || 0);
        case 'points-asc':
          return (a.avg_points || 0) - (b.avg_points || 0);
        case 'value-desc':
          const aValue = a.avg_points && a.salary ? (a.avg_points / a.salary) * 1000 : 0;
          const bValue = b.avg_points && b.salary ? (b.avg_points / b.salary) * 1000 : 0;
          return bValue - aValue;
        default:
          return 0;
      }
    });

    return filtered;
  }, [players, search, positionFilter, sortBy]);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Position Filters */}
      <div className="flex gap-1 mb-3 flex-wrap">
        {POSITION_FILTERS.map((pos) => (
          <Button
            key={pos}
            variant={positionFilter === pos ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'px-3 h-8',
              positionFilter === pos && 'bg-primary text-primary-foreground'
            )}
            onClick={() => setPositionFilter(pos)}
          >
            {pos}
          </Button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 mb-3">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="h-8 text-sm flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="salary-desc">Salary (High to Low)</SelectItem>
            <SelectItem value="salary-asc">Salary (Low to High)</SelectItem>
            <SelectItem value="points-desc">Projected Pts (High to Low)</SelectItem>
            <SelectItem value="points-asc">Projected Pts (Low to High)</SelectItem>
            <SelectItem value="value-desc">Value (Best)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Budget Indicator */}
      <div className="text-sm text-muted-foreground mb-3 px-1">
        Budget: <span className="text-primary font-medium">{formatSalary(remainingBudget)}</span> remaining
      </div>

      {/* Player List */}
      <ScrollArea className="flex-1 -mx-1 px-1">
        <div className="space-y-2 pb-4">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isSelected={selectedPlayerIds.has(player.id)}
              canAdd={canAddPlayer(player)}
              onAdd={onAddPlayer}
            />
          ))}
          {filteredPlayers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No players found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
