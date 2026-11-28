import type { ReactNode } from 'react';

import styles from './Badge.module.css';

/**
 * Status pill (Active, Locked, Expiring…). Tone uses the status token pairs.
 *   <Badge tone="ok">Active</Badge>  <Badge tone="crit">Locked</Badge>
 */
export type BadgeTone = 'ok' | 'warn' | 'crit' | 'neutral';

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return <span className={[styles.badge, styles[tone]].join(' ')}>{children}</span>;
}
