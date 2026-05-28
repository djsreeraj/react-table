import { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Table } from '@tanstack/react-table';
import type { Employee } from '../../types';
import { useTableContext } from '../../context/TableContext';
import { useConfirm } from '../../hooks/useConfirm';
import { EditableRow } from './EditableRow';
import { ROW_HEIGHT } from './constants';

interface VirtualTableBodyProps {
  table: Table<Employee>;
}

export function VirtualTableBody({ table }: VirtualTableBodyProps) {
  const { editingRowId, dirtyRowIds, startEdit, saveRow, cancelEdit, undoRow } = useTableContext();
  const { confirm, dialog } = useConfirm();
  const draftDirtyRef = useRef(false);

  const handleStartEdit = useCallback(async (rowId: string) => {
    if (editingRowId && editingRowId !== rowId && draftDirtyRef.current) {
      const ok = await confirm('Any changes you made will be lost.', 'Discard changes?');
      if (!ok) return;
    }
    draftDirtyRef.current = false;
    startEdit(rowId);
  }, [editingRowId, startEdit, confirm]);

  const onDraftChange = useCallback((dirty: boolean) => {
    draftDirtyRef.current = dirty;
  }, []);

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
    <>
      {dialog}
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
                startEdit={handleStartEdit}
                saveRow={saveRow}
                cancelEdit={cancelEdit}
                undoRow={undoRow}
                onDraftChange={editingRowId === row.original.id ? onDraftChange : undefined}
                requestConfirm={editingRowId === row.original.id ? confirm : undefined}
              />
            );
          })}
          {paddingBottom > 0 && <div style={{ height: paddingBottom }} />}
        </div>
      </div>
    </>
  );
}
