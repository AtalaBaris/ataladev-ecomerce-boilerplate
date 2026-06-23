'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import useUiStore from '@/store/useUiStore';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Ürünler', icon: '📦' },
  { href: '/admin/orders', label: 'Siparişler', icon: '🛒' },
  { href: '/admin/login-logs', label: 'Giriş Logları', icon: '🔐' },
  { href: '/admin/settings', label: 'Ayarlar', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-20',
      )}
    >
      <div className="flex h-16 items-center border-b border-zinc-800 px-4">
        <span className="text-lg font-bold text-emerald-400">
          {isSidebarOpen ? 'Atala Admin' : 'A'}
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-600/15 text-emerald-400'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
              )}
            >
              <span>{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
