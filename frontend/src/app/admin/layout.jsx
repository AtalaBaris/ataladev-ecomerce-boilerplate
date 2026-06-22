'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminSessionProvider } from '@/components/providers/AdminSessionProvider';

const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path));

  if (isPublicPage) {
    return children;
  }

  return (
    <AdminSessionProvider>
      <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AdminSessionProvider>
  );
}
