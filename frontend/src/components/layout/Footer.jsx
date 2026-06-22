import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Atala E-Commerce</p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-zinc-200">
            Hakkımızda
          </Link>
          <Link href="/contact" className="hover:text-zinc-200">
            İletişim
          </Link>
        </div>
      </div>
    </footer>
  );
}
