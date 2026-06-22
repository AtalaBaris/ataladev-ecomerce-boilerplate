import { cn } from '@/utils/cn';

/**
 * @param {import('react').InputHTMLAttributes<HTMLInputElement> & {
 *   label?: string;
 *   error?: string;
 * }} props
 */
export function Input({ className, label, error, id, ...props }) {
  const inputId = id || props.name;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-zinc-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'flex h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
