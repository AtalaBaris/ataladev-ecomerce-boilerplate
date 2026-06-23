'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await authService.logout();
    useAuthStore.getState().logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-emerald-400">
          Atala
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-300 sm:gap-6">
          <Link href="/products" className="hover:text-white">
            Ürünler
          </Link>
          <Link href="/cart" className="hover:text-white">
            Sepet
          </Link>

          {isAuthenticated && !isAdmin ? (
            <>
              <Link
                href="/profile"
                className={pathname.startsWith('/profile') ? 'text-white' : 'hover:text-white'}
              >
                {user?.name || 'Hesabım'}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Çıkış
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={pathname === '/login' ? 'text-white' : 'hover:text-white'}
              >
                Giriş
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-500"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
