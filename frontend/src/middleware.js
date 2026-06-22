import { NextResponse } from 'next/server';
import { AUTH_TOKEN_KEY } from '@/utils/constants';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
