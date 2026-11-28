'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './LinkTabs.module.css';

/**
 * Tabs that are links to sibling pages (e.g. Users | Roles & permissions | Audit log).
 *   <LinkTabs label={t('admin.sections')} tabs={[{ href: '/user-access/user-management', label: t('users.title') }, …]} />
 */
export interface LinkTab {
  href: string;
  label: string;
}

export function LinkTabs({ tabs, label }: { tabs: LinkTab[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav className={styles.tabs} aria-label={label}>
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={[styles.tab, active && styles.active].filter(Boolean).join(' ')}
            aria-current={active ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
