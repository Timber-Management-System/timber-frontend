import { NextResponse, type NextRequest } from 'next/server';

import { isPublicPath, SESSION_COOKIE } from '@/shared/lib/auth/session';

/**
 * FR-01 route protection (Next.js 16 "proxy", formerly middleware).
 * Only checks that a session cookie exists - fast, before the page loads. The real checks
 * (is the session valid, may this role open the page) happen in the backend and in RouteGuard.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = request.cookies.has(SESSION_COOKIE);

  if (!signedIn && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = pathname === '/' ? '' : `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (signedIn && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next.js internals and static files.
  matcher: [
    '/((?!_next/|favicon.ico|icons/|images/|fonts/|sw.js|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|svg|webp|ico|woff2?)$).*)',
  ],
};
