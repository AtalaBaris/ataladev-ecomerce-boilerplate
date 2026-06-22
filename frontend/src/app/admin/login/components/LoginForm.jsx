'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '../hooks/useAdminAuth';

export function LoginForm() {
  const { login, isLoading, error } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
    } catch {
      // Hata useAdminAuth içinde yönetiliyor
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
        placeholder="admin@atala.com"
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

      <p className="text-center text-sm">
        <a
          href="/admin/forgot-password"
          className="text-emerald-400 hover:text-emerald-300"
        >
          Şifremi unuttum
        </a>
      </p>
    </form>
  );
}
