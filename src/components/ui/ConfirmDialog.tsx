interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title = 'Unsaved changes',
  message,
  confirmLabel = 'Discard changes',
  cancelLabel = 'Keep editing',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseDown={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in">

        {/* Top accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500" />

        <div className="p-6">
          {/* Icon + title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="shrink-0 w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-slate-100 font-semibold text-base leading-tight">{title}</h3>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">{message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end mt-6">
            <button
              autoFocus
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 bg-transparent transition-all duration-150 cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 transition-all duration-150 cursor-pointer"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
