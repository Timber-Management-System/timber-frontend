'use client';

import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';
import type { InventorySummary } from '../types';
import styles from './StockSummaryCards.module.css';

interface StockSummaryCardsProps {
  summary: InventorySummary | null;
  isLoading?: boolean;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
}

export function StockSummaryCards({
  summary,
  isLoading = false,
  onExportPdf,
  onExportExcel,
}: StockSummaryCardsProps) {
  const cards = [
    {
      id: 'raw-logs',
      label: 'Raw logs',
      value: summary ? `${summary.rawLogsCount}` : '—',
      badge: 'Arrival logs in yard',
    },
    {
      id: 'wip',
      label: 'In processing',
      value: summary ? `${summary.wipCount}` : '—',
      badge: 'At sawmills and bays',
    },
    {
      id: 'finished',
      label: 'Finished timber',
      value: summary ? `${summary.finishedVolumeM3} m³` : '—',
      badge: 'Seasoned & graded racks',
    },
    {
      id: 'reserved',
      label: 'Reserved',
      value: summary ? `${summary.reservedVolumeM3} m³` : '—',
      badge: 'Allocated to orders',
      highlight: true,
    },
  ];

  return (
    <section className={styles.wrapper} aria-label="Stock Overview KPI">
      <div className={styles.headerRow}>
        <h2 className={styles.sectionTitle}>Stock overview</h2>
        <div className={styles.headerActions}>
          <Button
            variant="secondary"
            size="sm"
            disabled={isLoading}
            onClick={onExportPdf}
            leftIcon={<Icon name="file" size={14} />}
          >
            Export PDF
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={isLoading}
            onClick={onExportExcel}
            leftIcon={<Icon name="arrowUpRight" size={14} />}
          >
            Export Excel
          </Button>
        </div>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${styles.card} ${card.highlight ? styles.cardHighlight : ''}`}
          >
            <span className={styles.label}>{card.label}</span>
            {isLoading ? (
              <div className={styles.skeletonValue} />
            ) : (
              <div className={styles.value}>{card.value}</div>
            )}
            <span className={styles.badge}>{card.badge}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
