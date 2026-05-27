import type { Table } from '@tanstack/react-table';
import type { Employee } from '../../types';
import { Button } from '../ui/Button';

interface TablePaginationProps {
  table: Table<Employee>;
}

const PAGE_SIZES = [25, 50, 100, 200];

export function TablePagination({ table }: TablePaginationProps) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  const pages = buildPageNumbers(pageIndex, pageCount);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-900/60">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500">
          {totalRows === 0 ? '0 results' : `${from.toLocaleString()}–${to.toLocaleString()} of ${totalRows.toLocaleString()}`}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500">Rows per page:</span>
          <select
            value={pageSize}
            onChange={e => { table.setPageSize(Number(e.target.value)); table.setPageIndex(0); }}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-indigo-500"
          >
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-600 text-xs">…</span>
          ) : (
            <button
              key={p}
              onClick={() => table.setPageIndex(Number(p) - 1)}
              className={`w-7 h-7 text-xs rounded-md font-medium transition-all duration-150 cursor-pointer ${
                pageIndex === Number(p) - 1
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          )
        )}

        <Button
          variant="ghost"
          size="xs"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [];
  pages.push(1);
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 3); i++) {
    pages.push(i);
  }
  if (current < total - 4) pages.push('...');
  pages.push(total);
  return pages;
}
