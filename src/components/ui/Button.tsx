import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'danger' | 'success' | 'warning' | 'outline';
type Size = 'xs' | 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  icon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20',
  ghost: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300',
  success: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300',
  warning: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300',
  outline: 'bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white',
};

const sizeClasses: Record<Size, string> = {
  xs: 'px-2 py-1 text-xs gap-1',
  sm: 'px-2.5 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
};

export function Button({ variant = 'ghost', size = 'sm', children, icon, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-150 cursor-pointer select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
