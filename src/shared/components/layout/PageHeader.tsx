import Link from 'next/link';
import type { ReactNode } from 'react';

import styles from './PageHeader.module.css';

/**
 * Top of every page (wireframes): breadcrumb, title, action buttons.
 *   <PageHeader breadcrumb={[{ label: t('nav.admin') }, { label: t('users.title') }]} title={t('users.title')}
 *     actions={<Button>{t('users.add')}</Button>} />
 */
export interface Crumb {
  label: string;
  href?: string;
}

export function PageHeader({
  title,
  breadcrumb,
  description,
  actions,
}: {
  title: string;
  breadcrumb?: Crumb[];
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className={styles.crumbs}>
              {breadcrumb.map((c, i) => (
                <li key={`${c.label}-${i}`}>
                  {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
