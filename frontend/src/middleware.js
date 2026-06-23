import { NextResponse } from 'next/server';
import { AUTH_TOKEN_KEY, ADMIN_ROLES } from '@/utils/constants';
import { decodeJwtPayload } from '@/utils/jwt';
import { isPublicAdminPath } from '@/utils/admin-routes';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  const isPublicAdminRoute = isPublicAdminPath(pathname);

  if (isPublicAdminRoute) {
    if (pathname === '/admin/login' && token) {
      const payload = decodeJwtPayload(token);
      if (payload && ADMIN_ROLES.includes(payload.role)) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = decodeJwtPayload(token);
    if (!payload || !ADMIN_ROLES.includes(payload.role)) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete(AUTH_TOKEN_KEY);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
