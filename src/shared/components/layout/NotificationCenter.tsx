'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import { Icon, type IconName } from '@/shared/components/ui/Icon';
import {
  clearNotifications,
  listNotifications,
  markNotificationsRead,
  type AppNotification,
  type NotificationLevel,
} from '@/shared/lib/notifications.api';

import styles from './NotificationCenter.module.css';

/** Translator with {placeholder} support (pass `useT()` from WR-08). */
type Translate = (key: string, params?: Record<string, string | number>) => string;
type Filter = 'all' | 'unread' | 'critical';

const ICON: Record<NotificationLevel, IconName> = { critical: 'blocked', warn: 'warning', ok: 'check', info: 'info' };

function ago(iso: string, t: Translate): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return t('notifications.time.justNow');
  if (minutes < 60) return t('notifications.time.minutes', { n: minutes });
  const hours = Math.round(minutes / 60);
  if (hours < 24) return t('notifications.time.hours', { n: hours });
  const days = Math.round(hours / 24);
  return days === 1 ? t('time.yesterday') : t('notifications.time.days', { n: days });
}

/**
 * Bell + notification panel in the top bar (approved Option B notification centre):
 * unread count, All / Unread / Critical tabs, mark all as read, clear, and a link to the full list.
 */
export function NotificationCenter({ t }: { t: Translate }) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const panelId = useId();
  const titleId = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const bell = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;
    listNotifications()
      .then((list) => {
        if (active) setItems(list);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        bell.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const unread = items.filter((n) => !n.read);
  const critical = unread.filter((n) => n.level === 'critical').length;
  const shown = items.filter((n) => (filter === 'all' ? true : filter === 'unread' ? !n.read : n.level === 'critical'));
  const countText = unread.length > 9 ? '9+' : String(unread.length);

  const markRead = (ids: string[] | 'all') => {
    setItems((list) => list.map((n) => (ids === 'all' || ids.includes(n.id) ? { ...n, read: true } : n)));
    void markNotificationsRead(ids);
  };

  return (
    <div className={styles.wrap} ref={wrap}>
      <button
        ref={bell}
        type="button"
        className={styles.bell}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={
          critical
            ? t('notifications.bellCritical', { count: unread.length, critical })
            : t('notifications.bell', { count: unread.length })
        }
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="bell" size={18} />
        {unread.length > 0 && (
          <span
            className={[styles.count, critical === 0 && styles.countWarn].filter(Boolean).join(' ')}
            aria-hidden="true"
          >
            {countText}
          </span>
        )}
      </button>

      {open && (
        <div id={panelId} className={styles.panel} role="dialog" aria-labelledby={titleId}>
          <div className={styles.head}>
            <div>
              <h2 id={titleId} className={styles.title}>
                {t('notifications.title')}
              </h2>
              <p className={styles.sub}>
                {unread.length === 0
                  ? t('notifications.caughtUp')
                  : critical
                    ? t('notifications.unreadCritical', { count: unread.length, critical })
                    : t('notifications.unread', { count: unread.length })}
              </p>
            </div>
            {unread.length > 0 && (
              <button type="button" className={styles.link} onClick={() => markRead('all')}>
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          <div className={styles.tools}>
            <div className={styles.tabs} role="group" aria-label={t('notifications.filter')}>
              {(['all', 'unread', 'critical'] as Filter[]).map((f) => (
                <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                  {t(`notifications.tabs.${f}`)}
                </button>
              ))}
            </div>
            {items.length > 0 && (
              <button
                type="button"
                className={styles.link}
                onClick={() => {
                  setItems([]);
                  void clearNotifications();
                }}
              >
                {t('notifications.clear')}
              </button>
            )}
          </div>

          <ul className={styles.list} aria-live="polite">
            {shown.length === 0 && (
              <li className={styles.empty}>
                <Icon name="inbox" size={28} />
                <span>{t(`notifications.empty.${filter}`)}</span>
              </li>
            )}
            {shown.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.href ?? '/audit-admin/notifications'}
                  className={[styles.item, styles[n.level], !n.read && styles.unread].filter(Boolean).join(' ')}
                  onClick={() => {
                    if (!n.read) markRead([n.id]);
                    setOpen(false);
                  }}
                >
                  <span className={styles.icon} aria-hidden="true">
                    <Icon name={ICON[n.level]} size={17} />
                  </span>
                  <span className={styles.body}>
                    <b>{n.title}</b>
                    <span className={styles.message}>{n.message}</span>
                    <span className={styles.meta}>
                      <span className={styles.level}>{t(`notifications.level.${n.level}`)}</span>
                      <time dateTime={n.createdAt}>{ago(n.createdAt, t)}</time>
                      {!n.read && <span className="sr-only">{t('notifications.unreadMark')}</span>}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.foot}>
            <Link href="/audit-admin/notifications" className={styles.link} onClick={() => setOpen(false)}>
              {t('notifications.viewAll')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
