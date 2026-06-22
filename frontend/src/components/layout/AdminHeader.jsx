'use client';

import { useAdminAuth } from '@/app/admin/login/hooks/useAdminAuth';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import useUiStore from '@/store/useUiStore';

export function AdminHeader() {
  const { logout } = useAdminAuth();
  const user = useAuthStore((state) => state.user);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      <button
        type="button"
        onClick={toggleSidebar}
        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
        aria-label="Menüyü aç/kapat"
      >
        ☰
      </button>

      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-400">{user?.email}</span>
        <Button variant="ghost" size="sm" onClick={logout}>
          Çıkış
        </Button>
      </div>
    </header>
  );
}
