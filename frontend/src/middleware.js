import { NextResponse } from 'next/server';
import { AUTH_TOKEN_KEY, ADMIN_ROLES } from '@/utils/constants';
import { decodeJwtPayload } from '@/utils/jwt';
import { isPublicAdminPath } from '@/utils/admin-routes';
import { isPublicAuthPath } from '@/utils/auth-routes';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  const payload = token ? decodeJwtPayload(token) : null;

  if (isPublicAuthPath(pathname)) {
    if (payload && !ADMIN_ROLES.includes(payload.role)) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/profile' || pathname.startsWith('/profile/')) {
    if (!token || !payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isPublicAdminPath(pathname)) {
    if (pathname === '/admin/login' && payload && ADMIN_ROLES.includes(payload.role)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!token || !payload) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (!ADMIN_ROLES.includes(payload.role)) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete(AUTH_TOKEN_KEY);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/register',
    '/profile',
    '/profile/:path*',
  ],
};
