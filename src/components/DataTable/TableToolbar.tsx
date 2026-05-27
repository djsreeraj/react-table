import type { Table } from '@tanstack/react-table';
import type { Employee } from '../../types';
import { useTableContext } from '../../context/TableContext';
import { exportToCsv } from '../../utils/exportCsv';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type ViewMode = 'virtual' | 'paginated';

interface TableToolbarProps {
  table: Table<Employee>;
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  onClearFilters: () => void;
}

export function TableToolbar({
  table,
  globalFilter,
  setGlobalFilter,
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters,
  onClearFilters,
}: TableToolbarProps) {
  const { rows, dirtyRowIds } = useTableContext();
  const filteredCount = table.getFilteredRowModel().rows.length;
  const totalCount = rows.length;
  const hasFilters = table.getState().columnFilters.length > 0 || globalFilter;
  const hasUnsaved = dirtyRowIds.size > 0;

  return (
    <div className="px-4 py-3 border-b border-slate-800 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-center gap-3">
        {/* Title */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-violet-600 rounded-full" />
          <div>
            <h1 className="text-base font-semibold text-slate-100 leading-tight">Employee Directory</h1>
            <p className="text-xs text-slate-500">
              {hasFilters
                ? `${filteredCount.toLocaleString()} of ${totalCount.toLocaleString()} employees`
                : `${totalCount.toLocaleString()} employees`}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs">
          <Input
            icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
          />
        </div>

        <div className="flex-1" />

        {/* Unsaved changes badge */}
        {hasUnsaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 ring-1 ring-amber-500/30 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-amber-300 font-medium">
              {dirtyRowIds.size} unsaved {dirtyRowIds.size === 1 ? 'change' : 'changes'}
            </span>
          </div>
        )}

        {/* Filter toggle */}
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
          }
        >
          Filters
          {table.getState().columnFilters.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-indigo-500 text-white text-xs rounded-full leading-none">
              {table.getState().columnFilters.length}
            </span>
          )}
        </Button>

        {/* Clear filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          >
            Clear
          </Button>
        )}

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-800 rounded-lg p-0.5 ring-1 ring-slate-700">
          <button
            onClick={() => setViewMode('virtual')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer ${
              viewMode === 'virtual'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Virtual
          </button>
          <button
            onClick={() => setViewMode('paginated')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer ${
              viewMode === 'paginated'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paginated
          </button>
        </div>

        {/* Export CSV */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCsv(table.getFilteredRowModel().rows.map(r => r.original))}
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
}
