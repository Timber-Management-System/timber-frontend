'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

import { Icon, type IconName } from './Icon';
import styles from './RowMenu.module.css';

export interface RowMenuItem {
  label: string;
  icon: IconName;
  onSelect: () => void;
  danger?: boolean;
}

/**
 * The ••• actions menu at the end of a table row (e.g. View, Edit, Approve, Reject).
 * Arrow keys move between items, Escape closes and returns focus to the button.
 *
 *   <RowMenu label={t('common.moreActions', { name: row.reference })} items={[
 *     { label: t('common.view'), icon: 'eye', onSelect: () => open('view', row) },
 *   ]} />
 *
 * Pass only the actions the signed-in role may use (usePermission). If the list is empty,
 * nothing is shown.
 */
export function RowMenu({ label, items }: { label: string; items: RowMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    wrap.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  if (items.length === 0) return null;

  const onKeyDown = (e: ReactKeyboardEvent) => {
    const entries = [...(wrap.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])];
    const index = entries.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'Escape') {
      setOpen(false);
      button.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      entries[(index + 1) % entries.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      entries[(index - 1 + entries.length) % entries.length]?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className={styles.wrap} ref={wrap} onKeyDown={onKeyDown}>
      <button
        ref={button}
        type="button"
        className={styles.button}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="more" size={18} />
      </button>
      {open && (
        <div id={menuId} role="menu" className={styles.menu}>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={[styles.item, item.danger && styles.danger].filter(Boolean).join(' ')}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
