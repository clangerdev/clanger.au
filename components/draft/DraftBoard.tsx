import { cn } from '@/lib/utils';
import type { AflPlayer } from '@/types/database';

const TOTAL_DRAFT_PICKS = 28;

// Helper function to get pick info
function getPickInfo(
  pickNumber: number,
  teamCount: number
): { round: number; pickInRound: number; teamIndex: number } {
  const round = Math.floor(pickNumber / teamCount);
  const pickInRound = pickNumber % teamCount;
  const isReversed = round % 2 === 1;
  const teamIndex = isReversed ? teamCount - 1 - pickInRound : pickInRound;
  return { round: round + 1, pickInRound: pickInRound + 1, teamIndex };
}

interface LeagueMember {
  userId: string;
  username: string;
  isCommissioner: boolean;
  draftPosition?: number;
  roster: AflPlayer[];
}

interface DraftPick {
  pickNumber: number;
  round: number;
  userId: string;
  username: string;
  player: AflPlayer;
  timestamp: string;
}

interface DraftBoardProps {
  members: LeagueMember[];
  draftPicks: DraftPick[];
  currentPick: number;
  currentUserId: string;
}

export function DraftBoard({
  members,
  draftPicks,
  currentPick,
  currentUserId,
}: DraftBoardProps) {
  const teamCount = members.length;
  const totalRounds = TOTAL_DRAFT_PICKS;

  const sortedMembers = [...members].sort(
    (a, b) => (a.draftPosition || 0) - (b.draftPosition || 0)
  );

  const picksByRoundAndTeam: Record<string, DraftPick | null> = {};
  draftPicks.forEach((pick) => {
    const key = `${pick.round}-${pick.userId}`;
    picksByRoundAndTeam[key] = pick;
  });

  const { round: currentRound, teamIndex: currentTeamIdx } = getPickInfo(
    currentPick,
    teamCount
  );

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'DEF': return 'bg-blue-500/40 border-blue-400 text-blue-200';
      case 'MID': return 'bg-green-500/40 border-green-400 text-green-200';
      case 'RUC': return 'bg-purple-500/40 border-purple-400 text-purple-200';
      case 'FWD': return 'bg-orange-500/40 border-orange-400 text-orange-200';
      default: return 'bg-muted border-border';
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      {/* Header - Team Names */}
      <div className="flex-shrink-0 flex border-b border-border">
        {/* Round column header */}
        <div className="w-8 flex-shrink-0 h-8 flex items-center justify-center border-r border-border bg-background">
          <span className="text-[10px] text-muted-foreground font-medium">R</span>
        </div>

        {/* Team headers - fill remaining width equally */}
        <div className="flex-1 flex">
          {sortedMembers.map((member) => (
            <div
              key={member.userId}
              className={cn(
                'flex-1 min-w-0 h-8 flex items-center justify-center px-1 border-r border-border',
                member.userId === currentUserId && 'bg-primary/20'
              )}
            >
              <span className={cn(
                'text-[10px] font-semibold truncate',
                member.userId === currentUserId ? 'text-primary' : 'text-foreground'
              )}>
                {member.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rounds - scrollable but rows fill available height */}
      <div className="flex-1 overflow-auto">
        <div
          className="grid h-full"
          style={{
            gridTemplateRows: `repeat(${totalRounds}, minmax(32px, 1fr))`,
          }}
        >
          {Array.from({ length: totalRounds }, (_, roundIdx) => {
            const round = roundIdx + 1;

            return (
              <div key={round} className="flex border-b border-border/30 min-h-0">
                {/* Round number */}
                <div className="w-8 flex-shrink-0 flex items-center justify-center border-r border-border bg-background">
                  <span className="text-[10px] font-bold text-muted-foreground">{round}</span>
                </div>

                {/* Team slots - fill remaining width equally */}
                <div className="flex-1 flex">
                  {sortedMembers.map((member, memberIdx) => {
                    const pickKey = `${round}-${member.userId}`;
                    const pick = picksByRoundAndTeam[pickKey];
                    const isCurrentSlot = round === currentRound && memberIdx === currentTeamIdx;
                    const isMyColumn = member.userId === currentUserId;

                    const isReverseRound = roundIdx % 2 === 1;
                    let slotPickNumber: number;
                    if (isReverseRound) {
                      slotPickNumber = roundIdx * teamCount + (teamCount - memberIdx);
                    } else {
                      slotPickNumber = roundIdx * teamCount + memberIdx + 1;
                    }

                    return (
                      <div
                        key={`${round}-${member.userId}`}
                        className={cn(
                          'flex-1 min-w-0 p-0.5 border-r border-border/30',
                          isMyColumn && 'bg-primary/10',
                          isCurrentSlot && 'bg-primary/30 ring-2 ring-primary ring-inset'
                        )}
                      >
                        {pick ? (
                          <div className={cn(
                            'h-full rounded p-1 border flex flex-col justify-center',
                            getPositionColor(pick.player.position)
                          )}>
                            <p className="text-[9px] font-semibold truncate leading-none">
                              {pick.player.name.split(' ').pop()}
                            </p>
                            <span className="text-[8px] font-bold opacity-80 truncate">
                              {pick.player.position} • {pick.player.team}
                            </span>
                          </div>
                        ) : isCurrentSlot ? (
                          <div className="h-full rounded border border-dashed border-primary flex items-center justify-center bg-primary/20">
                            <span className="text-[9px] font-bold text-primary">NOW</span>
                          </div>
                        ) : (
                          <div className="h-full rounded border border-dashed border-border/50 flex items-center justify-center">
                            <span className="text-[8px] text-muted-foreground/50">#{slotPickNumber}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
