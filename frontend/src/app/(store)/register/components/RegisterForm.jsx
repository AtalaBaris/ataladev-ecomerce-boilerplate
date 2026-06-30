'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCustomerAuth } from '../../login/hooks/useCustomerAuth';

export function RegisterForm() {
  const { register, isLoading, error } = useCustomerAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Şifreler eşleşmiyor.');
      return;
    }

    if (password.length < 8) {
      setValidationError('Şifre en az 8 karakter olmalıdır.');
      return;
    }

    try {
      await register({ email, password, firstName, lastName });
    } catch {
      // Hata hook içinde yönetiliyor
    }
  };

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {displayError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {displayError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Ad"
          name="firstName"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          label="Soyad"
          name="lastName"
          autoComplete="family-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

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
        autoComplete="new-password"
        placeholder="En az 8 karakter"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Input
        label="Şifre Tekrar"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="Şifrenizi tekrar girin"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Kayıt Ol
      </Button>

      <p className="text-center text-sm text-zinc-400">
        Zaten hesabınız var mı?{' '}
        <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
          Giriş yapın
        </Link>
      </p>
    </form>
  );
}
