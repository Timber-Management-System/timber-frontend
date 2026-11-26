'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Callout } from '@/shared/components/ui/Callout';
import { useSession } from '@/shared/lib/auth/SessionProvider';
import { useT, useTranslateOr } from '@/web-requirements/wr-08-multi-language';

import { getDashboard } from '../api/dashboard.api';
import type { Dashboard } from '../types/dashboard.types';

import styles from './Dashboard.module.css';
import { KpiTile, WidgetCard, type Label } from './Widgets';

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * WR-02 Role-based dashboard on login. Widgets change per role (S-01.4 note): Compliance sees
 * permits & quota, Yard sees receipts & stock, Sales sees orders & receivables, and so on.
 * Customers use the portal instead (FR-42).
 */
export function RoleDashboard() {
  const t = useT();
  const tOr = useTranslateOr();
  const router = useRouter();
  const { user } = useSession();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [failed, setFailed] = useState(false);
  const isCustomer = user?.role === 'CUSTOMER';

  useEffect(() => {
    if (!user) return;
    if (isCustomer) {
      router.replace('/portal');
      return;
    }
    let active = true;
    getDashboard(user.role, user.permissions)
      .then((d) => {
        if (active) setDashboard(d);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [user, isCustomer, router]);

  const label: Label = (english) => tOr(`dash.${slug(english)}`, english);

  if (failed) {
    return (
      <div className={styles.page}>
        <Callout tone="crit">{t('common.loadError')}</Callout>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className={styles.page} aria-busy="true">
        <div className={styles.skeletonTitle} />
        <div className={styles.kpis}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={[styles.kpi, styles.skeleton].join(' ')} />
          ))}
        </div>
        <span className="sr-only" role="status">
          {t('common.loading')}
        </span>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader breadcrumb={[{ label: t('dashboard.home') }]} title={label(dashboard.title)} />
      {dashboard.notice && (
        <div className={styles.notice}>
          <Callout tone="info">{label(dashboard.notice)}</Callout>
        </div>
      )}
      {dashboard.kpis.length > 0 && (
        <section className={styles.kpis} aria-label={t('dashboard.keyFigures')}>
          {dashboard.kpis.map((k) => (
            <KpiTile key={k.label} kpi={k} label={label} />
          ))}
        </section>
      )}
      <div className={styles.widgets}>
        {dashboard.widgets.map((w) => (
          <WidgetCard
            key={w.title}
            widget={w}
            label={label}
            words={{
              viewAll: t('common.viewAll'),
              trace: t('dashboard.trace'),
              comingWith: (req) => t('dashboard.comingWith', { requirement: req }),
            }}
          />
        ))}
      </div>
    </div>
  );
}
