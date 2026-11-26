'use client';

/**
 * TEMPLATE – the main screen of an FR. Build it from the Figma wireframe for your FR
 * (docs/wireframes/), using the shared Button/Icon and the --tt-* colour tokens only.
 * User-facing text: replace the English strings with i18n keys once the i18n library is chosen (WR-08).
 */
import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';

import { useExportSales } from '../hooks/useExportSales';
import type { ExportSaleStatus } from '../types/export-sales.types';

import styles from './ExportSalesPage.module.css';

const STATUS_CLASS: Record<ExportSaleStatus, string> = {
  PENDING: styles.warn,
  APPROVED: styles.ok,
  REJECTED: styles.crit,
};

export function ExportSalesPage() {
  const { items, loading, error } = useExportSales();

  return (
    <section className={styles.page} aria-labelledby="export-sales-title">
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>FR-43</p>
          <h1 id="export-sales-title" className={styles.title}>
            Export Sales
          </h1>
        </div>
        <Button leftIcon={<Icon name="plus" />}>New export order</Button>Export Sales
      </header>

      <div className={styles.card}>
        {loading && <p className={styles.muted}>Loading…</p>}
        {Boolean(error) && <p role="alert">Could not load the items. Please try again.</p>}
        {!loading && !error && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Reference</th>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className={styles.ref}>{item.reference}</td>
                  <td>{item.name}</td>
                  <td>
                    <span className={`${styles.status} ${STATUS_CLASS[item.status]}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
