/**
 * User roles (FR-01). From the proposal section 12 and the wireframes:
 * S-01.7 Roles & permissions lists 11 roles; the role dashboards (S-13.x, S-17.x) add
 * Company Owner, Sawmill Manager and Purchasing Officer.
 *
 * The label is the i18n key `roles.<id>`; `label` here is the English fallback.
 */
export const ROLE_IDS = [
  'ADMIN',
  'MANAGEMENT',
  'OWNER',
  'COMPLIANCE',
  'FORESTRY_SUPERVISOR',
  'FIELD_TEAM',
  'TRANSPORT',
  'YARD_MANAGER',
  'SAWMILL_MANAGER',
  'SALES',
  'ACCOUNTANT',
  'PURCHASING',
  'CUSTOMER',
  'AUDITOR',
] as const;

export type RoleId = (typeof ROLE_IDS)[number];

/** A built-in role, or one an Administrator created on S-18.1 New role ("custom-quality-inspector"). */
export type RoleKey = RoleId | `custom-${string}`;

export interface RoleInfo {
  id: RoleId;
  label: string;
  /** MFA is mandatory for this role (NFR security: always for Administrator). */
  mfaRequired: boolean;
  /** External users (customer portal, regulator) - not company staff. */
  external?: boolean;
}

export const ROLES: Record<RoleId, RoleInfo> = {
  ADMIN: { id: 'ADMIN', label: 'Administrator', mfaRequired: true },
  MANAGEMENT: { id: 'MANAGEMENT', label: 'Management', mfaRequired: false },
  OWNER: { id: 'OWNER', label: 'Company Owner', mfaRequired: false },
  COMPLIANCE: { id: 'COMPLIANCE', label: 'Compliance Officer', mfaRequired: false },
  FORESTRY_SUPERVISOR: { id: 'FORESTRY_SUPERVISOR', label: 'Forestry Supervisor', mfaRequired: false },
  FIELD_TEAM: { id: 'FIELD_TEAM', label: 'Field Team', mfaRequired: false },
  TRANSPORT: { id: 'TRANSPORT', label: 'Transport Coordinator', mfaRequired: false },
  YARD_MANAGER: { id: 'YARD_MANAGER', label: 'Yard / Mill Manager', mfaRequired: false },
  SAWMILL_MANAGER: { id: 'SAWMILL_MANAGER', label: 'Sawmill Manager', mfaRequired: false },
  SALES: { id: 'SALES', label: 'Sales Officer', mfaRequired: false },
  ACCOUNTANT: { id: 'ACCOUNTANT', label: 'Accountant', mfaRequired: false },
  PURCHASING: { id: 'PURCHASING', label: 'Purchasing Officer', mfaRequired: false },
  CUSTOMER: { id: 'CUSTOMER', label: 'Customer (portal)', mfaRequired: false, external: true },
  AUDITOR: { id: 'AUDITOR', label: 'Auditor / Regulator', mfaRequired: false, external: true },
};

export function isRoleId(value: unknown): value is RoleId {
  return typeof value === 'string' && (ROLE_IDS as readonly string[]).includes(value);
}

export function isRoleKey(value: unknown): value is RoleKey {
  return isRoleId(value) || (typeof value === 'string' && value.startsWith('custom-'));
}
