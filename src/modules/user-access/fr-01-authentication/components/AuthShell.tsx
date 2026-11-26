import type { ReactNode } from 'react';

import { Icon } from '@/shared/components/ui/Icon';
import { LanguageSwitcher } from '@/web-requirements/wr-08-multi-language';

import styles from './Auth.module.css';

/** Shared frame for the sign-in screens (S-01.1, S-01.2, S-01.3): brand, card, footer. */
export function AuthShell({
  title,
  intro,
  children,
  footerText,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  footerText: string;
}) {
  return (
    <div className={styles.shell}>
      <div className={styles.brand}>
        <span className={styles.mark} aria-hidden="true">
          <Icon name="leaf" size={22} />
        </span>
        <span className={styles.brandText}>
          <strong>TimberTrack</strong>
          <small>Timber Management System</small>
        </span>
      </div>

      <section className={styles.card} aria-labelledby="auth-title">
        <h1 id="auth-title" className={styles.title}>
          {title}
        </h1>
        {intro && <p className={styles.intro}>{intro}</p>}
        {children}
      </section>

      <LanguageSwitcher variant="links" />
      <p className={styles.footer}>{footerText}</p>
    </div>
  );
}
