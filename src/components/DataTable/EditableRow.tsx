import { memo } from 'react';
import type { Row } from '@tanstack/react-table';
import type { Employee, EmployeeStatus } from '../../types';
import { useTableContext } from '../../context/TableContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { GRID_COLS } from './constants';

const DEPARTMENTS = ['Engineering','Product','Design','Marketing','Sales','Finance','HR','Legal','Operations','Customer Success'];
const STATUSES: EmployeeStatus[] = ['Active', 'Inactive', 'On Leave', 'Remote'];

interface EditableRowProps {
  row: Row<Employee>;
  style?: React.CSSProperties;
}

function PerformanceBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-emerald-500' : value >= 50 ? 'bg-indigo-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-slate-700/80 rounded-full overflow-hidden min-w-0">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs tabular-nums text-slate-400 w-5 text-right shrink-0">{value}</span>
    </div>
  );
}

function EditableCell({
  type, field, value, options,
}: {
  type: 'text' | 'number' | 'select' | 'date';
  field: keyof Employee;
  value: string | number;
  options?: string[];
}) {
  const { updateDraft } = useTableContext();

  const base = `
    bg-slate-700/60 border border-slate-600/80 rounded-md text-slate-100 text-xs
    px-2 py-1 w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40
    transition-all duration-150
  `;

  if (type === 'select' && options) {
    return (
      <select
        value={value}
        onChange={e => updateDraft(field, e.target.value)}
        className={`${base} bg-slate-700`}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }

  return (
    <input
      type={type}
      value={value}
      min={type === 'number' ? 0 : undefined}
      onChange={e => updateDraft(field, type === 'number' ? Number(e.target.value) : e.target.value)}
      className={base}
    />
  );
}

export const EditableRow = memo(function EditableRow({ row, style }: EditableRowProps) {
  const { editingRowId, editDraft, dirtyRowIds, startEdit, saveRow, cancelEdit, undoRow } = useTableContext();
  const isEditing = editingRowId === row.original.id;
  const isDirty = dirtyRowIds.has(row.original.id);
  const data: Employee = isEditing ? { ...row.original, ...editDraft } as Employee : row.original;

  return (
    <div
      style={style}
      role="row"
      onDoubleClick={() => { if (!isEditing) startEdit(row.original.id); }}
      onKeyDown={e => {
        if (isEditing && e.key === 'Enter') { e.preventDefault(); saveRow(); }
        if (isEditing && e.key === 'Escape') cancelEdit();
      }}
      className={`
        grid ${GRID_COLS} items-center
        border-b border-slate-800/60 text-sm overflow-hidden
        transition-colors duration-150 group
        ${isEditing
          ? 'bg-indigo-950/40 border-l-2 border-l-indigo-500'
          : isDirty
          ? 'bg-amber-950/20 border-l-2 border-l-amber-500 hover:bg-slate-800/30 cursor-pointer'
          : 'hover:bg-slate-800/30 border-l-2 border-l-transparent cursor-pointer'
        }
      `}
    >
      {/* # */}
      <div className="pl-3 pr-1 text-slate-600 text-xs font-mono tabular-nums text-right">
        {row.index + 1}
      </div>

      {/* Name */}
      <div className="px-3 overflow-hidden">
        {isEditing ? (
          <EditableCell type="text" field="name" value={data.name} />
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex items-center gap-1.5">
              <span className="text-slate-200 text-sm font-medium truncate">{data.name}</span>
              {isDirty && <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved changes" />}
            </div>
          </div>
        )}
      </div>

      {/* Email */}
      <div className="px-3 overflow-hidden">
        {isEditing ? (
          <EditableCell type="text" field="email" value={data.email} />
        ) : (
          <span className="text-slate-500 text-xs truncate block">{data.email}</span>
        )}
      </div>

      {/* Department */}
      <div className="px-3 overflow-hidden">
        {isEditing ? (
          <EditableCell type="select" field="department" value={data.department} options={DEPARTMENTS} />
        ) : (
          <span className="text-slate-400 text-xs truncate block">{data.department}</span>
        )}
      </div>

      {/* Role */}
      <div className="px-3 overflow-hidden">
        {isEditing ? (
          <EditableCell type="text" field="role" value={data.role} />
        ) : (
          <span className="text-slate-300 text-xs truncate block">{data.role}</span>
        )}
      </div>

      {/* Salary */}
      <div className="px-3 overflow-hidden">
        {isEditing ? (
          <EditableCell type="number" field="salary" value={data.salary} />
        ) : (
          <span className="text-slate-200 font-mono text-xs tabular-nums block text-right">
            ${data.salary.toLocaleString()}
          </span>
        )}
      </div>

      {/* Age */}
      <div className="px-1 overflow-hidden">
        {isEditing ? (
          <EditableCell type="number" field="age" value={data.age} />
        ) : (
          <span className="text-slate-400 text-xs tabular-nums block text-center">{data.age}</span>
        )}
      </div>

      {/* Status */}
      <div className="px-3 overflow-hidden">
        {isEditing ? (
          <EditableCell type="select" field="status" value={data.status} options={STATUSES} />
        ) : (
          <Badge status={data.status} />
        )}
      </div>

      {/* Start Date */}
      <div className="px-3 overflow-hidden">
        {isEditing ? (
          <EditableCell type="date" field="startDate" value={data.startDate} />
        ) : (
          <span className="text-slate-400 text-xs tabular-nums block text-center">{data.startDate}</span>
        )}
      </div>

      {/* Performance */}
      <div className="px-3 overflow-hidden">
        {isEditing ? (
          <EditableCell type="number" field="performance" value={data.performance} />
        ) : (
          <PerformanceBar value={data.performance} />
        )}
      </div>

      {/* Actions */}
      <div className="px-2 flex items-center gap-1 justify-center">
        {isEditing ? (
          <>
            <Button variant="success" size="xs" onClick={saveRow} title="Save (Enter)">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Save
            </Button>
            <Button variant="danger" size="xs" onClick={cancelEdit} title="Cancel (Esc)">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => startEdit(row.original.id)}
              title="Edit row (or double-click)"
              className="opacity-0 group-hover:opacity-100"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            {isDirty && (
              <Button variant="warning" size="xs" onClick={() => undoRow(row.original.id)} title="Undo changes">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
});
