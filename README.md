# Advanced Editable Data Table

A high-performance, feature-rich editable data table built with React 19, TypeScript, TanStack Table, and Tailwind CSS v4. Handles 10,000+ rows with virtual scrolling, inline editing, multi-column sorting, filtering, CSV export, and unsaved-change tracking.

---

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in terminal).

```bash
npm run build   # production build
```

---

## Features

### Editable Table
- Click any row's edit icon (appears on hover) to enter inline edit mode
- Editable fields: Name, Email, Role (text) · Salary, Age, Performance (number) · Department, Status (select) · Start Date (date)
- Per-row **Save** / **Cancel** / **Undo** actions
- Rows with unsaved changes are highlighted in amber with a persistent "Undo" button

### Large Dataset Performance
- **Virtual scroll mode** (default) — renders only the rows visible in the viewport using `@tanstack/react-virtual`. All 10,000 rows are accessible with no pagination cutoff; the virtualizer uses `getSortedRowModel()` so sorting and filtering both take effect across the full dataset before virtualization.
- **Paginated mode** — toggle in the toolbar for a traditional page-based view (25 / 50 / 100 / 200 rows per page)

### Sorting & Filtering
- Click any column header to sort ascending → descending → off; multiple columns can be sorted in sequence
- Per-column filter row (toggle with the Filters button): text match for Name / Email / Role, dropdown for Department / Status, numeric range for Salary / Age / Performance, date for Start Date
- Global search bar searches across Name, Email, Department, Role, and Status simultaneously
- **Clear** button resets all active filters at once

### Bonus Features
- **Export CSV** — exports the current filtered/sorted dataset (not just the visible page)
- **Unsaved changes tracking** — a pulsing amber badge in the toolbar counts dirty rows; navigating away triggers the browser's native `beforeunload` prompt
- **Context API state management** — all table data, edit state, draft values, dirty tracking, and undo history live in `TableContext` via `useReducer`

---

## Approach & Decisions

| Decision | Rationale |
|---|---|
| `@tanstack/react-table` for table logic | Headless, zero-opinion; keeps all rendering in our control while providing sorting, filtering, and pagination out of the box |
| `@tanstack/react-virtual` for virtualisation | Same ecosystem, very small bundle; `useVirtualizer` with `estimateSize` and `overscan` provides smooth scrolling at 10k rows |
| Virtual body uses `getSortedRowModel()` | TanStack's row model pipeline is Core → Filter → Sort → Pagination. Using `getRowModel()` would return only the current page (50 rows). `getSortedRowModel()` gives all post-filter/post-sort rows so the virtualizer sees the full dataset |
| Context + `useReducer` over Redux | The task is self-contained; a typed reducer gives the same predictability as Redux without the boilerplate overhead |
| Tailwind CSS v4 with dark theme | Utility-first keeps styling co-located with markup; dark theme avoids the contrast problems common in data-heavy UIs |
| Inline editing at row level (not cell level) | Committing changes per-row (not per-keystroke) means a single Save/Cancel/Undo action covers the whole row, which is clearer for the user and simpler to implement correctly |
| Avatar initials from name | Avoids any external avatar dependency; deterministic and visually distinguishes rows without adding weight |

---

## File Structure

```
src/
├── types/index.ts                 # Shared TypeScript types
├── data/generateData.ts           # Deterministic 10,000-row mock data generator
├── context/TableContext.tsx       # Context + useReducer state management
├── hooks/useUnsavedChanges.ts     # beforeunload guard hook
├── utils/exportCsv.ts             # CSV serialiser + download trigger
└── components/
    ├── DataTable/
    │   ├── DataTable.tsx          # Table setup, TanStack Table instance, view-mode switch
    │   ├── TableToolbar.tsx       # Search, export, filters toggle, view toggle, dirty badge
    │   ├── TableFilters.tsx       # Per-column filter input row
    │   ├── TableHeader.tsx        # Sticky sortable column headers
    │   ├── VirtualTableBody.tsx   # react-virtual powered scrollable body
    │   ├── PaginatedTableBody.tsx # Classic paginated body (fallback)
    │   ├── EditableRow.tsx        # Row component with inline edit/save/cancel/undo
    │   └── TablePagination.tsx    # Page controls and row-count selector
    └── ui/
        ├── Button.tsx             # Variant-based button (primary/ghost/danger/success/warning/outline)
        ├── Input.tsx              # Labelled input with optional leading icon
        └── Badge.tsx              # Status badge (Active / Inactive / On Leave / Remote)
```

---

## Known Limitations

- **No server-side data** — the 10,000-row dataset is generated in memory on page load. A real app would paginate or stream from an API.
- **No persistence** — edits live in React state; a hard refresh resets everything. Connecting to a backend or `localStorage` is straightforward from `TableContext`.
- **Global search is client-side** — scanning all 10,000 rows on every keystroke is fine here because filtering happens via TanStack's memoisation, but at 100k+ rows a debounce or server-side search would be needed.
- **Date filter is exact-match** — the Start Date filter matches the full ISO string. A date-range picker would be a natural next step.
- **No row selection / bulk actions** — checkbox selection and bulk edit/delete were out of scope for this task.
