import type { PermissionSet } from './permissions';
import type { RoleKey } from './roles';

/** The signed-in user, as returned by the backend's "current user" endpoint (FR-01). */
export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: RoleKey;
  siteTeam: string;
  /** Effective permissions for this user (from their role). */
  permissions: PermissionSet;
  mfaEnabled: boolean;
  /** Must change the temporary password before using the app (FR-02 "force password change"). */
  mustChangePassword?: boolean;
}

/** Name of the session cookie. The backend sets it; in mock mode the frontend does. */
export const SESSION_COOKIE = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'tms_session';

/** Minutes of inactivity before the user is signed out (S-13.13 Session timeout). */
export const SESSION_TIMEOUT_MINUTES = Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES || 30);

/** Pages that can be opened without signing in. Everything else redirects to /login. */
export const PUBLIC_PATHS = ['/login', '/forgot-password', '/reset-password', '/mfa', '/contact', '/api/health'];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function initialsOf(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
