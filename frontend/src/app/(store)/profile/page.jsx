'use client';

import Link from 'next/link';
import useAuthStore from '@/store/useAuthStore';
import { useCustomerAuth } from '../login/hooks/useCustomerAuth';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useCustomerAuth();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
        <h1 className="text-2xl font-bold text-zinc-100">Hesabım</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Profil bilgileriniz ve sipariş geçmişiniz
        </p>

        <dl className="mt-8 space-y-4">
          <div>
            <dt className="text-sm text-zinc-500">Ad Soyad</dt>
            <dd className="mt-1 text-zinc-100">{user?.name || '—'}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">E-posta</dt>
            <dd className="mt-1 text-zinc-100">{user?.email || '—'}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/profile/orders"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white"
          >
            Siparişlerim
          </Link>
          <Button variant="ghost" size="sm" onClick={logout}>
            Çıkış Yap
          </Button>
        </div>
      </div>
    </div>
  );
}
