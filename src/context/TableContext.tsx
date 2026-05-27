import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { INITIAL_DATA } from '../data/generateData';
import type { Employee } from '../types';

interface TableState {
  rows: Employee[];
  editingRowId: string | null;
  editDraft: Partial<Employee>;
  originalRows: Record<string, Employee>;
  dirtyRowIds: Set<string>;
}

type Action =
  | { type: 'START_EDIT'; rowId: string }
  | { type: 'UPDATE_DRAFT'; field: keyof Employee; value: string | number }
  | { type: 'SAVE_ROW' }
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
        editDraft: { ...row },
        originalRows: state.originalRows[action.rowId]
          ? state.originalRows
          : { ...state.originalRows, [action.rowId]: row },
      };
    }

    case 'UPDATE_DRAFT': {
      return {
        ...state,
        editDraft: { ...state.editDraft, [action.field]: action.value },
      };
    }

    case 'SAVE_ROW': {
      if (!state.editingRowId) return state;
      const updatedRows = state.rows.map(r =>
        r.id === state.editingRowId ? { ...r, ...state.editDraft } : r
      );
      const newDirty = new Set(state.dirtyRowIds);
      const original = state.originalRows[state.editingRowId];
      const saved = updatedRows.find(r => r.id === state.editingRowId)!;
      if (original && JSON.stringify(original) !== JSON.stringify(saved)) {
        newDirty.add(state.editingRowId);
      } else {
        newDirty.delete(state.editingRowId);
      }
      return {
        ...state,
        rows: updatedRows,
        editingRowId: null,
        editDraft: {},
        dirtyRowIds: newDirty,
      };
    }

    case 'CANCEL_EDIT': {
      return { ...state, editingRowId: null, editDraft: {} };
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
        editDraft: state.editingRowId === action.rowId ? {} : state.editDraft,
      };
    }

    default:
      return state;
  }
}

interface TableContextValue {
  rows: Employee[];
  editingRowId: string | null;
  editDraft: Partial<Employee>;
  dirtyRowIds: Set<string>;
  originalRows: Record<string, Employee>;
  startEdit: (rowId: string) => void;
  updateDraft: (field: keyof Employee, value: string | number) => void;
  saveRow: () => void;
  cancelEdit: () => void;
  undoRow: (rowId: string) => void;
}

const TableContext = createContext<TableContextValue | null>(null);

export function TableProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    rows: INITIAL_DATA,
    editingRowId: null,
    editDraft: {},
    originalRows: {},
    dirtyRowIds: new Set<string>(),
  });

  const startEdit = useCallback((rowId: string) => dispatch({ type: 'START_EDIT', rowId }), []);
  const updateDraft = useCallback((field: keyof Employee, value: string | number) =>
    dispatch({ type: 'UPDATE_DRAFT', field, value }), []);
  const saveRow = useCallback(() => dispatch({ type: 'SAVE_ROW' }), []);
  const cancelEdit = useCallback(() => dispatch({ type: 'CANCEL_EDIT' }), []);
  const undoRow = useCallback((rowId: string) => dispatch({ type: 'UNDO_ROW', rowId }), []);

  const value = useMemo(() => ({
    rows: state.rows,
    editingRowId: state.editingRowId,
    editDraft: state.editDraft,
    dirtyRowIds: state.dirtyRowIds,
    originalRows: state.originalRows,
    startEdit,
    updateDraft,
    saveRow,
    cancelEdit,
    undoRow,
  }), [state, startEdit, updateDraft, saveRow, cancelEdit, undoRow]);

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

export function useTableContext() {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTableContext must be used inside TableProvider');
  return ctx;
}
