'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { areaForPath, canOpenPath } from '@/shared/lib/auth/permissions';
import { useSession } from '@/shared/lib/auth/SessionProvider';
import { useT } from '@/web-requirements/wr-08-multi-language';

import { AccessDenied } from './AccessDenied';
import styles from './RouteGuard.module.css';
import { useRoleLabel } from './useRoleLabel';

const PROFILE = '/user-access/profile';

/**
 * FR-01 role-based access on every logged-in page:
 *   - shows Access denied (S-13.11) when the role may not read this page
 *   - sends users who must change a temporary password to their profile first
 * The backend checks every request too; this only keeps the UI honest.
 */
export function RouteGuard({ children }: { children: ReactNode }) {
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useSession();
  const roleLabel = useRoleLabel(user?.role);

  const mustChange = Boolean(user?.mustChangePassword) && pathname !== PROFILE;
  useEffect(() => {
    if (mustChange) router.replace(`${PROFILE}?changePassword=1`);
  }, [mustChange, router]);

  if (loading || !user || mustChange) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        <span className={styles.spinner} aria-hidden="true" />
        <span>{t('common.loading')}</span>
      </div>
    );
  }

  if (!canOpenPath(user.permissions, pathname)) {
    return <AccessDenied roleLabel={roleLabel} area={areaForPath(pathname)} />;
  }

  return <>{children}</>;
}
