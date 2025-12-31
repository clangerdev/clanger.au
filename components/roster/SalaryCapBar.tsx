import { cn } from '@/lib/utils';
import { formatSalary } from '@/data/mockData';

interface SalaryCapBarProps {
  salaryUsed: number;
  salaryCap: number;
  remainingBudget: number;
}

export function SalaryCapBar({
  salaryUsed,
  salaryCap,
  remainingBudget,
}: SalaryCapBarProps) {
  const percentage = Math.min((salaryUsed / salaryCap) * 100, 100);
  const isOverCap = salaryUsed > salaryCap;

  const barColor = isOverCap
    ? 'bg-destructive'
    : percentage > 95
    ? 'bg-destructive'
    : percentage > 80
    ? 'bg-yellow-500'
    : 'bg-primary';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Salary</span>
        <span className={cn('font-semibold', isOverCap && 'text-destructive')}>
          {formatSalary(salaryUsed)} / {formatSalary(salaryCap)}
        </span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300 rounded-full', barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Remaining</span>
        <span
          className={cn(
            'font-medium',
            isOverCap ? 'text-destructive' : 'text-primary'
          )}
        >
          {isOverCap ? '-' : ''}
          {formatSalary(Math.abs(remainingBudget))}
        </span>
      </div>
    </div>
  );
}
