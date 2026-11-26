'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';

import styles from './Dialog.module.css';
import { Icon } from './Icon';

/**
 * Modal dialog (wireframe section 18 "Manage popups"). Uses the native <dialog> element, so focus
 * is trapped and Escape closes it. Closing by clicking the backdrop is on by default.
 *
 *   <Dialog open={open} onClose={() => setOpen(false)} title={t('users.addUser')}
 *     footer={<><Button variant="secondary" onClick={close}>{t('common.cancel')}</Button><Button>{t('common.save')}</Button></>}>
 *     …form fields…
 *   </Dialog>
 */
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeLabel?: string;
  /** Set false for dialogs that must not close by accident (e.g. while saving). */
  dismissible?: boolean;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeLabel = 'Close',
  dismissible = true,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  // Keep the native dialog in sync with the `open` prop.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={[styles.dialog, styles[size]].join(' ')}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => {
        e.preventDefault();
        if (dismissible) onClose();
      }}
      onClick={(e) => {
        if (dismissible && e.target === e.currentTarget) onClose();
      }}
    >
      {open && (
        <div className={styles.panel}>
          <header className={styles.head}>
            <div>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              {description && (
                <p id={descId} className={styles.description}>
                  {description}
                </p>
              )}
            </div>
            {dismissible && (
              <button type="button" className={styles.close} aria-label={closeLabel} onClick={onClose}>
                <Icon name="close" size={18} />
              </button>
            )}
          </header>
          {children && <div className={styles.body}>{children}</div>}
          {footer && <footer className={styles.foot}>{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}
