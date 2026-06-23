export const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
];

/**
 * Public admin rotalarını tam eşleşme ile kontrol eder.
 * `/admin/login-logs` gibi path'lerin `/admin/login` ile karışmasını önler.
 * @param {string} pathname
 */
export function isPublicAdminPath(pathname) {
  return PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
