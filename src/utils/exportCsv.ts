import type { Employee } from '../types';

const HEADERS: (keyof Employee)[] = [
  'id', 'name', 'email', 'department', 'role', 'salary', 'age', 'status', 'startDate', 'performance'
];

function escape(val: string | number): string {
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCsv(rows: Employee[], filename = 'employees.csv') {
  const header = HEADERS.join(',');
  const body = rows.map(row => HEADERS.map(h => escape(row[h])).join(',')).join('\n');
  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
