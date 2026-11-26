'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, type ReactNode } from 'react';

import { Sidebar } from '@/shared/components/layout/Sidebar';
import { Topbar } from '@/shared/components/layout/Topbar';
import { SessionProvider, useSession, type SignOutReason } from '@/shared/lib/auth/SessionProvider';
import { initialsOf } from '@/shared/lib/auth/session';
import { filterNavigation, NAVIGATION } from '@/shared/config/navigation';
import { LanguageSwitcher, useTranslateOr } from '@/web-requirements/wr-08-multi-language';

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
  const tOr = useTranslateOr();
  const { user, signOut } = useSession();
  const roleLabel = useRoleLabel(user?.role);

  const groups = useMemo(() => filterNavigation(NAVIGATION, user?.permissions), [user?.permissions]);
  const shellUser = user ? { name: user.fullName, role: roleLabel, initials: initialsOf(user.fullName) } : null;
  const onTimeout = useCallback(() => void signOut('timeout'), [signOut]);

  return (
    <div className={styles.shell}>
      <Sidebar groups={groups} user={shellUser ?? undefined} t={tOr} />
      <div className={styles.main}>
        <Topbar
          user={shellUser}
          t={tOr}
          languageSwitcher={<LanguageSwitcher />}
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
