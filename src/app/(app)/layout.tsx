import type { ReactNode } from 'react';

import { AppShell } from '@/modules/user-access/fr-01-authentication';

/** Every logged-in page: session, role-filtered sidebar, top bar and access check (FR-01). */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
