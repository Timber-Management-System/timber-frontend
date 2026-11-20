import type { ReactNode } from 'react';

import { Sidebar } from '@/shared/components/layout/Sidebar';
import { NAVIGATION } from '@/shared/config/navigation';

import styles from './layout.module.css';

/** Shell for every logged-in page: sidebar (Option B) + page content. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <Sidebar groups={NAVIGATION} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
