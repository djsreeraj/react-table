import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export function Input({ label, icon, className = '', ...props }: InputProps) {
  return (
    <div className="relative flex flex-col gap-1">
      {label && (
        <label className="text-xs text-slate-400 font-medium">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`
            w-full bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm
            placeholder:text-slate-500
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40
            transition-all duration-150
            ${icon ? 'pl-8 pr-3 py-1.5' : 'px-3 py-1.5'}
            ${className}
          `}
        />
      </div>
    </div>
  );
}
