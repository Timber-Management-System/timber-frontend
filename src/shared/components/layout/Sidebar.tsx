'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from 'react';

import { Icon, type IconName } from '@/shared/components/ui/Icon';

import styles from './Sidebar.module.css';

/**
 * TimberTrack sidebar – navigation Option B (sub-pages open inside the sidebar).
 *
 *   Desktop  one module open at a time (accordion); the active page is highlighted.
 *   ≤760px   collapses to an icon rail; tapping a module opens its pages in a flyout.
 *
 * Usage (see src/app/(app)/layout.tsx):
 *   import { Sidebar } from '@/shared/components/layout/Sidebar';
 *   import { NAVIGATION } from '@/shared/config/navigation';
 *
 *   <div style={{ display: 'flex', minHeight: '100vh' }}>
 *     <Sidebar groups={NAVIGATION} user={{ name, role, initials }} badges={{ 'licence.expiry-alerts': 3 }} t={t} />
 *     <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
 *   </div>
 *
 * The menu itself lives in src/shared/config/navigation.ts – edit that file, not this one, to add pages.
 */

export interface NavLink {
  /** Unique id, also used as the i18n key `nav.<id>.label` and as the badge key. */
  id: string;
  /** English fallback label. */
  label: string;
  href: string;
  /** Requirement ID from the proposal, e.g. 'FR-05'. For reference only. */
  requirement?: string;
  /**
   * Permission area that decides who sees this link in the menu (e.g. 'users-settings').
   * Leave out to use the area of the page itself.
   */
  area?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  /** Set for a single page (e.g. Dashboard). Leave out when the item has children. */
  href?: string;
  requirement?: string;
  children?: NavLink[];
}

export interface NavGroup {
  id: string;
  /** Section heading (e.g. "Operations"). Leave out for the top group. */
  label?: string;
  items: NavItem[];
}

export interface SidebarUser {
  name: string;
  role: string;
  initials: string;
}

/** Translation function: return the text for `key`, or `fallback` if none exists. */
export type Translate = (key: string, fallback: string) => string;

export interface SidebarProps {
  groups: NavGroup[];
  user?: SidebarUser;
  /** Live counts shown as badges, keyed by item or link id. A module shows the sum of its pages. */
  badges?: Record<string, number>;
  t?: Translate;
}

/* Keep in sync with the @media rule in Sidebar.module.css */
const RAIL_QUERY = '(max-width: 760px)';

const fallbackOnly: Translate = (_key, fallback) => fallback;
const cx = (...names: Array<string | false | null | undefined>) => names.filter(Boolean).join(' ');

/** True while the media query matches. On the server it is always false (desktop layout). */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** The longest href that matches the current path wins, so /reports/permits beats /reports. */
function findActive(groups: NavGroup[], pathname: string) {
  let href: string | null = null;
  let parentId: string | null = null;
  for (const group of groups) {
    for (const item of group.items) {
      const hrefs = item.children ? item.children.map((c) => c.href) : item.href ? [item.href] : [];
      for (const candidate of hrefs) {
        const matches = pathname === candidate || pathname.startsWith(`${candidate}/`);
        if (matches && (!href || candidate.length > href.length)) {
          href = candidate;
          parentId = item.children ? item.id : null;
        }
      }
    }
  }
  return { activeHref: href, activeParent: parentId };
}

interface FlyoutState {
  id: string;
  top: number;
  left: number;
}

export function Sidebar({ groups, user, badges = {}, t = fallbackOnly }: SidebarProps) {
  const pathname = usePathname() ?? '/';
  const { activeHref, activeParent } = useMemo(() => findActive(groups, pathname), [groups, pathname]);
  const rail = useMediaQuery(RAIL_QUERY);

  const [expanded, setExpanded] = useState<string | null>(activeParent);
  const [flyout, setFlyout] = useState<FlyoutState | null>(null);

  const asideRef = useRef<HTMLElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const uid = useId();
  const flyoutId = `${uid}-flyout`;

  const label = (id: string, fallback: string) => t(`nav.${id}.label`, fallback);
  const badgeFor = (item: NavItem) =>
    badges[item.id] ?? (item.children ?? []).reduce((sum, c) => sum + (badges[c.id] ?? 0), 0);

  // Reset during render (React's recommended pattern, no extra effect):
  // after navigating, open the active module and close any flyout; switching
  // between phone and desktop width also closes the flyout.
  // Also reacts when the active module changes without navigating (e.g. the menu loads after sign-in).
  const [seen, setSeen] = useState({ pathname, rail, activeParent });
  if (seen.pathname !== pathname || seen.rail !== rail || seen.activeParent !== activeParent) {
    setSeen({ pathname, rail, activeParent });
    if (seen.pathname !== pathname || seen.activeParent !== activeParent) setExpanded(activeParent);
    if (seen.pathname !== pathname || seen.rail !== rail) setFlyout(null);
  }

  // Flyout: keep it on screen, focus the first page, close on outside click / Escape / resize / scroll.
  useEffect(() => {
    if (!flyout) return;
    const el = flyoutRef.current;
    if (el) {
      const maxTop = window.innerHeight - el.offsetHeight - 8;
      el.style.top = `${Math.max(8, Math.min(flyout.top, maxTop))}px`;
      el.querySelector<HTMLAnchorElement>('a')?.focus();
    }
    const trigger = triggers.current.get(flyout.id);
    const close = () => setFlyout(null);
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (flyoutRef.current?.contains(target) || trigger?.contains(target)) return;
      close();
    };
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      trigger?.focus();
      close();
    };
    const aside = asideRef.current;
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', close);
    aside?.addEventListener('scroll', close);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', close);
      aside?.removeEventListener('scroll', close);
    };
  }, [flyout]);

  function openFlyout(item: NavItem, button: HTMLButtonElement) {
    const side = asideRef.current?.getBoundingClientRect();
    const rect = button.getBoundingClientRect();
    setFlyout({ id: item.id, top: rect.top - 6, left: (side?.right ?? rect.right) + 8 });
  }

  function toggle(item: NavItem, button: HTMLButtonElement) {
    if (rail) {
      if (flyout?.id === item.id) setFlyout(null);
      else openFlyout(item, button);
      return;
    }
    setExpanded((current) => (current === item.id ? null : item.id));
  }

  function onParentKeyDown(e: KeyboardEvent<HTMLButtonElement>, item: NavItem) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (rail) openFlyout(item, e.currentTarget);
      else setExpanded(item.id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (rail) setFlyout(null);
      else setExpanded(null);
    }
  }

  function renderItem(item: NavItem) {
    const text = label(item.id, item.label);
    const count = badgeFor(item);

    if (!item.children) {
      const active = item.href === activeHref;
      return (
        <Link
          href={item.href ?? '#'}
          className={cx(styles.item, active && styles.active, count > 0 && styles.hasBadge)}
          aria-current={active ? 'page' : undefined}
          title={rail ? text : undefined}
        >
          <Icon name={item.icon} />
          <span className={styles.label}>{text}</span>
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </Link>
      );
    }

    const subId = `${uid}-sub-${item.id}`;
    const open = rail ? flyout?.id === item.id : expanded === item.id;
    return (
      <>
        <button
          type="button"
          ref={(el) => {
            if (el) triggers.current.set(item.id, el);
            else triggers.current.delete(item.id);
          }}
          className={cx(styles.item, activeParent === item.id && styles.parentActive, count > 0 && styles.hasBadge)}
          aria-expanded={open}
          aria-controls={rail ? flyoutId : subId}
          title={rail ? text : undefined}
          onClick={(e) => toggle(item, e.currentTarget)}
          onKeyDown={(e) => onParentKeyDown(e, item)}
        >
          <Icon name={item.icon} />
          <span className={styles.label}>{text}</span>
          {count > 0 && <span className={styles.badge}>{count}</span>}
          <Icon name="chevronRight" size={14} className={styles.chevron} />
        </button>
        {!rail && open && (
          <ul id={subId} className={styles.subnav} aria-label={text}>
            {item.children.map((link) => {
              const active = link.href === activeHref;
              const linkCount = badges[link.id] ?? 0;
              return (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={cx(styles.subLink, active && styles.subActive)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span>{label(link.id, link.label)}</span>
                    {linkCount > 0 && <em className={styles.subBadge}>{linkCount}</em>}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </>
    );
  }

  const flyoutItem = flyout ? groups.flatMap((g) => g.items).find((i) => i.id === flyout.id) : undefined;

  return (
    <aside ref={asideRef} className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">
          <Icon name="leaf" size={22} />
        </span>
        <span className={styles.brandText}>
          <strong>TimberTrack</strong>
          <small>{t('nav.brand.tagline', 'Management system')}</small>
        </span>
      </div>

      <nav aria-label={t('nav.aria', 'Main navigation')}>
        {groups.map((group) => {
          const headingId = `${uid}-group-${group.id}`;
          return (
            <div key={group.id} className={styles.group}>
              {group.label && (
                <div id={headingId} className={styles.groupLabel}>
                  {t(`nav.group.${group.id}`, group.label)}
                </div>
              )}
              <ul className={styles.list} aria-labelledby={group.label ? headingId : undefined}>
                {group.items.map((item) => (
                  <li key={item.id}>{renderItem(item)}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      {user && (
        <div className={styles.bottom}>
          <div className={styles.profile} title={`${user.name} · ${user.role}`}>
            <span className={styles.avatar} aria-hidden="true">
              {user.initials}
            </span>
            <span className={styles.profileText}>
              <b>{user.name}</b>
              <small>{user.role}</small>
            </span>
          </div>
        </div>
      )}

      {flyout && flyoutItem?.children && (
        <div ref={flyoutRef} id={flyoutId} className={styles.flyout} style={{ top: flyout.top, left: flyout.left }}>
          <div className={styles.flyoutHead}>
            <span className={styles.flyoutIcon} aria-hidden="true">
              <Icon name={flyoutItem.icon} />
            </span>
            <span>
              <b>{label(flyoutItem.id, flyoutItem.label)}</b>
              <small>{t('nav.pageCount', '{n} pages').replace('{n}', String(flyoutItem.children.length))}</small>
            </span>
          </div>
          <ul className={styles.flyoutList} aria-label={label(flyoutItem.id, flyoutItem.label)}>
            {flyoutItem.children.map((link) => {
              const active = link.href === activeHref;
              const linkCount = badges[link.id] ?? 0;
              return (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={cx(styles.flyoutLink, active && styles.flyoutActive)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span>{label(link.id, link.label)}</span>
                    {linkCount > 0 && <span className={styles.flyoutBadge}>{linkCount}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
