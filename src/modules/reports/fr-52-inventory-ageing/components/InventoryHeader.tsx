'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';
import type { ViewState } from '../types';
import styles from './InventoryHeader.module.css';

interface InventoryHeaderProps {
  viewState: ViewState;
  onSimulateState?: (state: ViewState) => void;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
}

export function InventoryHeader({
  viewState,
  onSimulateState,
  onExportPdf,
  onExportExcel,
}: InventoryHeaderProps) {
  const isLoading = viewState === 'loading';

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.breadcrumb}>
          <span className={styles.crumbParent}>Reports</span>
          <span className={styles.crumbSeparator}>/</span>
          <span className={styles.crumbCurrent}>Inventory &amp; Ageing</span>
        </div>

        <div className={styles.topRight}>
          <div className={styles.timestampBadge}>
            Updated 13 Nov 2026, 10:32
          </div>

          {/* State simulator toolbar for reviewing all 4 wireframe states */}
          {onSimulateState && (
            <div className={styles.stateToolbar} aria-label="FR-52 Wireframe States Preview">
              <span className={styles.stateToolbarLabel}>States:</span>
              <button
                type="button"
                className={`${styles.stateButton} ${viewState === 'ready' ? styles.stateActive : ''}`}
                onClick={() => onSimulateState('ready')}
              >
                1. Ready
              </button>
              <button
                type="button"
                className={`${styles.stateButton} ${viewState === 'loading' ? styles.stateActive : ''}`}
                onClick={() => onSimulateState('loading')}
              >
                2. Loading
              </button>
              <button
                type="button"
                className={`${styles.stateButton} ${viewState === 'empty' ? styles.stateActive : ''}`}
                onClick={() => onSimulateState('empty')}
              >
                3. Empty
              </button>
              <button
                type="button"
                className={`${styles.stateButton} ${viewState === 'error' ? styles.stateActive : ''}`}
                onClick={() => onSimulateState('error')}
              >
                4. Error
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.titleRow}>
        <div>
          <h1 className={styles.title}>Inventory &amp; Ageing Report</h1>
          <p className={styles.subtitle}>
            Current stock of logs, work-in-progress and finished timber, with stock ageing.
          </p>
        </div>

        <div className={styles.actions}>
          <Link href="/reports/inventory-ageing/locations">
            <Button variant="secondary" leftIcon={<Icon name="grid" />}>
              Storage locations
            </Button>
          </Link>
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={onExportPdf}
            leftIcon={<Icon name="file" />}
          >
            Export PDF
          </Button>
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={onExportExcel}
            leftIcon={<Icon name="arrowUpRight" />}
          >
            Export Excel
          </Button>
        </div>
      </div>
    </header>
  );
}
