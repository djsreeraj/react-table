# React Editable Data Table

A data table built with React 19, TypeScript, TanStack Table, and Tailwind CSS. Supports 10,000+ rows with virtual scrolling, inline editing, sorting, filtering, and CSV export.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. For a production build: `npm run build`.

## Approach and Decisions

**TanStack Table** handles sorting, filtering, and pagination logic. It's headless — all the rendering is up to us, which kept things flexible without fighting an opinionated component library.

**Virtual scrolling** (`@tanstack/react-virtual`) renders only the rows visible on screen. The virtual body uses `getSortedRowModel()` instead of `getRowModel()` — this bypasses the pagination layer and gives the virtualizer access to all filtered/sorted rows, not just the current page.

**Context + useReducer** manages all table state (rows, edit state, dirty tracking, undo). It gives the same predictability as Redux without the extra setup for a self-contained app like this.

**Row-level editing** — edits are committed per row with a Save button, not per keystroke. This means one Save/Cancel/Undo action covers everything the user changed, which is easier to reason about.

**Local draft state** — the edit draft lives inside the row component, not in context. This prevents every row from re-rendering when the user types. Only the active row re-renders on keystrokes.

**Custom confirm dialog** — switching away from a dirty row or cancelling with unsaved changes shows a styled dialog instead of the browser's default `window.confirm`.

## Known Limitations

- **No backend** — data is generated in memory. A refresh resets all edits.
- **No persistence** — edits aren't saved to localStorage or a server. This would be a one-line change in `TableContext`.
- **Date filter is exact match** — the Start Date column filters by the full date string. A proper date-range picker would be more useful.
- **Global search is in-memory** — works fine at 10,000 rows, but would need server-side search for very large datasets.
