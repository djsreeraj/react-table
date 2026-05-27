import type { Table } from '@tanstack/react-table';
import type { Employee } from '../../types';
import { GRID_COLS } from './constants';

interface TableFiltersProps {
  table: Table<Employee>;
}

const DEPARTMENTS = ['', 'Engineering','Product','Design','Marketing','Sales','Finance','HR','Legal','Operations','Customer Success'];
const STATUSES = ['', 'Active', 'Inactive', 'On Leave', 'Remote'];

const inputBase = `
  w-full bg-slate-800/80 border border-slate-700/50 rounded-md text-slate-300 text-xs
  px-2 py-1.5 placeholder:text-slate-600
  focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20
  transition-all duration-150
`;
const selectBase = `${inputBase} bg-slate-800`;

export function TableFilters({ table }: TableFiltersProps) {
  const col = (id: string) => table.getColumn(id)!;

  return (
    <div className="border-b border-slate-800/80 bg-slate-900/40">
      <div className={`grid ${GRID_COLS}`}>
        <div />

        <div className="px-3 py-2">
          <input className={inputBase} placeholder="Search name…"
            value={(col('name').getFilterValue() as string) ?? ''}
            onChange={e => col('name').setFilterValue(e.target.value)} />
        </div>

        <div className="px-3 py-2">
          <input className={inputBase} placeholder="Search email…"
            value={(col('email').getFilterValue() as string) ?? ''}
            onChange={e => col('email').setFilterValue(e.target.value)} />
        </div>

        <div className="px-3 py-2">
          <select className={selectBase}
            value={(col('department').getFilterValue() as string) ?? ''}
            onChange={e => col('department').setFilterValue(e.target.value || undefined)}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d || 'All depts'}</option>)}
          </select>
        </div>

        <div className="px-3 py-2">
          <input className={inputBase} placeholder="Search role…"
            value={(col('role').getFilterValue() as string) ?? ''}
            onChange={e => col('role').setFilterValue(e.target.value)} />
        </div>

        <div className="px-3 py-2">
          <input type="number" className={inputBase} placeholder="Min $"
            value={((col('salary').getFilterValue() as [number, number]) ?? [])[0] ?? ''}
            onChange={e => {
              const val = e.target.value ? Number(e.target.value) : undefined;
              const cur = (col('salary').getFilterValue() as [number?, number?]) ?? [];
              col('salary').setFilterValue([val, cur[1]]);
            }} />
        </div>

        <div className="px-1 py-2">
          <input type="number" className={inputBase} placeholder="≥"
            value={((col('age').getFilterValue() as [number, number]) ?? [])[0] ?? ''}
            onChange={e => {
              const val = e.target.value ? Number(e.target.value) : undefined;
              col('age').setFilterValue(val ? [val, 100] : undefined);
            }} />
        </div>

        <div className="px-3 py-2">
          <select className={selectBase}
            value={(col('status').getFilterValue() as string) ?? ''}
            onChange={e => col('status').setFilterValue(e.target.value || undefined)}>
            {STATUSES.map(s => <option key={s} value={s}>{s || 'All'}</option>)}
          </select>
        </div>

        <div className="px-3 py-2">
          <input type="date" className={inputBase}
            value={(col('startDate').getFilterValue() as string) ?? ''}
            onChange={e => col('startDate').setFilterValue(e.target.value || undefined)} />
        </div>

        <div className="px-3 py-2">
          <input type="number" className={inputBase} placeholder="Min score" min={0} max={100}
            value={((col('performance').getFilterValue() as [number, number]) ?? [])[0] ?? ''}
            onChange={e => {
              const val = e.target.value ? Number(e.target.value) : undefined;
              col('performance').setFilterValue(val ? [val, 100] : undefined);
            }} />
        </div>

        <div />
      </div>
    </div>
  );
}
