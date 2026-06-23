export const PUBLIC_AUTH_PATHS = ['/login', '/register'];

/**
 * @param {string} pathname
 */
export function isPublicAuthPath(pathname) {
  return PUBLIC_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/**
 * @param {string} url
 */
export function isPublicAuthRequest(url = '') {
  return (
    url.includes('/api/auth/login') ||
    url.includes('/api/auth/register') ||
    url.includes('/admin/login') ||
    url.includes('/admin/forgot-password') ||
    url.includes('/admin/reset-password')
  );
}
