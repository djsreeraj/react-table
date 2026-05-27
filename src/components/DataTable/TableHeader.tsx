import type { Table } from '@tanstack/react-table';
import type { Employee } from '../../types';
import { GRID_COLS } from './constants';

interface TableHeaderProps {
  table: Table<Employee>;
}

function SortIcon({ direction }: { direction: 'asc' | 'desc' | false }) {
  if (!direction) {
    return (
      <svg className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  return direction === 'asc' ? (
    <svg className="w-3 h-3 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-3 h-3 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/* right-aligned header cols */
const RIGHT_ALIGN = new Set(['salary']);
const CENTER_ALIGN = new Set(['age', 'startDate', 'actions']);

export function TableHeader({ table }: TableHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-slate-900/98 backdrop-blur-sm border-b border-slate-700/60">
      {table.getHeaderGroups().map(headerGroup => (
        <div key={headerGroup.id} role="row" className={`grid ${GRID_COLS}`}>
          {headerGroup.headers.map(header => {
            const canSort = header.column.getCanSort();
            const sorted = header.column.getIsSorted();
            const isRight = RIGHT_ALIGN.has(header.column.id);
            const isCenter = CENTER_ALIGN.has(header.column.id);
            return (
              <div
                key={header.id}
                role="columnheader"
                className={`
                  px-3 py-2.5 overflow-hidden
                  ${canSort ? 'cursor-pointer select-none group' : ''}
                  ${isRight ? 'flex justify-end' : isCenter ? 'flex justify-center' : ''}
                `}
                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
              >
                <div className={`flex items-center gap-1 min-w-0 ${isRight ? 'flex-row-reverse' : ''}`}>
                  <span className={`
                    text-xs font-semibold uppercase tracking-wider truncate transition-colors duration-150
                    ${sorted ? 'text-indigo-300' : 'text-slate-500 group-hover:text-slate-300'}
                  `}>
                    {header.column.columnDef.header as string}
                  </span>
                  {canSort && <SortIcon direction={sorted} />}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
