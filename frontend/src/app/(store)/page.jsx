import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
        Atala E-Commerce
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
        Doğal ürünler, hızlı teslimat ve güvenli alışveriş deneyimi.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/products">
          <Button>Ürünleri Keşfet</Button>
        </Link>
        <Link href="/about">
          <Button variant="secondary">Hakkımızda</Button>
        </Link>
      </div>
    </section>
  );
}
