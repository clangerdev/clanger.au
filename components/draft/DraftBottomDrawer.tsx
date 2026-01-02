import { useState } from 'react';
import { ChevronUp, ChevronDown, Users, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AflPlayer } from '@/types/database';
import { DraftFootyField } from './DraftFootyField';
import { DraftPlayerStatsTable } from './DraftPlayerStatsTable';

interface SeasonLongRosterConfig {
  onField: { DEF: number; MID: number; RUC: number; FWD: number };
  emergencies: { DEF: number; MID: number; RUC: number; FWD: number };
  bench: number;
}

interface DraftBottomDrawerProps {
  roster: AflPlayer[];
  rosterConfig: SeasonLongRosterConfig;
  availablePlayers: AflPlayer[];
  isMyTurn: boolean;
  onSelectPlayer: (player: AflPlayer) => void;
}

type DrawerTab = 'roster' | 'players';

export function DraftBottomDrawer({
  roster,
  rosterConfig,
  availablePlayers,
  isMyTurn,
  onSelectPlayer,
}: DraftBottomDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<DrawerTab>('roster');

  const totalPlayers = roster.length;
  const maxPlayers =
    Object.values(rosterConfig.onField).reduce((a, b) => a + b, 0) +
    Object.values(rosterConfig.emergencies).reduce((a, b) => a + b, 0) +
    rosterConfig.bench;

  return (
    <div
      className={cn(
        'bg-card border-t border-border transition-all duration-300 ease-in-out flex flex-col',
        isExpanded ? 'h-[60vh]' : 'h-14'
      )}
    >
      {/* Header - Always Visible */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          {/* Tab Buttons */}
          <div className="flex bg-muted/30 rounded-lg p-0.5">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 px-3 text-xs gap-1.5 rounded-md transition-all',
                activeTab === 'roster'
                  ? 'bg-primary text-primary-foreground hover:bg-primary'
                  : 'hover:bg-muted/50'
              )}
              onClick={() => setActiveTab('roster')}
            >
              <UserCheck className="h-3.5 w-3.5" />
              My Roster
              <span className="text-[10px] opacity-70">
                {totalPlayers}/{maxPlayers}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 px-3 text-xs gap-1.5 rounded-md transition-all',
                activeTab === 'players'
                  ? 'bg-primary text-primary-foreground hover:bg-primary'
                  : 'hover:bg-muted/50'
              )}
              onClick={() => setActiveTab('players')}
            >
              <Users className="h-3.5 w-3.5" />
              Available
              <span className="text-[10px] opacity-70">
                {availablePlayers.length}
              </span>
            </Button>
          </div>

          {isMyTurn && !isExpanded && (
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded-full animate-pulse font-medium">
              Your Pick!
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="flex-1 overflow-hidden">
          {activeTab === 'roster' ? (
            <DraftFootyField roster={roster} rosterConfig={rosterConfig} />
          ) : (
            <DraftPlayerStatsTable
              availablePlayers={availablePlayers}
              isMyTurn={isMyTurn}
              onSelectPlayer={onSelectPlayer}
            />
          )}
        </div>
      )}
    </div>
  );
}
