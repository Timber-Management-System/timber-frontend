/**
 * FR-01 roles & permissions (S-01.7, S-18.1). Mock mode stores changes in the browser.
 */
import { api, USE_MOCK_API } from '@/shared/lib/api-client';
import type { PermissionSet } from '@/shared/lib/auth/permissions';
import type { RoleKey } from '@/shared/lib/auth/roles';
import { MockApiError, mockDelay } from '@/shared/lib/mock-store';
import { readMockRoles, writeMockRoles } from '@/shared/lib/mock/roles.mock';
import { readMockUsers } from '@/shared/lib/mock/users.mock';

import type { NewRoleInput, RoleSummary } from '../types/auth.types';

/** TODO: confirm paths with the backend contract (docs/api/). */
const ENDPOINT = '/roles';

export async function listRoles(): Promise<RoleSummary[]> {
  if (!USE_MOCK_API) return api.get<RoleSummary[]>(ENDPOINT);

  await mockDelay(250);
  const users = readMockUsers();
  return readMockRoles().map((r) => ({
    ...r,
    userCount: users.filter((u) => u.role === r.id && u.status !== 'DEACTIVATED').length,
  }));
}

export async function saveRolePermissions(id: RoleKey, permissions: PermissionSet): Promise<void> {
  if (!USE_MOCK_API) return api.put<void>(`${ENDPOINT}/${id}/permissions`, permissions);

  await mockDelay();
  writeMockRoles(readMockRoles().map((r) => (r.id === id ? { ...r, permissions } : r)));
}

function slug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createRole(input: NewRoleInput): Promise<RoleKey> {
  if (!USE_MOCK_API) return api.post<RoleKey>(ENDPOINT, input);

  await mockDelay();
  const roles = readMockRoles();
  const id = `custom-${slug(input.name)}` as RoleKey;
  if (roles.some((r) => r.id === id || r.label.toLowerCase() === input.name.trim().toLowerCase())) {
    throw new MockApiError('ROLE_EXISTS', 409);
  }
  const source = roles.find((r) => r.id === input.copyFrom);
  roles.push({
    id,
    label: input.name.trim(),
    description: input.description.trim(),
    mfaRequired: input.mfaRequired,
    builtIn: false,
    external: false,
    permissions: { ...(source?.permissions ?? {}) },
  });
  writeMockRoles(roles);
  return id;
}
