'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Callout } from '@/shared/components/ui/Callout';
import { USE_MOCK_API } from '@/shared/lib/api-client';
import { canOpenPath } from '@/shared/lib/auth/permissions';
import { useSession } from '@/shared/lib/auth/SessionProvider';
import { useT, useTranslateOr } from '@/web-requirements/wr-08-multi-language';

import { getDashboard } from '../api/dashboard.api';
import type { Dashboard } from '../types/dashboard.types';

import styles from './Dashboard.module.css';
import { KpiTile, WelcomeBanner, WidgetCard, type Label, type WidgetWords } from './Widgets';

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Morning / afternoon / evening in Sri Lanka time. */
function partOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', timeZone: 'Asia/Colombo' }).format(new Date()),
  );
  return hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
}

/**
 * WR-02 Role-based dashboard on login, laid out like the approved Option B example:
 * welcome banner → "At a glance" figures → charts, alerts and tables → quick actions.
 * Widgets change per role (S-01.4 note): Compliance sees permits & quota, Yard sees receipts
 * & stock, Sales sees orders & receivables, and so on. Customers use the portal instead (FR-42).
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
  const words: WidgetWords = {
    viewAll: t('common.viewAll'),
    trace: t('dashboard.trace'),
    critical: t('dashboard.critical'),
    comingWith: (req) => t('dashboard.comingWith', { requirement: req }),
    criticalCount: (n) => t('dashboard.criticalCount', { count: n }),
    updateCount: (n) => t(n === 1 ? 'dashboard.updateCountOne' : 'dashboard.updateCount', { count: n }),
  };

  if (failed) {
    return (
      <div className={styles.page}>
        <Callout tone="crit">{t('common.loadError')}</Callout>
      </div>
    );
  }

  if (!dashboard || !user) {
    return (
      <div className={styles.page} aria-busy="true">
        <div className={[styles.hero, styles.skeleton].join(' ')} />
        <div className={styles.kpis}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className={[styles.kpi, styles.skeleton].join(' ')} />
          ))}
        </div>
        <span className="sr-only" role="status">
          {t('common.loading')}
        </span>
      </div>
    );
  }

  // Only offer shortcuts to pages this role may open (FR-01).
  const quickActions = (dashboard.quickActions ?? []).filter((a) => canOpenPath(user.permissions, a.href));
  const firstName = user.fullName.split(/\s+/)[0];

  return (
    <div className={styles.page}>
      <PageHeader breadcrumb={[{ label: t('dashboard.home') }]} title={label(dashboard.title)} />

      <WelcomeBanner
        greeting={t(`dashboard.greeting.${partOfDay()}`, { name: firstName })}
        intro={dashboard.intro}
        action={quickActions[0]}
        label={label}
      />

      {dashboard.notice && (
        <div className={styles.notice}>
          <Callout tone="info">{label(dashboard.notice)}</Callout>
        </div>
      )}

      {dashboard.kpis.length > 0 && (
        <section aria-labelledby="at-a-glance">
          <div className={styles.sectionTitle}>
            <h2 id="at-a-glance">{t('dashboard.atAGlance')}</h2>
            {USE_MOCK_API && <span className={styles.sampleTag}>{t('dashboard.sampleData')}</span>}
          </div>
          <div className={styles.kpis} data-count={Math.min(dashboard.kpis.length, 6)}>
            {dashboard.kpis.map((k) => (
              <KpiTile key={k.label} kpi={k} label={label} />
            ))}
          </div>
        </section>
      )}

      <div className={styles.widgets}>
        {dashboard.widgets.map((w) => (
          <WidgetCard key={w.title} widget={w} label={label} words={words} quickActions={quickActions} />
        ))}
      </div>
    </div>
  );
}
