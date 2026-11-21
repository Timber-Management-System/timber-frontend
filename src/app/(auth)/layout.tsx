import type { ReactNode } from 'react';

import styles from './layout.module.css';

/** Login, password reset and MFA pages (FR-01): centred card, no sidebar. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <main className={styles.main}>{children}</main>;
}
