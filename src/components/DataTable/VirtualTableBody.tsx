import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Table } from '@tanstack/react-table';
import type { Employee } from '../../types';
import { useTableContext } from '../../context/TableContext';
import { EditableRow } from './EditableRow';
import { ROW_HEIGHT } from './constants';

interface VirtualTableBodyProps {
  table: Table<Employee>;
}

export function VirtualTableBody({ table }: VirtualTableBodyProps) {
  const { editingRowId, dirtyRowIds, startEdit, saveRow, cancelEdit, undoRow } = useTableContext();
  const rows = table.getSortedRowModel().rows;
  const containerRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  });

  const totalHeight = virtualizer.getTotalSize();
  const virtualItems = virtualizer.getVirtualItems();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0 ? totalHeight - virtualItems[virtualItems.length - 1].end : 0;

  return (
    <div
      ref={containerRef}
      className="overflow-auto flex-1 min-h-0"
      style={{ height: '100%' }}
      role="rowgroup"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {paddingTop > 0 && <div style={{ height: paddingTop }} />}
        {virtualItems.map(virtualRow => {
          const row = rows[virtualRow.index];
          return (
            <EditableRow
              key={row.id}
              row={row}
              style={{ height: ROW_HEIGHT }}
              isEditing={editingRowId === row.original.id}
              isDirty={dirtyRowIds.has(row.original.id)}
              startEdit={startEdit}
              saveRow={saveRow}
              cancelEdit={cancelEdit}
              undoRow={undoRow}
            />
          );
        })}
        {paddingBottom > 0 && <div style={{ height: paddingBottom }} />}
      </div>
    </div>
  );
}
