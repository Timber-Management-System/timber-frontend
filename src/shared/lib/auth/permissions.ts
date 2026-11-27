import type { RoleId } from './roles';

/**
 * Role-based access control (FR-01). The DEFAULT matrix is the proposal's section 12 table
 * (pre-filled on S-01.7 Roles & permissions). Admins can change it on that screen; the user's
 * real permissions always come from their session (the backend has the final say).
 *
 * C = create, R = read, U = update, A = approve, D = delete.
 * Delete is never granted: records are deactivated or corrected by a logged adjustment (BR-09).
 */
export const AREAS = [
  'users-settings',
  'licences-permits',
  'trees-felling',
  'transport',
  'production',
  'inventory',
  'customers-sales',
  'invoices-payments',
  'procurement',
  'reports',
] as const;
export type Area = (typeof AREAS)[number];

export const ACTIONS = ['C', 'R', 'U', 'A', 'D'] as const;
export type Action = (typeof ACTIONS)[number];

/** For each area, the actions allowed, written as a string such as "CRUA". Missing area = no access. */
export type PermissionSet = Partial<Record<Area, string>>;

const ALL_READ: PermissionSet = {
  'licences-permits': 'R',
  'trees-felling': 'R',
  transport: 'R',
  production: 'R',
  inventory: 'R',
  'customers-sales': 'R',
  'invoices-payments': 'R',
  procurement: 'R',
  reports: 'R',
};

export const DEFAULT_PERMISSIONS: Record<RoleId, PermissionSet> = {
  // --- Proposal section 12 ---
  ADMIN: { ...ALL_READ, 'users-settings': 'CRU' },
  MANAGEMENT: { ...ALL_READ, 'users-settings': 'R', 'customers-sales': 'RA' },
  COMPLIANCE: {
    'licences-permits': 'CRUA',
    'trees-felling': 'R',
    transport: 'R',
    production: 'R',
    inventory: 'R',
    reports: 'R',
  },
  FORESTRY_SUPERVISOR: {
    'licences-permits': 'R',
    'trees-felling': 'CRUA',
    transport: 'R',
    inventory: 'R',
    reports: 'R',
  },
  TRANSPORT: {
    'licences-permits': 'R',
    transport: 'CRU',
    inventory: 'R',
    'customers-sales': 'R',
    reports: 'R',
  },
  YARD_MANAGER: {
    'trees-felling': 'R',
    transport: 'R',
    production: 'CRU',
    inventory: 'CRUA',
    'customers-sales': 'R',
    procurement: 'R',
    reports: 'R',
  },
  SALES: {
    transport: 'R',
    inventory: 'R',
    'customers-sales': 'CRU',
    'invoices-payments': 'R',
    reports: 'R',
  },
  ACCOUNTANT: {
    production: 'R',
    inventory: 'R',
    'customers-sales': 'R',
    'invoices-payments': 'CRUA',
    procurement: 'R',
    reports: 'R',
  },
  // --- Roles from the dashboard wireframes (not in section 12: confirm with the owner) ---
  OWNER: { ...ALL_READ, 'users-settings': 'R', 'customers-sales': 'RA', 'invoices-payments': 'RA' },
  FIELD_TEAM: { 'licences-permits': 'R', 'trees-felling': 'CRU', transport: 'R' },
  SAWMILL_MANAGER: { 'trees-felling': 'R', transport: 'R', production: 'CRU', inventory: 'R', reports: 'R' },
  PURCHASING: { inventory: 'R', procurement: 'CRU', 'invoices-payments': 'R', reports: 'R' },
  // --- External ---
  CUSTOMER: {},
  AUDITOR: { ...ALL_READ },
};

export function can(permissions: PermissionSet | undefined, area: Area, action: Action = 'R'): boolean {
  if (action === 'D') return false; // BR-09: nothing is deleted from the app
  return Boolean(permissions?.[area]?.includes(action));
}

/** Pages every signed-in user may open, whatever their role. */
const OPEN_TO_ALL = ['/dashboard', '/search', '/user-access/profile', '/audit-admin/notifications'];

/** Which permission area a page belongs to. `null` = open to every signed-in user. */
export function areaForPath(pathname: string): Area | null {
  const is = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);
  if (OPEN_TO_ALL.some(is)) return null;
  if (is('/user-access') || is('/audit-admin')) return 'users-settings';
  if (is('/licence-permit')) return 'licences-permits';
  if (is('/site-tree') || is('/felling')) return 'trees-felling';
  if (is('/transport')) return 'transport';
  if (is('/sawmill')) return 'production';
  if (is('/inventory')) return 'inventory';
  if (is('/sales/invoicing-payments') || is('/sales/credit-control') || is('/finance')) return 'invoices-payments';
  if (is('/sales')) return 'customers-sales';
  if (is('/procurement')) return 'procurement';
  if (is('/reports')) return 'reports';
  return null;
}

/** True if the role's permissions let the user open this page (read access). */
export function canOpenPath(permissions: PermissionSet | undefined, pathname: string): boolean {
  const area = areaForPath(pathname);
  return area === null || can(permissions, area, 'R');
}
