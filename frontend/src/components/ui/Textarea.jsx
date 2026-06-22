import { cn } from '@/utils/cn';

export function Textarea({ className, label, error, id, ...props }) {
  const textareaId = id || props.name;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-zinc-300"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'flex min-h-28 w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20',
          error && 'border-red-500',
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
