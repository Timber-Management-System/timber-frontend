/**
 * FR-01 authentication calls. Mock mode (NEXT_PUBLIC_USE_MOCK_API=true) works without a backend;
 * see the demo accounts in src/shared/lib/mock/users.mock.ts.
 *
 * Real mode: the backend (useraccess/fr01_authentication) sets an httpOnly session cookie named
 * NEXT_PUBLIC_AUTH_COOKIE_NAME. Serve the API from the same site (e.g. a Next.js rewrite of
 * /api/v1 to the backend) so src/proxy.ts can see that cookie.
 */
import { api, USE_MOCK_API } from '@/shared/lib/api-client';
import { SESSION_COOKIE, type SessionUser } from '@/shared/lib/auth/session';
import { MockApiError, mockDelay } from '@/shared/lib/mock-store';
import { findMockRole } from '@/shared/lib/mock/roles.mock';
import {
  MAX_FAILED_ATTEMPTS,
  MOCK_BACKUP_CODE,
  MOCK_MFA_CODE,
  readMockUsers,
  updateMockUser,
  type MockUserRecord,
} from '@/shared/lib/mock/users.mock';

import { passwordMeetsPolicy } from '../schemas/password';
import type {
  ChangePasswordInput,
  DeviceSession,
  LoginInput,
  LoginResult,
  MfaInput,
  MyProfile,
  MyProfileUpdate,
  ResetPasswordInput,
} from '../types/auth.types';

/** TODO: confirm every path with the backend contract (docs/api/) before switching mock off. */
const ENDPOINTS = {
  login: '/auth/login',
  mfa: '/auth/mfa/verify',
  me: '/auth/me',
  logout: '/auth/logout',
  forgot: '/auth/password/forgot',
  reset: '/auth/password/reset',
  change: '/auth/password/change',
  sessions: '/auth/sessions',
  profile: '/auth/me/profile',
};

// ---------------------------------------------------------------- mock helpers
const PENDING_MFA = 'tms-mfa-pending';
const TRUSTED = 'tms-mfa-trusted:';
const DAY = 86_400;

function setMockSession(userId: string, remember: boolean) {
  const maxAge = remember ? `; max-age=${30 * DAY}` : '';
  document.cookie = `${SESSION_COOKIE}=mock.${userId}; path=/; samesite=lax${maxAge}`;
}

function mockSessionUserId(): string | null {
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  const value = match?.split('=')[1];
  return value?.startsWith('mock.') ? value.slice(5) : null;
}

function findByIdentifier(identifier: string): MockUserRecord | undefined {
  const id = identifier.trim().toLowerCase();
  return readMockUsers().find((u) => u.email.toLowerCase() === id || u.employeeId.toLowerCase() === id);
}

function toSessionUser(u: MockUserRecord): SessionUser {
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    role: u.role,
    siteTeam: u.siteTeam,
    permissions: findMockRole(u.role)?.permissions ?? {},
    mfaEnabled: u.mfaEnabled,
    mustChangePassword: u.mustChangePassword,
  };
}

function needsMfa(u: MockUserRecord): boolean {
  const role = findMockRole(u.role);
  if (!(u.mfaEnabled || role?.mfaRequired)) return false;
  const trustedUntil = Number(window.localStorage.getItem(TRUSTED + u.id) ?? 0);
  return trustedUntil < Date.now();
}

// ---------------------------------------------------------------- API
export async function login(input: LoginInput): Promise<LoginResult> {
  if (!USE_MOCK_API) return api.post<LoginResult>(ENDPOINTS.login, input);

  await mockDelay();
  const user = findByIdentifier(input.identifier);
  if (!user) throw new MockApiError('INVALID_CREDENTIALS', 401);
  if (user.status === 'DEACTIVATED') throw new MockApiError('ACCOUNT_DEACTIVATED', 403);
  if (user.status === 'LOCKED') throw new MockApiError('ACCOUNT_LOCKED', 423);

  if (user.password !== input.password) {
    const failed = user.failedAttempts + 1;
    const locked = failed >= MAX_FAILED_ATTEMPTS;
    updateMockUser(user.id, { failedAttempts: failed, status: locked ? 'LOCKED' : user.status });
    throw new MockApiError(locked ? 'ACCOUNT_LOCKED' : 'INVALID_CREDENTIALS', 401);
  }

  updateMockUser(user.id, { failedAttempts: 0 });
  if (needsMfa(user)) {
    window.sessionStorage.setItem(PENDING_MFA, JSON.stringify({ userId: user.id, remember: input.remember }));
    return { next: 'MFA' };
  }
  updateMockUser(user.id, { lastLoginAt: new Date().toISOString() });
  setMockSession(user.id, input.remember);
  return { next: 'DONE' };
}

export async function verifyMfa(input: MfaInput): Promise<void> {
  if (!USE_MOCK_API) return api.post<void>(ENDPOINTS.mfa, input);

  await mockDelay();
  const pending = JSON.parse(window.sessionStorage.getItem(PENDING_MFA) ?? 'null') as {
    userId: string;
    remember: boolean;
  } | null;
  if (!pending) throw new MockApiError('INVALID_CREDENTIALS', 401);
  const expected = input.backupCode ? MOCK_BACKUP_CODE : MOCK_MFA_CODE;
  if (input.code.trim().toUpperCase() !== expected) throw new MockApiError('INVALID_CODE', 401);

  window.sessionStorage.removeItem(PENDING_MFA);
  if (input.trustDevice) window.localStorage.setItem(TRUSTED + pending.userId, String(Date.now() + 30 * DAY * 1000));
  updateMockUser(pending.userId, { lastLoginAt: new Date().toISOString() });
  setMockSession(pending.userId, pending.remember);
}

/** True while a sign-in is waiting for the MFA code (used to guard the /mfa page). */
export function hasPendingMfa(): boolean {
  if (!USE_MOCK_API) return true;
  return window.sessionStorage.getItem(PENDING_MFA) !== null;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!USE_MOCK_API) return api.get<SessionUser>(ENDPOINTS.me).catch(() => null);

  await mockDelay(150);
  const id = mockSessionUserId();
  const user = id ? readMockUsers().find((u) => u.id === id) : undefined;
  if (!user || user.status !== 'ACTIVE') return null;
  return toSessionUser(user);
}

export async function logout(): Promise<void> {
  if (!USE_MOCK_API) {
    await api.post<void>(ENDPOINTS.logout);
    return;
  }
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (!USE_MOCK_API) return api.post<void>(ENDPOINTS.forgot, { email });
  // Always "succeeds" so the screen never reveals which emails have accounts.
  await mockDelay();
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  if (!USE_MOCK_API) return api.post<void>(ENDPOINTS.reset, input);

  await mockDelay();
  if (input.code.trim() !== MOCK_MFA_CODE) throw new MockApiError('INVALID_CODE', 400);
  if (!passwordMeetsPolicy(input.newPassword)) throw new MockApiError('PASSWORD_POLICY', 400);
  const user = findByIdentifier(input.email);
  if (user) {
    updateMockUser(user.id, {
      password: input.newPassword,
      failedAttempts: 0,
      mustChangePassword: false,
      status: user.status === 'LOCKED' ? 'ACTIVE' : user.status,
    });
  }
}

export async function changePassword(input: ChangePasswordInput): Promise<void> {
  if (!USE_MOCK_API) return api.post<void>(ENDPOINTS.change, input);

  await mockDelay();
  const user = currentMockUser();
  if (user.password !== input.currentPassword) throw new MockApiError('WRONG_CURRENT_PASSWORD', 400);
  if (!passwordMeetsPolicy(input.newPassword)) throw new MockApiError('PASSWORD_POLICY', 400);
  updateMockUser(user.id, { password: input.newPassword, mustChangePassword: false });
}

const NOTIFY_KEY = 'tms-mock-notify:';
const DEFAULT_NOTIFY = { inApp: true, email: true, sms: false };

function currentMockUser(): MockUserRecord {
  const id = mockSessionUserId();
  const user = id ? readMockUsers().find((u) => u.id === id) : undefined;
  if (!user) throw new MockApiError('INVALID_CREDENTIALS', 401);
  return user;
}

export async function getMyProfile(): Promise<MyProfile> {
  if (!USE_MOCK_API) return api.get<MyProfile>(ENDPOINTS.profile);

  await mockDelay(200);
  const u = currentMockUser();
  const notify = JSON.parse(window.localStorage.getItem(NOTIFY_KEY + u.id) ?? 'null') ?? DEFAULT_NOTIFY;
  return {
    fullName: u.fullName,
    employeeId: u.employeeId,
    email: u.email,
    mobile: u.mobile,
    role: u.role,
    siteTeam: u.siteTeam,
    language: u.language,
    notify,
  };
}

export async function saveMyProfile(update: MyProfileUpdate): Promise<void> {
  if (!USE_MOCK_API) return api.put<void>(ENDPOINTS.profile, update);

  await mockDelay();
  const u = currentMockUser();
  updateMockUser(u.id, { mobile: update.mobile, language: update.language });
  window.localStorage.setItem(NOTIFY_KEY + u.id, JSON.stringify(update.notify));
}

const signedOutDevices = new Set<string>();

const MOCK_DEVICES: DeviceSession[] = [
  { id: 'dev-1', device: 'Chrome · Windows', location: 'Colombo', lastActive: 'now', current: true },
  { id: 'dev-2', device: 'Chrome · Android', location: 'Kegalle', lastActive: 'yesterday', current: false },
];

export async function listSessions(): Promise<DeviceSession[]> {
  if (!USE_MOCK_API) return api.get<DeviceSession[]>(ENDPOINTS.sessions);
  await mockDelay(200);
  return MOCK_DEVICES.filter((d) => !signedOutDevices.has(d.id));
}

export async function signOutSession(id: string): Promise<void> {
  if (!USE_MOCK_API) return api.post<void>(`${ENDPOINTS.sessions}/${id}/sign-out`);
  await mockDelay(200);
  signedOutDevices.add(id);
}
