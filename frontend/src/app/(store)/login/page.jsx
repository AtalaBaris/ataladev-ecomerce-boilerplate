import { Suspense } from 'react';
import { LoginForm } from './components/LoginForm';
import { PageLoader } from '@/components/ui/PageLoader';

export const metadata = {
  title: 'Giriş Yap | Atala',
};

export default function CustomerLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-100">Giriş Yap</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Hesabınıza giriş yaparak siparişlerinizi takip edin
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
          <Suspense fallback={<PageLoader />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
