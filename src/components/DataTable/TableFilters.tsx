import { useState, useEffect, useCallback } from 'react';
import type { Column, Table } from '@tanstack/react-table';
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

function DebouncedInput({
  column, placeholder, delay = 300,
}: {
  column: Column<Employee>; placeholder: string; delay?: number;
}) {
  const [value, setValue] = useState((column.getFilterValue() as string) ?? '');

  useEffect(() => {
    const external = (column.getFilterValue() as string) ?? '';
    if (external !== value) setValue(external);
  }, [column.getFilterValue()]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(() => column.setFilterValue(value || undefined), delay);
    return () => clearTimeout(t);
  }, [value, delay]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input className={inputBase} placeholder={placeholder} value={value} onChange={e => setValue(e.target.value)} />
  );
}

function DebouncedNumberInput({
  column, placeholder, delay = 300,
}: {
  column: Column<Employee>; placeholder: string; delay?: number;
}) {
  const [value, setValue] = useState(((column.getFilterValue() as [number?, number?]) ?? [])[0] ?? '');

  useEffect(() => {
    const ext = ((column.getFilterValue() as [number?, number?]) ?? [])[0] ?? '';
    if (ext !== value) setValue(ext);
  }, [column.getFilterValue()]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(() => {
      const num = value !== '' ? Number(value) : undefined;
      column.setFilterValue(num !== undefined ? [num, Infinity] : undefined);
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input type="number" className={inputBase} placeholder={placeholder} value={value}
      onChange={e => setValue(e.target.value === '' ? '' : Number(e.target.value))} />
  );
}

export function TableFilters({ table }: TableFiltersProps) {
  const col = useCallback((id: string) => table.getColumn(id)!, [table]);

  return (
    <div className="border-b border-slate-800/80 bg-slate-900/40">
      <div className={`grid ${GRID_COLS}`}>
        <div />
        <div className="px-3 py-2"><DebouncedInput column={col('name')} placeholder="Search name…" /></div>
        <div className="px-3 py-2"><DebouncedInput column={col('email')} placeholder="Search email…" /></div>
        <div className="px-3 py-2">
          <select className={selectBase}
            value={(col('department').getFilterValue() as string) ?? ''}
            onChange={e => col('department').setFilterValue(e.target.value || undefined)}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d || 'All depts'}</option>)}
          </select>
        </div>
        <div className="px-3 py-2"><DebouncedInput column={col('role')} placeholder="Search role…" /></div>
        <div className="px-3 py-2"><DebouncedNumberInput column={col('salary')} placeholder="Min $" /></div>
        <div className="px-1 py-2"><DebouncedNumberInput column={col('age')} placeholder="≥" /></div>
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
        <div className="px-3 py-2"><DebouncedNumberInput column={col('performance')} placeholder="Min score" /></div>
        <div />
      </div>
    </div>
  );
}
