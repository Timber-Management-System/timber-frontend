'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { NotificationCenter } from '@/shared/components/layout/NotificationCenter';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { Topbar } from '@/shared/components/layout/Topbar';
import { SessionProvider, useSession, type SignOutReason } from '@/shared/lib/auth/SessionProvider';
import { initialsOf } from '@/shared/lib/auth/session';
import { filterNavigation, NAVIGATION } from '@/shared/config/navigation';
import { getMenuCounts } from '@/shared/lib/notifications.api';
import { LanguageSwitcher, useT, useTranslateOr } from '@/web-requirements/wr-08-multi-language';

import { getCurrentUser, logout } from '../api/auth.api';

import styles from './AppShell.module.css';
import { RouteGuard } from './RouteGuard';
import { SessionTimeoutDialog } from './SessionTimeoutDialog';
import { useRoleLabel } from './useRoleLabel';

/**
 * The signed-in part of the app (FR-01): session, role-filtered sidebar, top bar,
 * access check on every page and the inactivity timeout. Used by src/app/(app)/layout.tsx.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();

  const onSignedOut = useCallback(
    (reason: SignOutReason) => {
      if (reason === 'noSession') {
        // Clear a stale cookie first, or src/proxy.ts would send the user straight back here.
        const here = window.location.pathname + window.location.search;
        void logout()
          .catch(() => undefined)
          .finally(() => router.replace(`/login?next=${encodeURIComponent(here)}`));
      } else {
        router.replace(`/login?reason=${reason}`);
      }
    },
    [router],
  );

  return (
    <SessionProvider loadUser={getCurrentUser} endSession={logout} onSignedOut={onSignedOut}>
      <Shell>{children}</Shell>
    </SessionProvider>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const t = useT();
  const tOr = useTranslateOr();
  const { user, signOut } = useSession();
  const roleLabel = useRoleLabel(user?.role);
  const [menuCounts, setMenuCounts] = useState<Record<string, number>>({});

  // Counts on the sidebar menu (e.g. Approval queue 9), as in the Option B example.
  useEffect(() => {
    if (!user) return;
    let active = true;
    getMenuCounts()
      .then((counts) => {
        if (active) setMenuCounts(counts);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [user]);

  const groups = useMemo(() => filterNavigation(NAVIGATION, user?.permissions), [user?.permissions]);
  const shellUser = user
    ? { name: user.fullName, role: roleLabel, initials: initialsOf(user.fullName), site: user.siteTeam }
    : null;
  const onTimeout = useCallback(() => void signOut('timeout'), [signOut]);

  return (
    <div className={styles.shell}>
      <Sidebar groups={groups} user={shellUser ?? undefined} badges={menuCounts} t={tOr} />
      <div className={styles.main}>
        <Topbar
          user={shellUser}
          t={tOr}
          languageSwitcher={<LanguageSwitcher />}
          notifications={<NotificationCenter t={t} />}
          onSignOut={() => void signOut('signedOut')}
        />
        <main className={styles.content} id="main-content">
          <RouteGuard>{children}</RouteGuard>
        </main>
      </div>
      {user && <SessionTimeoutDialog onTimeout={onTimeout} />}
    </div>
  );
}
