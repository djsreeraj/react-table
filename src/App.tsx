import { TableProvider } from './context/TableContext';
import { DataTable } from './components/DataTable/DataTable';

export default function App() {
  return (
    <TableProvider>
      <div className="min-h-screen bg-slate-950 p-4 md:p-6 lg:p-8">
        {/* Background gradient */}
        <div className="fixed inset-0 -z-10 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.06),transparent_50%)]" />
        </div>

        <div className="max-w-[1600px] mx-auto h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)]">
          <DataTable />
        </div>
      </div>
    </TableProvider>
  );
}
