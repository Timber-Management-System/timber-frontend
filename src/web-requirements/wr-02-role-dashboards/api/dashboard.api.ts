/**
 * WR-02: the dashboard for the signed-in user's role.
 * Mock mode returns the wireframe dashboards; the Administrator's user counts are live
 * (from the FR-02 mock users). TODO: confirm GET /dashboard with the backend (docs/api/).
 */
import { api, USE_MOCK_API } from '@/shared/lib/api-client';
import type { PermissionSet } from '@/shared/lib/auth/permissions';
import type { RoleKey } from '@/shared/lib/auth/roles';
import { filterNavigation, NAVIGATION } from '@/shared/config/navigation';
import { mockDelay } from '@/shared/lib/mock-store';
import { readMockUsers } from '@/shared/lib/mock/users.mock';

import { DASHBOARDS, type DashboardId } from '../data/dashboards.mock';
import type { Dashboard } from '../types/dashboard.types';

const BY_ROLE: Partial<Record<RoleKey, DashboardId>> = {
  ADMIN: 'admin',
  MANAGEMENT: 'management',
  OWNER: 'owner',
  COMPLIANCE: 'compliance',
  YARD_MANAGER: 'yard',
  TRANSPORT: 'transport',
  SALES: 'sales',
  ACCOUNTANT: 'accountant',
  FORESTRY_SUPERVISOR: 'forestry',
  SAWMILL_MANAGER: 'sawmill',
  PURCHASING: 'purchasing',
  AUDITOR: 'auditor',
  FIELD_TEAM: 'field',
};

/** Custom roles (S-18.1) get links to every module they may open. */
function customDashboard(permissions: PermissionSet): Dashboard {
  const links = filterNavigation(NAVIGATION, permissions)
    .flatMap((g) => g.items)
    .filter((item) => item.id !== 'dashboard')
    .map((item) => ({ label: item.label, href: item.href ?? item.children?.[0]?.href ?? '/dashboard' }));
  return {
    screen: 'WR-02',
    title: 'Dashboard',
    kpis: [],
    widgets: [{ type: 'links', title: 'My modules', span: 'full', links }],
  };
}

function withLiveUserCounts(dashboard: Dashboard): Dashboard {
  const users = readMockUsers();
  const active = users.filter((u) => u.status === 'ACTIVE').length;
  const locked = users.filter((u) => u.status === 'LOCKED').length;
  return {
    ...dashboard,
    kpis: dashboard.kpis.map((k) => {
      if (k.label === 'Active users') return { ...k, value: String(active) };
      if (k.label === 'Locked accounts') return { ...k, value: String(locked), tone: locked ? 'warn' : 'ok' };
      return k;
    }),
  };
}

export async function getDashboard(role: RoleKey, permissions: PermissionSet): Promise<Dashboard> {
  if (!USE_MOCK_API) return api.get<Dashboard>('/dashboard');

  await mockDelay(250);
  const id = BY_ROLE[role];
  if (!id) return customDashboard(permissions);
  return id === 'admin' ? withLiveUserCounts(DASHBOARDS.admin) : DASHBOARDS[id];
}
