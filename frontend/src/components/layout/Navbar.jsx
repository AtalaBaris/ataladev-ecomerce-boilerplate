import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-emerald-400">
          Atala
        </Link>
        <nav className="flex items-center gap-6 text-sm text-zinc-300">
          <Link href="/products" className="hover:text-white">
            Ürünler
          </Link>
          <Link href="/cart" className="hover:text-white">
            Sepet
          </Link>
          <Link href="/profile" className="hover:text-white">
            Hesabım
          </Link>
        </nav>
      </div>
    </header>
  );
}
