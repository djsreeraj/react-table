import { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { useTableContext } from '../../context/TableContext';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';
import type { Employee } from '../../types';
import { TableToolbar } from './TableToolbar';
import { TableFilters } from './TableFilters';
import { TableHeader } from './TableHeader';
import { VirtualTableBody } from './VirtualTableBody';
import { PaginatedTableBody } from './PaginatedTableBody';
import { TablePagination } from './TablePagination';

type ViewMode = 'virtual' | 'paginated';

const rangeFilter: FilterFn<Employee> = (row, columnId, filterValue: [number?, number?]) => {
  const val = row.getValue<number>(columnId);
  const [min, max] = filterValue;
  if (min !== undefined && val < min) return false;
  if (max !== undefined && val > max) return false;
  return true;
};

const globalFilterFn: FilterFn<Employee> = (row, _columnId, filterValue: string) => {
  const search = filterValue.toLowerCase();
  return (
    row.original.name.toLowerCase().includes(search) ||
    row.original.email.toLowerCase().includes(search) ||
    row.original.department.toLowerCase().includes(search) ||
    row.original.role.toLowerCase().includes(search) ||
    row.original.status.toLowerCase().includes(search)
  );
};

const columns: ColumnDef<Employee>[] = [
  { id: 'index', header: '#', enableSorting: false, enableColumnFilter: false, cell: () => null },
  { accessorKey: 'name', header: 'Name', filterFn: 'includesString' },
  { accessorKey: 'email', header: 'Email', filterFn: 'includesString' },
  { accessorKey: 'department', header: 'Department', filterFn: 'equals' },
  { accessorKey: 'role', header: 'Role', filterFn: 'includesString' },
  { accessorKey: 'salary', header: 'Salary', filterFn: rangeFilter },
  { accessorKey: 'age', header: 'Age', filterFn: rangeFilter },
  { accessorKey: 'status', header: 'Status', filterFn: 'equals' },
  { accessorKey: 'startDate', header: 'Start Date', filterFn: 'equalsString' },
  { accessorKey: 'performance', header: 'Performance', filterFn: rangeFilter },
  { id: 'actions', header: 'Actions', enableSorting: false, enableColumnFilter: false, cell: () => null },
];

export function DataTable() {
  const { rows, dirtyRowIds } = useTableContext();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('virtual');
  const [showFilters, setShowFilters] = useState(false);

  useUnsavedChanges(dirtyRowIds.size > 0);

  const data = useMemo(() => rows, [rows]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 50 } },
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl overflow-hidden ring-1 ring-slate-800 shadow-2xl shadow-black/40">
      <TableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {showFilters && <TableFilters table={table} />}

      <div className="flex flex-col flex-1 min-h-0" role="table" aria-label="Employee Directory">
        <TableHeader table={table} />

        {viewMode === 'virtual' ? (
          <VirtualTableBody table={table} />
        ) : (
          <PaginatedTableBody table={table} />
        )}
      </div>

      {viewMode === 'paginated' && <TablePagination table={table} />}

      {viewMode === 'virtual' && (
        <div className="px-4 py-2 border-t border-slate-800 flex items-center justify-between bg-slate-900/60">
          <span className="text-xs text-slate-600">
            Showing {table.getFilteredRowModel().rows.length.toLocaleString()} rows — virtual scroll active
          </span>
          <span className="text-xs text-slate-700 font-mono">
            {table.getState().sorting.length > 0 && `Sorted by ${table.getState().sorting.map(s => s.id).join(', ')}`}
          </span>
        </div>
      )}
    </div>
  );
}
