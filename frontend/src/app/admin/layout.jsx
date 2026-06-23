'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminSessionProvider } from '@/components/providers/AdminSessionProvider';
import { isPublicAdminPath } from '@/utils/admin-routes';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isPublicPage = isPublicAdminPath(pathname);

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
