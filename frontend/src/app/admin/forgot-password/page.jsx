'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authService.forgotPassword(email);
      setMessage(
        response.data?.message ||
          'E-posta kayıtlıysa şifre sıfırlama bağlantısı gönderildi.',
      );
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          'İstek gönderilemedi. Lütfen tekrar deneyin.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
        <h1 className="text-xl font-bold text-white">Şifremi Unuttum</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Admin e-posta adresinize sıfırlama bağlantısı gönderilir.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {message}
            </div>
          )}

          <Input
            label="E-posta"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Bağlantı Gönder
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link href="/admin/login" className="text-emerald-400 hover:text-emerald-300">
            Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </div>
  );
}
