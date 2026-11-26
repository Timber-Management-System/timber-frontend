/**
 * Mock user directory shared by FR-01 (sign-in) and FR-02 (user management) while
 * NEXT_PUBLIC_USE_MOCK_API=true. People and values come from the wireframes (S-01.5).
 *
 * Demo sign-in (mock only, never real accounts):
 *   any email below + password  Timber@123
 *   admin@timberco.lk also asks for the MFA code  123456  (backup code ABCD-1234)
 *   ruwan@timberco.lk is locked (5 failed attempts) - unlock it from Users › Reset password
 */
import type { RoleKey } from '@/shared/lib/auth/roles';

import { readMock, writeMock } from '../mock-store';

export type MockUserStatus = 'ACTIVE' | 'LOCKED' | 'DEACTIVATED';

export interface MockUserRecord {
  id: string;
  fullName: string;
  employeeId: string;
  email: string;
  mobile: string;
  role: RoleKey;
  siteTeam: string;
  language: 'en' | 'si' | 'ta';
  status: MockUserStatus;
  mfaEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  /** Mock only - a real backend never sends passwords. */
  password: string;
  failedAttempts: number;
  mustChangePassword: boolean;
  deactivationReason?: string;
}

export const MOCK_PASSWORD = 'Timber@123';
export const MOCK_MFA_CODE = '123456';
export const MOCK_BACKUP_CODE = 'ABCD-1234';
/** FR-01: the account is locked after this many failed sign-ins. */
export const MAX_FAILED_ATTEMPTS = 5;

const KEY = 'users';
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

function seed(): MockUserRecord[] {
  const base = { language: 'en' as const, password: MOCK_PASSWORD, failedAttempts: 0, mustChangePassword: false };
  const rows: Array<Omit<MockUserRecord, keyof typeof base | 'createdAt'> & Partial<typeof base>> = [
    {
      id: 'USR-001',
      fullName: 'System Admin',
      employeeId: 'EMP-0001',
      email: 'admin@timberco.lk',
      mobile: '+94 77 100 0001',
      role: 'ADMIN',
      siteTeam: 'All',
      status: 'ACTIVE',
      mfaEnabled: true,
      lastLoginAt: hoursAgo(1),
    },
    {
      id: 'USR-002',
      fullName: 'Nimal Perera',
      employeeId: 'EMP-0012',
      email: 'nimal@timberco.lk',
      mobile: '+94 77 123 4567',
      role: 'COMPLIANCE',
      siteTeam: 'Head office',
      status: 'ACTIVE',
      mfaEnabled: true,
      lastLoginAt: hoursAgo(2),
    },
    {
      id: 'USR-003',
      fullName: 'Kasun Silva',
      employeeId: 'EMP-0021',
      email: 'kasun@timberco.lk',
      mobile: '+94 71 222 3344',
      role: 'FIELD_TEAM',
      siteTeam: 'Site A – Team 2',
      status: 'ACTIVE',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(26),
    },
    {
      id: 'USR-004',
      fullName: 'Dilini Fernando',
      employeeId: 'EMP-0034',
      email: 'dilini@timberco.lk',
      mobile: '+94 76 555 0101',
      role: 'YARD_MANAGER',
      siteTeam: 'Sawmill 1',
      status: 'ACTIVE',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(3),
    },
    {
      id: 'USR-005',
      fullName: 'Ruwan Jayasinghe',
      employeeId: 'EMP-0041',
      email: 'ruwan@timberco.lk',
      mobile: '+94 77 909 1122',
      role: 'SALES',
      siteTeam: 'Head office',
      status: 'LOCKED',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(72),
      failedAttempts: 5,
    },
    {
      id: 'USR-006',
      fullName: 'Saman Kumara',
      employeeId: 'EMP-0045',
      email: 'saman@timberco.lk',
      mobile: '+94 70 444 7788',
      role: 'TRANSPORT',
      siteTeam: 'Transport',
      status: 'DEACTIVATED',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(720),
      deactivationReason: 'Left the company',
    },
    {
      id: 'USR-007',
      fullName: 'Anura Wijesinghe',
      employeeId: 'EMP-0003',
      email: 'anura@timberco.lk',
      mobile: '+94 77 300 4000',
      role: 'MANAGEMENT',
      siteTeam: 'Head office',
      status: 'ACTIVE',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(5),
    },
    {
      id: 'USR-008',
      fullName: 'Chandra Rajapaksha',
      employeeId: 'EMP-0002',
      email: 'owner@timberco.lk',
      mobile: '+94 77 300 1000',
      role: 'OWNER',
      siteTeam: 'Head office',
      status: 'ACTIVE',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(20),
    },
    {
      id: 'USR-009',
      fullName: 'Asela Silva',
      employeeId: 'EMP-0016',
      email: 'asela@timberco.lk',
      mobile: '+94 71 600 7000',
      role: 'FORESTRY_SUPERVISOR',
      siteTeam: 'Site A',
      status: 'ACTIVE',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(4),
    },
    {
      id: 'USR-010',
      fullName: 'Nuwan Dias',
      employeeId: 'EMP-0050',
      email: 'nuwan@timberco.lk',
      mobile: '+94 72 410 2020',
      role: 'TRANSPORT',
      siteTeam: 'Transport',
      status: 'ACTIVE',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(6),
    },
    {
      id: 'USR-011',
      fullName: 'Mahesh Rathnayake',
      employeeId: 'EMP-0038',
      email: 'mahesh@timberco.lk',
      mobile: '+94 76 811 3030',
      role: 'SAWMILL_MANAGER',
      siteTeam: 'Sawmill 1',
      status: 'ACTIVE',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(8),
    },
    {
      id: 'USR-012',
      fullName: 'Amali Jayasinghe',
      employeeId: 'EMP-0042',
      email: 'amali@timberco.lk',
      mobile: '+94 77 512 4040',
      role: 'SALES',
      siteTeam: 'Head office',
      status: 'ACTIVE',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(2),
    },
    {
      id: 'USR-013',
      fullName: 'Tharindu Gunawardena',
      employeeId: 'EMP-0047',
      email: 'tharindu@timberco.lk',
      mobile: '+94 71 733 5050',
      role: 'ACCOUNTANT',
      siteTeam: 'Head office',
      status: 'ACTIVE',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(10),
    },
    {
      id: 'USR-014',
      fullName: 'Priyanka Bandara',
      employeeId: 'EMP-0053',
      email: 'priyanka@timberco.lk',
      mobile: '+94 70 920 6060',
      role: 'PURCHASING',
      siteTeam: 'Head office',
      status: 'ACTIVE',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(30),
    },
    {
      id: 'USR-015',
      fullName: 'Regional Forest Office',
      employeeId: 'EXT-0001',
      email: 'auditor@forest.gov.lk',
      mobile: '+94 11 286 6631',
      role: 'AUDITOR',
      siteTeam: 'External',
      status: 'ACTIVE',
      mfaEnabled: false,
      lastLoginAt: hoursAgo(240),
    },
  ];
  return rows.map((row, i) => ({ ...base, ...row, createdAt: hoursAgo(5000 - i * 100) }));
}

export function readMockUsers(): MockUserRecord[] {
  return readMock(KEY, seed);
}

export function writeMockUsers(users: MockUserRecord[]): void {
  writeMock(KEY, users);
}

export function updateMockUser(id: string, change: Partial<MockUserRecord>): MockUserRecord | undefined {
  const users = readMockUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index < 0) return undefined;
  users[index] = { ...users[index], ...change };
  writeMockUsers(users);
  return users[index];
}
