import type { RoleKey } from '@/shared/lib/auth/roles';

/** FR-02 Create, deactivate and reset users. Users are never deleted (audit history, FR-03). */
export type UserStatus = 'ACTIVE' | 'LOCKED' | 'DEACTIVATED';

export interface User {
  id: string;
  fullName: string;
  employeeId: string;
  email: string;
  mobile: string;
  role: RoleKey;
  siteTeam: string;
  language: 'en' | 'si' | 'ta';
  status: UserStatus;
  mfaEnabled: boolean;
  lastLoginAt: string | null;
}

export interface UserFilters {
  search: string;
  role: RoleKey | '';
  status: UserStatus | '';
  siteTeam: string;
  page: number;
  pageSize: number;
}

export interface UserPage {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
  /** Values for the Site / team filter. */
  siteTeams: string[];
}

/** S-01.6 Add / edit user. */
export interface UserInput {
  fullName: string;
  employeeId: string;
  email: string;
  mobile: string;
  role: RoleKey | '';
  siteTeam: string;
  language: 'en' | 'si' | 'ta';
  active: boolean;
  sendInvite: boolean;
  forcePasswordChange: boolean;
  requireMfa: boolean;
}

/** S-18.2 Reset user password. */
export interface AdminResetInput {
  method: 'link' | 'temporary';
  temporaryPassword?: string;
  unlock: boolean;
  forceChange: boolean;
}

/** S-13.9 Deactivate user: work still assigned to this person (from other modules). */
export interface OpenItem {
  label: string;
  count: number;
}

export type UserErrorCode = 'EMAIL_TAKEN' | 'EMPLOYEE_ID_TAKEN' | 'LAST_ADMIN' | 'PASSWORD_POLICY' | 'UNKNOWN';
