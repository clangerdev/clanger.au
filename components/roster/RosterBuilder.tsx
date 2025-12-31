import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Contest, DAILY_ROSTER_CONFIG, DAILY_SALARY_CAP, AFLPosition } from '@/data/mockData';
import { useRosterBuilder } from '@/hooks/useRosterBuilder';
import { PlayerPool } from './PlayerPool';
import { SelectedRoster } from './SelectedRoster';
import { SalaryCapBar } from './SalaryCapBar';
import { RosterSummary } from './RosterSummary';
import { EntryConfirmModal } from './EntryConfirmModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Users, ListChecks, RotateCcw, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface RosterBuilderProps {
  contest: Contest;
}

export function RosterBuilder({ contest }: RosterBuilderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'players' | 'roster'>('players');

  const rosterConfig = contest.rosterConfig || DAILY_ROSTER_CONFIG;
  const salaryCap = contest.salaryCap || DAILY_SALARY_CAP;

  const {
    roster,
    selectedPlayerIds,
    salaryUsed,
    remainingBudget,
    projectedTotal,
    addPlayer,
    removePlayer,
    clearRoster,
    isRosterValid,
    isRosterFull,
    canAddPlayer,
  } = useRosterBuilder({ rosterConfig, salaryCap });

  // Calculate filled slots by position
  const filledSlots = roster.reduce(
    (acc, slot) => {
      if (slot.player) {
        acc[slot.position]++;
      }
      return acc;
    },
    { DEF: 0, MID: 0, RUC: 0, FWD: 0 } as Record<AFLPosition, number>
  );

  const handleAddPlayer = (player: (typeof roster)[0]['player']) => {
    if (player) {
      const success = addPlayer(player);
      if (success) {
        toast({
          title: 'Player Added',
          description: `${player.name} added to your lineup`,
        });
        // On mobile, show roster tab when player is added
        if (isMobile && isRosterFull) {
          setActiveTab('roster');
        }
      }
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    const player = roster.find((s) => s.player?.id === playerId)?.player;
    removePlayer(playerId);
    if (player) {
      toast({
        title: 'Player Removed',
        description: `${player.name} removed from lineup`,
        variant: 'destructive',
      });
    }
  };

  const handleClearRoster = () => {
    clearRoster();
    toast({
      title: 'Roster Cleared',
      description: 'All players have been removed',
    });
  };

  const handleConfirmEntry = () => {
    setShowConfirmModal(false);
    toast({
      title: 'Entry Submitted!',
      description: `You've entered ${contest.name}. Good luck!`,
    });
    router.push('/my-contests');
  };

  const selectedPlayers = roster
    .filter((s) => s.player)
    .map((s) => s.player!);

  // Mobile Layout with Tabs
  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'players' | 'roster')} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="players" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Players
            </TabsTrigger>
            <TabsTrigger value="roster" className="flex items-center gap-2 relative">
              <ListChecks className="h-4 w-4" />
              Roster
              {selectedPlayerIds.size > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {selectedPlayerIds.size}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="flex-1 mt-0 overflow-hidden">
            <PlayerPool
              selectedPlayerIds={selectedPlayerIds}
              canAddPlayer={canAddPlayer}
              onAddPlayer={handleAddPlayer}
              remainingBudget={remainingBudget}
            />
          </TabsContent>

          <TabsContent value="roster" className="flex-1 mt-0 overflow-auto">
            <div className="space-y-4 pb-4">
              <SalaryCapBar
                salaryUsed={salaryUsed}
                salaryCap={salaryCap}
                remainingBudget={remainingBudget}
              />
              <SelectedRoster
                roster={roster}
                rosterConfig={rosterConfig}
                onRemovePlayer={handleRemovePlayer}
              />
              <RosterSummary
                rosterConfig={rosterConfig}
                filledSlots={filledSlots}
                projectedTotal={projectedTotal}
                isRosterValid={isRosterValid}
                isRosterFull={isRosterFull}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearRoster}
                disabled={selectedPlayerIds.size === 0}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Roster
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Sticky Entry Button */}
        <div className="sticky bottom-0 pt-4 bg-gradient-to-t from-background via-background to-transparent -mx-4 px-4 pb-4">
          <Button
            size="lg"
            className="w-full"
            disabled={!isRosterValid}
            onClick={() => setShowConfirmModal(true)}
          >
            <Zap className="h-5 w-5 mr-2" />
            Enter Contest
          </Button>
        </div>

        <EntryConfirmModal
          open={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          contest={contest}
          roster={selectedPlayers}
          projectedPoints={projectedTotal}
          salaryUsed={salaryUsed}
          onConfirm={handleConfirmEntry}
        />
      </div>
    );
  }

  // Desktop Layout with Split Panels
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Player Pool - Left Side */}
      <div className="lg:col-span-3 bg-card rounded-xl border border-border p-4 h-[calc(100vh-280px)] flex flex-col">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Player Pool
        </h2>
        <PlayerPool
          selectedPlayerIds={selectedPlayerIds}
          canAddPlayer={canAddPlayer}
          onAddPlayer={handleAddPlayer}
          remainingBudget={remainingBudget}
        />
      </div>

      {/* Selected Roster - Right Side */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              My Lineup
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearRoster}
              disabled={selectedPlayerIds.size === 0}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>

          <SalaryCapBar
            salaryUsed={salaryUsed}
            salaryCap={salaryCap}
            remainingBudget={remainingBudget}
          />
        </div>

        <div className="bg-card rounded-xl border border-border p-4 max-h-[400px] overflow-y-auto">
          <SelectedRoster
            roster={roster}
            rosterConfig={rosterConfig}
            onRemovePlayer={handleRemovePlayer}
          />
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <RosterSummary
            rosterConfig={rosterConfig}
            filledSlots={filledSlots}
            projectedTotal={projectedTotal}
            isRosterValid={isRosterValid}
            isRosterFull={isRosterFull}
          />
        </div>

        {/* Entry Button */}
        <Button
          size="lg"
          className="w-full"
          disabled={!isRosterValid}
          onClick={() => setShowConfirmModal(true)}
        >
          <Zap className="h-5 w-5 mr-2" />
          Enter Contest
        </Button>
      </div>

      <EntryConfirmModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        contest={contest}
        roster={selectedPlayers}
        projectedPoints={projectedTotal}
        salaryUsed={salaryUsed}
        onConfirm={handleConfirmEntry}
      />
    </div>
  );
}
