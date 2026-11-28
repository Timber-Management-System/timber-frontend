import type { ReactNode } from 'react';

import styles from './Callout.module.css';
import { Icon, type IconName } from './Icon';

/**
 * Inline message box: errors, warnings, success, info.
 *   <Callout tone="crit">{t('auth.errors.ACCOUNT_LOCKED')}</Callout>
 */
export type CalloutTone = 'ok' | 'warn' | 'crit' | 'info';

const ICONS: Record<CalloutTone, IconName> = { ok: 'check', warn: 'warning', crit: 'blocked', info: 'info' };

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: CalloutTone;
  title?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={[styles.callout, styles[tone]].join(' ')} role={tone === 'crit' ? 'alert' : 'status'}>
      <Icon name={ICONS[tone]} size={18} className={styles.icon} />
      <div className={styles.body}>
        {title && <strong className={styles.title}>{title}</strong>}
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
