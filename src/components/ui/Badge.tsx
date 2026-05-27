import type { EmployeeStatus } from '../../types';

interface BadgeProps {
  status: EmployeeStatus;
}

const config: Record<EmployeeStatus, { dot: string; text: string; bg: string }> = {
  Active:   { dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-400/10 ring-emerald-400/20' },
  Remote:   { dot: 'bg-indigo-400',  text: 'text-indigo-300',  bg: 'bg-indigo-400/10 ring-indigo-400/20' },
  'On Leave': { dot: 'bg-amber-400', text: 'text-amber-300',   bg: 'bg-amber-400/10 ring-amber-400/20' },
  Inactive: { dot: 'bg-slate-500',   text: 'text-slate-400',   bg: 'bg-slate-500/10 ring-slate-500/20' },
};

export function Badge({ status }: BadgeProps) {
  const { dot, text, bg } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
