import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { INITIAL_DATA } from '../data/generateData';
import type { Employee } from '../types';

interface TableState {
  rows: Employee[];
  editingRowId: string | null;
  originalRows: Record<string, Employee>;
  dirtyRowIds: Set<string>;
}

type Action =
  | { type: 'START_EDIT'; rowId: string }
  | { type: 'SAVE_ROW'; rowId: string; draft: Partial<Employee> }
  | { type: 'CANCEL_EDIT' }
  | { type: 'UNDO_ROW'; rowId: string };

function reducer(state: TableState, action: Action): TableState {
  switch (action.type) {
    case 'START_EDIT': {
      const row = state.rows.find(r => r.id === action.rowId);
      if (!row) return state;
      return {
        ...state,
        editingRowId: action.rowId,
        originalRows: state.originalRows[action.rowId]
          ? state.originalRows
          : { ...state.originalRows, [action.rowId]: row },
      };
    }

    case 'SAVE_ROW': {
      const updatedRows = state.rows.map(r =>
        r.id === action.rowId ? { ...r, ...action.draft } : r
      );
      const newDirty = new Set(state.dirtyRowIds);
      const original = state.originalRows[action.rowId];
      const saved = updatedRows.find(r => r.id === action.rowId)!;
      if (original && JSON.stringify(original) !== JSON.stringify(saved)) {
        newDirty.add(action.rowId);
      } else {
        newDirty.delete(action.rowId);
      }
      return {
        ...state,
        rows: updatedRows,
        editingRowId: null,
        dirtyRowIds: newDirty,
      };
    }

    case 'CANCEL_EDIT': {
      return { ...state, editingRowId: null };
    }

    case 'UNDO_ROW': {
      const original = state.originalRows[action.rowId];
      if (!original) return state;
      const newDirty = new Set(state.dirtyRowIds);
      newDirty.delete(action.rowId);
      const newOriginals = { ...state.originalRows };
      delete newOriginals[action.rowId];
      return {
        ...state,
        rows: state.rows.map(r => (r.id === action.rowId ? original : r)),
        dirtyRowIds: newDirty,
        originalRows: newOriginals,
        editingRowId: state.editingRowId === action.rowId ? null : state.editingRowId,
      };
    }

    default:
      return state;
  }
}

interface TableContextValue {
  rows: Employee[];
  editingRowId: string | null;
  dirtyRowIds: Set<string>;
  originalRows: Record<string, Employee>;
  startEdit: (rowId: string) => void;
  saveRow: (rowId: string, draft: Partial<Employee>) => void;
  cancelEdit: () => void;
  undoRow: (rowId: string) => void;
}

const TableContext = createContext<TableContextValue | null>(null);

export function TableProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    rows: INITIAL_DATA,
    editingRowId: null,
    originalRows: {},
    dirtyRowIds: new Set<string>(),
  });

  const startEdit = useCallback((rowId: string) => dispatch({ type: 'START_EDIT', rowId }), []);
  const saveRow = useCallback((rowId: string, draft: Partial<Employee>) =>
    dispatch({ type: 'SAVE_ROW', rowId, draft }), []);
  const cancelEdit = useCallback(() => dispatch({ type: 'CANCEL_EDIT' }), []);
  const undoRow = useCallback((rowId: string) => dispatch({ type: 'UNDO_ROW', rowId }), []);

  const value = useMemo(() => ({
    rows: state.rows,
    editingRowId: state.editingRowId,
    dirtyRowIds: state.dirtyRowIds,
    originalRows: state.originalRows,
    startEdit,
    saveRow,
    cancelEdit,
    undoRow,
  }), [state, startEdit, saveRow, cancelEdit, undoRow]);

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

export function useTableContext() {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTableContext must be used inside TableProvider');
  return ctx;
}
