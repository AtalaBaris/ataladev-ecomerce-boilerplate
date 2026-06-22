'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth.service';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (!token) {
      setError('Geçersiz sıfırlama bağlantısı.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, password);
      router.push('/admin/login');
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          'Şifre güncellenemedi. Bağlantı süresi dolmuş olabilir.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <Input
        label="Yeni şifre"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Input
        label="Yeni şifre (tekrar)"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Şifreyi Güncelle
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
        <h1 className="text-xl font-bold text-white">Yeni Şifre Belirle</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Yeni admin şifrenizi girin.
        </p>

        <div className="mt-6">
          <Suspense fallback={<p className="text-zinc-400">Yükleniyor...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="mt-4 text-center text-sm">
          <Link href="/admin/login" className="text-emerald-400 hover:text-emerald-300">
            Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </div>
  );
}
