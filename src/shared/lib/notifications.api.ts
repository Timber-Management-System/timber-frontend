/**
 * In-app notifications for the top bar bell (Option B notification centre) and the counts on
 * the sidebar menu. The real data belongs to FR-56 (Email, SMS and in-app notifications):
 * the FR-56 owner should point these functions at the backend. Until then they use mock data.
 * TODO (FR-56): confirm endpoints with the backend contract (docs/api/).
 */
import { api, USE_MOCK_API } from './api-client';
import { mockDelay, readMock, writeMock } from './mock-store';

export type NotificationLevel = 'critical' | 'warn' | 'ok' | 'info';

export interface AppNotification {
  id: string;
  level: NotificationLevel;
  title: string;
  message: string;
  /** ISO date-time. */
  createdAt: string;
  read: boolean;
  /** Page that deals with this notification. */
  href?: string;
}

const KEY = 'notifications';
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

function seed(): AppNotification[] {
  return [
    {
      id: 'n-1',
      level: 'critical',
      title: 'Felling blocked',
      message: 'TREE-036 exceeds the remaining quota on permit PER-012.',
      createdAt: minutesAgo(10),
      read: false,
      href: '/site-tree/tree-approval',
    },
    {
      id: 'n-2',
      level: 'critical',
      title: 'Logs missing on arrival',
      message: 'TRP-014: 2 of 50 logs were not received at Sawmill 1.',
      createdAt: minutesAgo(45),
      read: false,
      href: '/transport/reconciliation',
    },
    {
      id: 'n-3',
      level: 'warn',
      title: 'Permit expiring soon',
      message: 'Permit PER-010 expires in 7 days.',
      createdAt: minutesAgo(180),
      read: false,
      href: '/licence-permit/expiry-alerts',
    },
    {
      id: 'n-4',
      level: 'warn',
      title: 'Quota nearing limit',
      message: 'PER-010 has used 80% of its quota.',
      createdAt: minutesAgo(300),
      read: true,
      href: '/licence-permit/quota-tracking',
    },
    {
      id: 'n-5',
      level: 'ok',
      title: 'Orders ready for dispatch',
      message: '5 customer orders are waiting for dispatch.',
      createdAt: minutesAgo(1560),
      read: true,
      href: '/sales/dispatch',
    },
  ];
}

export async function listNotifications(): Promise<AppNotification[]> {
  if (!USE_MOCK_API) return api.get<AppNotification[]>('/notifications');
  await mockDelay(150);
  return readMock(KEY, seed);
}

export async function markNotificationsRead(ids: string[] | 'all'): Promise<void> {
  if (!USE_MOCK_API) {
    await api.post<void>('/notifications/read', { ids });
    return;
  }
  writeMock(
    KEY,
    readMock(KEY, seed).map((n) => (ids === 'all' || ids.includes(n.id) ? { ...n, read: true } : n)),
  );
}

export async function clearNotifications(): Promise<void> {
  if (!USE_MOCK_API) {
    await api.post<void>('/notifications/clear');
    return;
  }
  writeMock(KEY, []);
}

/**
 * Counts shown as badges on the sidebar menu, keyed by menu id (src/shared/config/navigation.ts),
 * e.g. { 'site.tree-approval': 9 }. Each module's owner can add its own count.
 */
export async function getMenuCounts(): Promise<Record<string, number>> {
  if (!USE_MOCK_API) return api.get<Record<string, number>>('/notifications/menu-counts');
  await mockDelay(150);
  return {
    'licence.expiry-alerts': 3,
    'site.tree-approval': 9,
    'felling.offline-capture': 2,
    'transport.reconciliation': 1,
  };
}
