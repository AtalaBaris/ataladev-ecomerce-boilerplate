import { cn } from '@/utils/cn';

/**
 * @param {import('react').ButtonHTMLAttributes<HTMLButtonElement> & {
 *   variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
 *   size?: 'sm' | 'md' | 'lg';
 *   isLoading?: boolean;
 * }} props
 */
export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...props
}) {
  const variants = {
    primary:
      'bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-500',
    secondary:
      'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700',
    ghost: 'bg-transparent text-zinc-300 hover:bg-zinc-800',
    danger: 'bg-red-600 text-white hover:bg-red-500',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Yükleniyor...
        </>
      ) : (
        children
      )}
    </button>
  );
}
