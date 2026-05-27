export type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave' | 'Remote';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  age: number;
  status: EmployeeStatus;
  startDate: string;
  performance: number;
}

export type SortDirection = 'asc' | 'desc' | false;

export interface ColumnFilter {
  id: string;
  value: string;
}

export interface EditState {
  [rowId: string]: Partial<Employee>;
}

export interface OriginalState {
  [rowId: string]: Employee;
}
