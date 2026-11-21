'use client';

import { Button } from '@/shared/components/ui/Button';

import styles from './status.module.css';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className={styles.wrap} role="alert">
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.text}>Please try again. If it keeps happening, tell an administrator.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
