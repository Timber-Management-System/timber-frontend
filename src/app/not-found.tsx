import Link from 'next/link';

import { buttonClassName } from '@/shared/components/ui/Button';

import styles from './status.module.css';

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>The page you are looking for does not exist or has moved.</p>
      <Link href="/dashboard" className={buttonClassName({ variant: 'secondary' })}>
        Back to dashboard
      </Link>
    </div>
  );
}
