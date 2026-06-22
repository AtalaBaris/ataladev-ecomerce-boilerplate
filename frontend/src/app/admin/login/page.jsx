import { LoginForm } from './components/LoginForm';

export const metadata = {
  title: 'Admin Giriş | Atala E-Commerce',
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-bold text-white shadow-lg shadow-emerald-600/20">
            A
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Atala Admin
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Yönetim paneline erişmek için giriş yapın
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-sm">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Atala E-Commerce. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
