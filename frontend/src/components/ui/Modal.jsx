'use client';

import { useClickOutside } from '@/hooks/useClickOutside';
import { cn } from '@/utils/cn';

export function Modal({ isOpen, onClose, title, children, className }) {
  const ref = useClickOutside(onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        ref={ref}
        className={cn(
          'w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl',
          className,
        )}
      >
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
