import type { ReactNode } from 'react';

import styles from './Card.module.css';

/**
 * Content card (cream surface, border, soft shadow).
 *   <Card title={t('dash.alerts')} actions={<Button variant="ghost" size="sm">{t('common.viewAll')}</Button>}>…</Card>
 */
export interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  /** No inner padding (e.g. for a full-width table). */
  flush?: boolean;
  className?: string;
  as?: 'section' | 'div';
}

export function Card({ title, subtitle, actions, children, flush, className, as: Tag = 'section' }: CardProps) {
  return (
    <Tag className={[styles.card, flush && styles.flush, className].filter(Boolean).join(' ')}>
      {(title || actions) && (
        <header className={styles.head}>
          <div>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      {children}
    </Tag>
  );
}
