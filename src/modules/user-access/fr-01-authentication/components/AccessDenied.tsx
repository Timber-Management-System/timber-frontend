'use client';

import Link from 'next/link';

import { buttonClassName } from '@/shared/components/ui/Button';
import type { Area } from '@/shared/lib/auth/permissions';
import { useT } from '@/web-requirements/wr-08-multi-language';

import styles from './AccessDenied.module.css';

/**
 * S-13.11 Access denied (FR-01). Shown when a role opens a page it may not read.
 * The backend records the attempt in the audit log (FR-03).
 */
export function AccessDenied({ roleLabel, area }: { roleLabel: string; area: Area | null }) {
  const t = useT();
  return (
    <section className={styles.wrap} aria-labelledby="denied-title">
      <p className={styles.code} aria-hidden="true">
        403
      </p>
      <h1 id="denied-title" className={styles.title}>
        {t('auth.denied.title')}
      </h1>
      <p className={styles.text}>
        {t('auth.denied.text', { role: roleLabel, area: area ? t(`areas.${area}`) : t('auth.denied.thisPage') })}
      </p>
      <Link href="/dashboard" className={buttonClassName({ variant: 'secondary' })}>
        {t('auth.denied.back')}
      </Link>
    </section>
  );
}
