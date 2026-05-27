import type { Table } from '@tanstack/react-table';
import type { Employee } from '../../types';
import { EditableRow } from './EditableRow';

interface PaginatedTableBodyProps {
  table: Table<Employee>;
}

export function PaginatedTableBody({ table }: PaginatedTableBodyProps) {
  const rows = table.getPaginationRowModel().rows;

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">No results found</p>
        <p className="text-xs mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto flex-1 min-h-0" role="rowgroup">
      {rows.map(row => (
        <EditableRow key={row.id} row={row} />
      ))}
    </div>
  );
}
