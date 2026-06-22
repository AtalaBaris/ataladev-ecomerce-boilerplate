import { Spinner } from '@/components/ui/Spinner';

export function PageLoader({ label = 'Yükleniyor...' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}
