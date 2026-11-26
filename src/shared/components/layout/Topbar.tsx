'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react';

import { Icon } from '@/shared/components/ui/Icon';

import type { SidebarUser, Translate } from './Sidebar';
import styles from './Topbar.module.css';

/**
 * Top bar of every logged-in page (wireframes S-01.4 / S-01.5):
 * global search (WR-03) · online status (WR-05) · language (WR-08) · notifications (FR-56) · account.
 * Text comes in through `t`, and the language switch through `languageSwitcher`, so this shared
 * component never imports a module.
 */
export interface TopbarUser extends SidebarUser {
  /** Site / team, shown in the account menu header. */
  site?: string;
}

export interface TopbarProps {
  user: TopbarUser | null;
  t: Translate;
  languageSwitcher?: ReactNode;
  /** The bell + notification panel (NotificationCenter). Falls back to a plain link. */
  notifications?: ReactNode;
  onSignOut: () => void;
}

function subscribeOnline(onChange: () => void) {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

function useOnline(): boolean {
  return useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  );
}

export function Topbar({ user, t, languageSwitcher, notifications, onSignOut }: TopbarProps) {
  const router = useRouter();
  const online = useOnline();
  const [query, setQuery] = useState('');

  // Ctrl+K / Cmd+K jumps to the global search (as in the wireframes and Option B).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function search(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  }

  return (
    <header className={styles.bar}>
      <form className={styles.search} role="search" onSubmit={search}>
        <Icon name="search" size={16} className={styles.searchIcon} />
        <label className="sr-only" htmlFor="global-search">
          {t('topbar.search', 'Search')}
        </label>
        <input
          id="global-search"
          type="search"
          className={styles.searchInput}
          placeholder={t('topbar.searchPlaceholder', 'Search logs, permits, customers, orders…')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-keyshortcuts="Control+K"
        />
        <kbd className={styles.kbd} aria-hidden="true">
          Ctrl K
        </kbd>
      </form>
      <Link href="/search" className={styles.searchMobile} aria-label={t('topbar.search', 'Search')}>
        <Icon name="search" size={18} />
      </Link>

      <div className={styles.right}>
        <span className={[styles.status, !online && styles.offline].filter(Boolean).join(' ')} role="status">
          <span className={styles.dot} aria-hidden="true" />
          {online ? t('topbar.online', 'Online') : t('topbar.offline', 'Offline')}
        </span>
        {languageSwitcher}
        {notifications ?? (
          <Link
            href="/audit-admin/notifications"
            className={styles.iconButton}
            aria-label={t('topbar.notifications', 'Notifications')}
          >
            <Icon name="bell" size={18} />
          </Link>
        )}
        {user && <AccountMenu user={user} t={t} onSignOut={onSignOut} />}
      </div>
    </header>
  );
}

function AccountMenu({ user, t, onSignOut }: { user: TopbarUser; t: Translate; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    wrap.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={styles.account} ref={wrap}>
      <button
        type="button"
        className={styles.accountButton}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.avatar} aria-hidden="true">
          {user.initials}
        </span>
        <span className={styles.who}>
          <b>{user.name}</b>
          <small>{user.role}</small>
        </span>
      </button>
      {open && (
        <div id={menuId} role="menu" className={styles.menu} aria-label={user.name}>
          <div className={styles.menuHead}>
            <span className={styles.avatar} aria-hidden="true">
              {user.initials}
            </span>
            <span>
              <b>{user.name}</b>
              <small>{user.site ? `${user.role} · ${user.site}` : user.role}</small>
            </span>
          </div>
          <Link href="/user-access/profile" role="menuitem" className={styles.menuItem} onClick={() => setOpen(false)}>
            <Icon name="user" size={16} />
            {t('topbar.profile', 'My profile')}
          </Link>
          <Link
            href="/user-access/profile#notifications"
            role="menuitem"
            className={styles.menuItem}
            onClick={() => setOpen(false)}
          >
            <Icon name="bell" size={16} />
            {t('topbar.notificationPrefs', 'Notification preferences')}
          </Link>
          <div className={styles.menuSep} role="separator" />
          <button
            type="button"
            role="menuitem"
            className={[styles.menuItem, styles.danger].join(' ')}
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
          >
            <Icon name="logout" size={16} />
            {t('topbar.signOut', 'Sign out')}
          </button>
        </div>
      )}
    </div>
  );
}
