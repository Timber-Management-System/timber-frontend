/**
 * Mock role store (FR-01 S-01.7 Roles & permissions, S-18.1 New role) while
 * NEXT_PUBLIC_USE_MOCK_API=true. Seeded from the proposal section 12 matrix.
 * Sign-in reads permissions from here, so matrix changes apply at the next sign-in.
 */
import { DEFAULT_PERMISSIONS, type PermissionSet } from '@/shared/lib/auth/permissions';
import { ROLE_IDS, ROLES, type RoleKey } from '@/shared/lib/auth/roles';

import { readMock, writeMock } from '../mock-store';

export interface MockRoleRecord {
  id: RoleKey;
  label: string;
  description: string;
  mfaRequired: boolean;
  builtIn: boolean;
  external: boolean;
  permissions: PermissionSet;
}

const KEY = 'roles';

function seed(): MockRoleRecord[] {
  return ROLE_IDS.map((id) => ({
    id,
    label: ROLES[id].label,
    description: '',
    mfaRequired: ROLES[id].mfaRequired,
    builtIn: true,
    external: Boolean(ROLES[id].external),
    permissions: { ...DEFAULT_PERMISSIONS[id] },
  }));
}

export function readMockRoles(): MockRoleRecord[] {
  return readMock(KEY, seed);
}

export function writeMockRoles(roles: MockRoleRecord[]): void {
  writeMock(KEY, roles);
}

export function findMockRole(id: RoleKey): MockRoleRecord | undefined {
  return readMockRoles().find((r) => r.id === id);
}
