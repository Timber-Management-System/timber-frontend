import type { PermissionSet } from '@/shared/lib/auth/permissions';
import type { RoleKey } from '@/shared/lib/auth/roles';

/** FR-01 Login with role-based access control. */

export interface LoginInput {
  /** Username or email (S-01.1). */
  identifier: string;
  password: string;
  /** "Remember this device" - keep the session for 30 days. */
  remember: boolean;
}

/** DONE = signed in. MFA = password OK, now ask for the authenticator code (S-01.3). */
export type LoginResult = { next: 'DONE' } | { next: 'MFA' };

export interface MfaInput {
  code: string;
  /** "Trust this device for 30 days". */
  trustDevice: boolean;
  /** true = `code` is a backup code instead of the 6-digit app code. */
  backupCode: boolean;
}

export interface ResetPasswordInput {
  email: string;
  code: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

/** S-13.7 My profile. Name, email, role and site are set by an admin (FR-02); the rest is editable. */
export interface MyProfile {
  fullName: string;
  employeeId: string;
  email: string;
  mobile: string;
  role: RoleKey;
  siteTeam: string;
  language: 'en' | 'si' | 'ta';
  notify: { inApp: boolean; email: boolean; sms: boolean };
}

export type MyProfileUpdate = Pick<MyProfile, 'mobile' | 'language' | 'notify'>;

/** A signed-in device on S-13.7 "Active sessions". */
export interface DeviceSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface RoleSummary {
  id: RoleKey;
  label: string;
  description: string;
  mfaRequired: boolean;
  builtIn: boolean;
  external: boolean;
  userCount: number;
  permissions: PermissionSet;
}

export interface NewRoleInput {
  name: string;
  copyFrom: RoleKey | '';
  description: string;
  mfaRequired: boolean;
}

/** Error codes the backend returns; each has a message under `auth.errors.<code>`. */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_DEACTIVATED'
  | 'INVALID_CODE'
  | 'PASSWORD_POLICY'
  | 'WRONG_CURRENT_PASSWORD'
  | 'ROLE_EXISTS'
  | 'UNKNOWN';
