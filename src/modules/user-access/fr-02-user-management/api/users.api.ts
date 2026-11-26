/**
 * FR-02 user management calls. Mock mode shares its data with FR-01 sign-in
 * (src/shared/lib/mock/users.mock.ts), so a user added here can sign in with Timber@123.
 * Users are never deleted: they are deactivated and can be reactivated (S-13.9).
 */
import { passwordMeetsPolicy } from '@/modules/user-access/fr-01-authentication';
import { api, ApiError, USE_MOCK_API } from '@/shared/lib/api-client';
import { MockApiError, mockDelay } from '@/shared/lib/mock-store';
import {
  MOCK_PASSWORD,
  readMockUsers,
  updateMockUser,
  writeMockUsers,
  type MockUserRecord,
} from '@/shared/lib/mock/users.mock';

import type {
  AdminResetInput,
  OpenItem,
  User,
  UserErrorCode,
  UserFilters,
  UserInput,
  UserPage,
} from '../types/user.types';

/** TODO: confirm paths with the backend contract (docs/api/). */
const ENDPOINT = '/users';

function toUser(r: MockUserRecord): User {
  return {
    id: r.id,
    fullName: r.fullName,
    employeeId: r.employeeId,
    email: r.email,
    mobile: r.mobile,
    role: r.role,
    siteTeam: r.siteTeam,
    language: r.language,
    status: r.status,
    mfaEnabled: r.mfaEnabled,
    lastLoginAt: r.lastLoginAt,
  };
}

function matches(u: MockUserRecord, f: Omit<UserFilters, 'page' | 'pageSize'>): boolean {
  const q = f.search.trim().toLowerCase();
  const text = `${u.fullName} ${u.email} ${u.mobile} ${u.employeeId}`.toLowerCase();
  return (
    (!q || text.includes(q)) &&
    (!f.role || u.role === f.role) &&
    (!f.status || u.status === f.status) &&
    (!f.siteTeam || u.siteTeam === f.siteTeam)
  );
}

export async function listUsers(filters: UserFilters): Promise<UserPage> {
  if (!USE_MOCK_API) {
    return api.get<UserPage>(ENDPOINT, {
      query: { ...filters, role: filters.role || undefined, status: filters.status || undefined },
    });
  }
  await mockDelay(300);
  const all = readMockUsers();
  const rows = all.filter((u) => matches(u, filters)).sort((a, b) => a.fullName.localeCompare(b.fullName));
  const start = (filters.page - 1) * filters.pageSize;
  return {
    items: rows.slice(start, start + filters.pageSize).map(toUser),
    total: rows.length,
    page: filters.page,
    pageSize: filters.pageSize,
    siteTeams: [...new Set(all.map((u) => u.siteTeam))].sort(),
  };
}

function assertUnique(users: MockUserRecord[], input: UserInput, ignoreId?: string) {
  const others = users.filter((u) => u.id !== ignoreId);
  if (others.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
    throw new MockApiError('EMAIL_TAKEN', 409);
  }
  if (others.some((u) => u.employeeId.toLowerCase() === input.employeeId.trim().toLowerCase())) {
    throw new MockApiError('EMPLOYEE_ID_TAKEN', 409);
  }
}

function activeAdmins(users: MockUserRecord[]) {
  return users.filter((u) => u.role === 'ADMIN' && u.status === 'ACTIVE');
}

export async function createUser(input: UserInput): Promise<User> {
  if (!USE_MOCK_API) return api.post<User>(ENDPOINT, input);

  await mockDelay();
  const users = readMockUsers();
  assertUnique(users, input);
  const next = Math.max(0, ...users.map((u) => Number(u.id.replace(/\D/g, '')) || 0)) + 1;
  const record: MockUserRecord = {
    id: `USR-${String(next).padStart(3, '0')}`,
    fullName: input.fullName.trim(),
    employeeId: input.employeeId.trim(),
    email: input.email.trim(),
    mobile: input.mobile.trim(),
    role: input.role || 'FIELD_TEAM',
    siteTeam: input.siteTeam.trim(),
    language: input.language,
    status: input.active ? 'ACTIVE' : 'DEACTIVATED',
    mfaEnabled: input.requireMfa,
    lastLoginAt: null,
    createdAt: new Date().toISOString(),
    password: MOCK_PASSWORD,
    failedAttempts: 0,
    mustChangePassword: input.forcePasswordChange,
  };
  writeMockUsers([...users, record]);
  return toUser(record);
}

export async function updateUser(id: string, input: UserInput): Promise<User> {
  if (!USE_MOCK_API) return api.put<User>(`${ENDPOINT}/${id}`, input);

  await mockDelay();
  const users = readMockUsers();
  assertUnique(users, input, id);
  const current = users.find((u) => u.id === id);
  if (!current) throw new MockApiError('UNKNOWN', 404);
  const losingAdmin = current.role === 'ADMIN' && (input.role !== 'ADMIN' || !input.active);
  if (losingAdmin && activeAdmins(users).length <= 1) throw new MockApiError('LAST_ADMIN', 409);

  const updated = updateMockUser(id, {
    fullName: input.fullName.trim(),
    employeeId: input.employeeId.trim(),
    email: input.email.trim(),
    mobile: input.mobile.trim(),
    role: input.role || current.role,
    siteTeam: input.siteTeam.trim(),
    language: input.language,
    mfaEnabled: input.requireMfa,
    mustChangePassword: input.forcePasswordChange || current.mustChangePassword,
    status: input.active ? (current.status === 'DEACTIVATED' ? 'ACTIVE' : current.status) : 'DEACTIVATED',
  });
  return toUser(updated!);
}

/** S-13.9: deactivate (reason required) or reactivate. Never deletes. */
export async function setUserActive(id: string, active: boolean, reason?: string): Promise<void> {
  if (!USE_MOCK_API) {
    await api.post<void>(`${ENDPOINT}/${id}/${active ? 'reactivate' : 'deactivate'}`, { reason });
    return;
  }
  await mockDelay();
  const users = readMockUsers();
  const user = users.find((u) => u.id === id);
  if (!user) throw new MockApiError('UNKNOWN', 404);
  if (!active && user.role === 'ADMIN' && activeAdmins(users).length <= 1) throw new MockApiError('LAST_ADMIN', 409);
  updateMockUser(id, {
    status: active ? 'ACTIVE' : 'DEACTIVATED',
    deactivationReason: active ? undefined : reason,
    failedAttempts: 0,
  });
}

/** S-18.2: email a reset link or set a temporary password; optionally unlock. */
export async function adminResetPassword(id: string, input: AdminResetInput): Promise<void> {
  if (!USE_MOCK_API) {
    await api.post<void>(`${ENDPOINT}/${id}/reset-password`, input);
    return;
  }
  await mockDelay();
  if (input.method === 'temporary' && !passwordMeetsPolicy(input.temporaryPassword ?? '')) {
    throw new MockApiError('PASSWORD_POLICY', 400);
  }
  const user = readMockUsers().find((u) => u.id === id);
  if (!user) throw new MockApiError('UNKNOWN', 404);
  updateMockUser(id, {
    password: input.method === 'temporary' ? input.temporaryPassword! : user.password,
    mustChangePassword: input.forceChange || input.method === 'temporary',
    ...(input.unlock && user.status === 'LOCKED' ? { status: 'ACTIVE' as const, failedAttempts: 0 } : {}),
  });
}

/**
 * Work still owned by the user (S-13.9 "Open items"). In the real system each module reports its
 * own items through the backend; the mock returns the wireframe example for transport users.
 */
export async function getOpenItems(id: string): Promise<OpenItem[]> {
  if (!USE_MOCK_API) return api.get<OpenItem[]>(`${ENDPOINT}/${id}/open-items`);
  await mockDelay(200);
  const user = readMockUsers().find((u) => u.id === id);
  if (user?.role === 'TRANSPORT') return [{ label: 'users.openItems.plannedTrips', count: 2 }];
  if (user?.role === 'FORESTRY_SUPERVISOR') return [{ label: 'users.openItems.workOrders', count: 3 }];
  return [];
}

/** All users matching the filters (for Export). */
export async function listAllUsers(filters: Omit<UserFilters, 'page' | 'pageSize'>): Promise<User[]> {
  const first = await listUsers({ ...filters, page: 1, pageSize: 1000 });
  return first.items;
}

export function userErrorCode(error: unknown): UserErrorCode {
  let code: unknown;
  if (error instanceof MockApiError) code = error.code;
  else if (error instanceof ApiError && typeof error.body === 'object' && error.body !== null) {
    code = (error.body as { code?: unknown }).code;
  }
  const known: UserErrorCode[] = ['EMAIL_TAKEN', 'EMPLOYEE_ID_TAKEN', 'LAST_ADMIN', 'PASSWORD_POLICY'];
  return known.includes(code as UserErrorCode) ? (code as UserErrorCode) : 'UNKNOWN';
}
