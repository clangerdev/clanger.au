import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatSalary } from "@/lib/utils";
import type { Contest, AflPlayer } from "@/types/database";
import { Trophy, Zap } from "lucide-react";

interface EntryConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contest: Contest;
  roster: AflPlayer[];
  projectedPoints: number;
  salaryUsed: number;
  onConfirm: () => void;
}

export function EntryConfirmModal({
  open,
  onOpenChange,
  contest,
  roster,
  projectedPoints,
  salaryUsed,
  onConfirm,
}: EntryConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Confirm Entry
          </DialogTitle>
          <DialogDescription>
            Review your lineup before entering {contest.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Contest Info */}
          <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-card border border-border">
            <div>
              <p className="text-xs text-muted-foreground">Entry Fee</p>
              <p className="font-bold text-lg">
                {formatCurrency(contest.entry_fee)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Prize Pool</p>
              <p className="font-bold text-lg text-primary">
                {formatCurrency(contest.prize_pool)}
              </p>
            </div>
          </div>

          {/* Lineup Summary */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Your Lineup</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {roster.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary w-6">
                      {player.position}
                    </span>
                    <span className="text-sm">{player.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatSalary(player.salary)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
            <div>
              <p className="text-xs text-muted-foreground">Salary Used</p>
              <p className="font-bold">{formatSalary(salaryUsed)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Projected Pts</p>
              <p className="font-bold text-primary">
                {projectedPoints.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Edit Lineup
          </Button>
          <Button onClick={onConfirm} className="w-full sm:w-auto">
            <Zap className="h-4 w-4 mr-2" />
            Enter - {formatCurrency(contest.entry_fee)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
