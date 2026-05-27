import type { Employee, EmployeeStatus } from '../types';

const firstNames = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Dorothy', 'Paul', 'Kimberly', 'Andrew', 'Emily', 'Joshua', 'Donna',
  'Kenneth', 'Michelle', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Edward', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
];

const departments = [
  'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
  'Finance', 'HR', 'Legal', 'Operations', 'Customer Success',
];

const rolesByDept: Record<string, string[]> = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'Staff Engineer', 'Engineering Manager', 'DevOps Engineer', 'QA Engineer'],
  Product: ['Product Manager', 'Senior PM', 'Director of Product', 'Product Analyst'],
  Design: ['UI Designer', 'UX Designer', 'Product Designer', 'Design Lead'],
  Marketing: ['Marketing Manager', 'Content Strategist', 'SEO Specialist', 'Brand Manager'],
  Sales: ['Account Executive', 'Sales Manager', 'BDR', 'VP of Sales'],
  Finance: ['Financial Analyst', 'Accountant', 'CFO', 'Controller'],
  HR: ['HR Manager', 'Recruiter', 'People Ops', 'HR Director'],
  Legal: ['Legal Counsel', 'Compliance Officer', 'Paralegal'],
  Operations: ['Operations Manager', 'Logistics Coordinator', 'Project Manager'],
  'Customer Success': ['CSM', 'Support Engineer', 'Customer Success Director'],
};

const statuses: EmployeeStatus[] = ['Active', 'Active', 'Active', 'Remote', 'On Leave', 'Inactive'];

const salariesByRole: Record<string, [number, number]> = {
  'Software Engineer': [85000, 130000],
  'Senior Engineer': [120000, 180000],
  'Staff Engineer': [160000, 220000],
  'Engineering Manager': [140000, 200000],
  'DevOps Engineer': [90000, 140000],
  'QA Engineer': [75000, 110000],
  'Product Manager': [100000, 160000],
  'Senior PM': [130000, 190000],
  'Director of Product': [160000, 230000],
  'Product Analyst': [80000, 120000],
  'UI Designer': [75000, 115000],
  'UX Designer': [80000, 120000],
  'Product Designer': [85000, 130000],
  'Design Lead': [110000, 160000],
  'Marketing Manager': [80000, 130000],
  'Content Strategist': [60000, 95000],
  'SEO Specialist': [55000, 90000],
  'Brand Manager': [75000, 120000],
  'Account Executive': [70000, 140000],
  'Sales Manager': [90000, 160000],
  'BDR': [50000, 80000],
  'VP of Sales': [150000, 250000],
  'Financial Analyst': [70000, 110000],
  'Accountant': [60000, 100000],
  'CFO': [180000, 300000],
  'Controller': [100000, 160000],
  'HR Manager': [75000, 120000],
  'Recruiter': [60000, 95000],
  'People Ops': [65000, 100000],
  'HR Director': [110000, 170000],
  'Legal Counsel': [120000, 200000],
  'Compliance Officer': [90000, 140000],
  'Paralegal': [55000, 85000],
  'Operations Manager': [80000, 130000],
  'Logistics Coordinator': [55000, 85000],
  'Project Manager': [80000, 130000],
  'CSM': [70000, 110000],
  'Support Engineer': [65000, 100000],
  'Customer Success Director': [110000, 170000],
};

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateEmployees(count = 10000): Employee[] {
  const employees: Employee[] = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    const dept = pick(departments);
    const role = pick(rolesByDept[dept]);
    const [salMin, salMax] = salariesByRole[role] ?? [50000, 100000];
    const salary = Math.round(rand(salMin, salMax) / 1000) * 1000;

    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
    if (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`;
    }
    usedEmails.add(email);

    const startYear = rand(2010, 2024);
    const startMonth = rand(1, 12);
    const startDay = rand(1, 28);
    const startDate = formatDate(new Date(startYear, startMonth - 1, startDay));

    employees.push({
      id: `emp-${String(i + 1).padStart(5, '0')}`,
      name: `${firstName} ${lastName}`,
      email,
      department: dept,
      role,
      salary,
      age: rand(22, 62),
      status: pick(statuses),
      startDate,
      performance: rand(1, 100),
    });
  }

  return employees;
}

export const INITIAL_DATA = generateEmployees(10000);
