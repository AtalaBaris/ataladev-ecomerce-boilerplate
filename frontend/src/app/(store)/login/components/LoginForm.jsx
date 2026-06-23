'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCustomerAuth } from '../hooks/useCustomerAuth';

export function LoginForm() {
  const searchParams = useSearchParams();
  const { login, isLoading, error } = useCustomerAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectTo = (() => {
    const redirect = searchParams.get('redirect');
    return redirect && redirect.startsWith('/') ? redirect : '/profile';
  })();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password, redirectTo);
    } catch {
      // Hata hook içinde yönetiliyor
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <Input
        label="E-posta"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="ornek@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Şifre"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Giriş Yap
      </Button>

      <p className="text-center text-sm text-zinc-400">
        Hesabınız yok mu?{' '}
        <Link href="/register" className="text-emerald-400 hover:text-emerald-300">
          Kayıt olun
        </Link>
      </p>
    </form>
  );
}
