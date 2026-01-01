"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppLayout } from '@/components/layout/AppLayout';
import { getStandingsByLeagueId, type TeamStanding } from '@/data/mockData';
import { cn } from '@/lib/utils';

function StandingRow({ team, index }: { team: TeamStanding; index: number }) {
  const winPct = team.wins + team.losses + team.ties > 0
    ? (team.wins / (team.wins + team.losses + team.ties) * 100).toFixed(0)
    : '0';

  const pointsDiff = team.pointsFor - team.pointsAgainst;
  const isPositiveDiff = pointsDiff > 0;

  const streakColor = team.streak.startsWith('W')
    ? 'text-green-400'
    : team.streak.startsWith('L')
    ? 'text-red-400'
    : 'text-muted-foreground';

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-3 border-b border-border/50 transition-colors',
        team.isCurrentUser && 'bg-primary/10',
        index === 0 && 'bg-yellow-500/5'
      )}
    >
      {/* Rank */}
      <div className="w-8 flex-shrink-0 flex items-center justify-center">
        {team.rank === 1 ? (
          <Crown className="h-5 w-5 text-yellow-500" />
        ) : (
          <span className={cn(
            'text-sm font-bold',
            team.rank <= 4 ? 'text-green-400' :
            team.rank >= 7 ? 'text-red-400' : 'text-muted-foreground'
          )}>
            {team.rank}
          </span>
        )}
      </div>

      {/* Team Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-semibold text-sm truncate',
            team.isCurrentUser && 'text-primary'
          )}>
            {team.username}
          </span>
          {team.isCurrentUser && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
              You
            </Badge>
          )}
        </div>
      </div>

      {/* Record */}
      <div className="w-16 text-center flex-shrink-0">
        <span className="text-sm font-medium">
          {team.wins}-{team.losses}{team.ties > 0 ? `-${team.ties}` : ''}
        </span>
        <p className="text-[10px] text-muted-foreground">{winPct}%</p>
      </div>

      {/* Points For */}
      <div className="w-20 text-right flex-shrink-0 hidden sm:block">
        <span className="text-sm font-medium">{team.pointsFor.toFixed(1)}</span>
        <p className="text-[10px] text-muted-foreground">PF</p>
      </div>

      {/* Points Against */}
      <div className="w-20 text-right flex-shrink-0 hidden sm:block">
        <span className="text-sm font-medium">{team.pointsAgainst.toFixed(1)}</span>
        <p className="text-[10px] text-muted-foreground">PA</p>
      </div>

      {/* Point Diff */}
      <div className="w-16 text-right flex-shrink-0">
        <span className={cn(
          'text-sm font-bold flex items-center justify-end gap-0.5',
          isPositiveDiff ? 'text-green-400' : pointsDiff < 0 ? 'text-red-400' : 'text-muted-foreground'
        )}>
          {isPositiveDiff ? <TrendingUp className="h-3 w-3" /> :
           pointsDiff < 0 ? <TrendingDown className="h-3 w-3" /> :
           <Minus className="h-3 w-3" />}
          {isPositiveDiff ? '+' : ''}{pointsDiff.toFixed(0)}
        </span>
        <p className="text-[10px] text-muted-foreground">DIFF</p>
      </div>

      {/* Streak */}
      <div className="w-12 text-center flex-shrink-0">
        <span className={cn('text-sm font-bold', streakColor)}>
          {team.streak}
        </span>
      </div>

      {/* Last 5 */}
      <div className="w-20 flex-shrink-0 hidden md:flex items-center justify-end gap-0.5">
        {team.lastFive.map((result, i) => (
          <div
            key={i}
            className={cn(
              'w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold',
              result === 'W' && 'bg-green-500/30 text-green-400',
              result === 'L' && 'bg-red-500/30 text-red-400',
              result === 'T' && 'bg-muted text-muted-foreground'
            )}
          >
            {result}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StandingsPage() {
  const params = useParams();
  const id = params?.id as string;
  const standings = getStandingsByLeagueId(id || '');

  if (!standings) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center p-6">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Standings Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This league doesn&apos;t exist or has no standings yet.
            </p>
            <Link href="/my-contests">
              <Button>Back to My Contests</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Find current user's standing
  const userStanding = standings.standings.find(s => s.isCurrentUser);

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-4 lg:-m-6">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-border bg-card">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Link href="/my-contests" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-lg font-bold">{standings.leagueName}</h1>
                <p className="text-xs text-muted-foreground">
                  Round {standings.currentRound} of {standings.totalRounds}
                </p>
              </div>
            </div>
            <Badge variant="outline">
              <Trophy className="h-3 w-3 mr-1" />
              Standings
            </Badge>
          </div>

          {/* User Summary */}
          {userStanding && (
            <div className="px-4 py-3 bg-primary/5 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">#{userStanding.rank}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Your Position</p>
                    <p className="text-xs text-muted-foreground">
                      {userStanding.wins}W - {userStanding.losses}L
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">
                    {userStanding.pointsFor.toFixed(1)} pts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userStanding.streak} streak
                  </p>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Standings Table Header */}
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border text-[10px] text-muted-foreground font-medium">
          <div className="w-8 flex-shrink-0 text-center">#</div>
          <div className="flex-1">TEAM</div>
          <div className="w-16 text-center flex-shrink-0">W-L</div>
          <div className="w-20 text-right flex-shrink-0 hidden sm:block">PTS FOR</div>
          <div className="w-20 text-right flex-shrink-0 hidden sm:block">PTS AGT</div>
          <div className="w-16 text-right flex-shrink-0">DIFF</div>
          <div className="w-12 text-center flex-shrink-0">STK</div>
          <div className="w-20 text-right flex-shrink-0 hidden md:block">LAST 5</div>
        </div>

        {/* Standings List */}
        <ScrollArea className="flex-1">
          {standings.standings.map((team, index) => (
            <StandingRow key={team.userId} team={team} index={index} />
          ))}
        </ScrollArea>

        {/* Legend */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-border bg-card">
          <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500/30" />
              <span>Playoff Position</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500/30" />
              <span>Elimination Zone</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

