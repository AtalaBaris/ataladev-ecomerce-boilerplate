import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center">
      <p className="text-6xl font-bold text-emerald-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-zinc-100">Sayfa bulunamadı</h1>
      <p className="mt-2 text-zinc-400">
        Aradığınız sayfa taşınmış veya silinmiş olabilir.
      </p>
      <Link href="/" className="mt-8">
        <Button>Ana Sayfaya Dön</Button>
      </Link>
    </div>
  );
}
