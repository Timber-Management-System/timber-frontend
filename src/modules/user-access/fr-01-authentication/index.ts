/**
 * FR-01 Login with role-based access control.
 * Screens: S-01.1 Login, S-01.2 Reset password, S-01.3 Admin MFA, S-01.7 Roles & permissions,
 * S-13.7 My profile, S-13.11 Access denied, S-13.13 Session timeout, S-18.1 New role.
 */
export { LoginPage } from './components/LoginPage';
export { MfaPage } from './components/MfaPage';
export { ResetPasswordPage } from './components/ResetPasswordPage';
export { RolesPage } from './components/RolesPage';
export { ProfilePage } from './components/ProfilePage';
export { AccessDenied } from './components/AccessDenied';
export { RouteGuard } from './components/RouteGuard';
export { SessionTimeoutDialog } from './components/SessionTimeoutDialog';
export { AdminTabs } from './components/AdminTabs';
export { PasswordRules } from './components/PasswordRules';
export { useRoleLabel, useRoleLabeller } from './components/useRoleLabel';
export { useRoles } from './hooks/useRoles';
export { getCurrentUser, logout } from './api/auth.api';
export { PASSWORD_RULES, passwordMeetsPolicy, validateNewPassword, isEmail } from './schemas/password';
export type { RoleSummary } from './types/auth.types';
export { AppShell } from './components/AppShell';
