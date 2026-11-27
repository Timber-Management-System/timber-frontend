'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';
import type { StockItem, ViewState } from '../types';
import styles from './StockTable.module.css';

interface StockTableProps {
  items: StockItem[];
  viewState: ViewState;
  errorMessage?: string | null;
  totalItems?: number;
  totalVolumeM3?: number;
  reservedVolumeM3?: number;
  onResetFilters: () => void;
  onRetry: () => void;
  onSelectItem?: (item: StockItem) => void;
}

export function StockTable({
  items,
  viewState,
  errorMessage,
  totalItems = 248,
  totalVolumeM3 = 1240.0,
  reservedVolumeM3 = 120.0,
  onResetFilters,
  onRetry,
  onSelectItem,
}: StockTableProps) {
  const isLoading = viewState === 'loading';
  const isEmpty = viewState === 'empty' || (!isLoading && items.length === 0);
  const isError = viewState === 'error';

  const getStatusClass = (status: StockItem['status']) => {
    switch (status) {
      case 'Available':
        return styles.statusAvailable;
      case 'Reserved':
        return styles.statusReserved;
      case 'In processing':
        return styles.statusProcessing;
      case 'Low stock':
        return styles.statusLowStock;
      case 'Damaged':
        return styles.statusDamaged;
      default:
        return '';
    }
  };

  return (
    <div className={styles.tableCard}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Stock details</h2>
        <span className={styles.itemCountBadge}>
          {isLoading ? '...' : `${items.length} items`}
        </span>
      </div>

      {/* ERROR STATE */}
      {isError && (
        <div className={styles.errorState} role="alert">
          <div className={styles.errorIcon}>
            <Icon name="warning" />
          </div>
          <div className={styles.errorContent}>
            <h3 className={styles.errorTitle}>Unable to load stock records</h3>
            <p className={styles.errorMessage}>
              {errorMessage || 'A network error occurred while communicating with the inventory service.'}
            </p>
            <div className={styles.errorAction}>
              <Button variant="secondary" onClick={onRetry} leftIcon={<Icon name="sliders" />}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isError && isEmpty && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Icon name="search" />
          </div>
          <h3 className={styles.emptyTitle}>No stock items found</h3>
          <p className={styles.emptyMessage}>
            No timber or logs match your current filter criteria. Try adjusting your filters or resetting them.
          </p>
          <Button variant="secondary" onClick={onResetFilters}>
            Clear all filters
          </Button>
        </div>
      )}

      {/* TABLE DATA & SKELETON */}
      {!isError && !isEmpty && (
        <>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <colgroup>
                <col style={{ width: '11%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '6%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '7%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Item code</th>
                  <th>Type</th>
                  <th>Species</th>
                  <th>Grade</th>
                  <th>Size</th>
                  <th>Location</th>
                  <th>Reference</th>
                  <th className={styles.alignRight}>Volume (m³)</th>
                  <th className={styles.alignRight}>Age (days)</th>
                  <th>Status</th>
                  <th className={styles.alignCenter}>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={`skeleton-row-${idx}`}>
                        <td>
                          <div className={styles.skeletonCell} style={{ width: '90px' }} />
                        </td>
                        <td>
                          <div className={styles.skeletonCell} style={{ width: '80px' }} />
                        </td>
                        <td>
                          <div className={styles.skeletonCell} style={{ width: '60px' }} />
                        </td>
                        <td>
                          <div className={styles.skeletonCell} style={{ width: '30px' }} />
                        </td>
                        <td>
                          <div className={styles.skeletonCell} style={{ width: '70px' }} />
                        </td>
                        <td>
                          <div className={styles.skeletonCell} style={{ width: '60px' }} />
                        </td>
                        <td>
                          <div className={styles.skeletonCell} style={{ width: '95px' }} />
                        </td>
                        <td className={styles.alignRight}>
                          <div className={styles.skeletonCell} style={{ width: '45px', marginLeft: 'auto' }} />
                        </td>
                        <td className={styles.alignRight}>
                          <div className={styles.skeletonCell} style={{ width: '35px', marginLeft: 'auto' }} />
                        </td>
                        <td>
                          <div className={styles.skeletonCell} style={{ width: '65px' }} />
                        </td>
                        <td className={styles.alignCenter}>
                          <div className={styles.skeletonCell} style={{ width: '50px', margin: '0 auto' }} />
                        </td>
                      </tr>
                    ))
                  : items.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => onSelectItem?.(item)}
                        className={styles.row}
                      >
                        <td className={styles.itemCode}>{item.itemCode}</td>
                        <td>{item.type}</td>
                        <td>{item.species}</td>
                        <td>{item.grade}</td>
                        <td>{item.size}</td>
                        <td>{item.location}</td>
                        <td className={styles.refCode}>{item.reference}</td>
                        <td className={`${styles.alignRight} ${styles.tabularNum}`}>
                          {item.quantityM3.toFixed(3)}
                        </td>
                        <td className={`${styles.alignRight} ${styles.tabularNum}`}>
                          <span
                            className={
                              item.ageDays > 90
                                ? styles.ageCritical
                                : item.ageDays > 60
                                ? styles.ageWarning
                                : styles.ageNormal
                            }
                          >
                            {item.ageDays}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.statusPill} ${getStatusClass(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className={styles.alignCenter}>
                          <Link
                            href={`/reports/inventory-ageing/${item.id}`}
                            className={styles.viewLink}
                            onClick={(e) => e.stopPropagation()}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Footer summary bar with pagination matching wireframe */}
          <div className={styles.footerSummaryBar}>
            <div className={styles.footerMetrics}>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Total items</span>
                <span className={styles.metricValue}>{totalItems}</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Total volume</span>
                <span className={styles.metricValue}>{totalVolumeM3.toLocaleString()} m³</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Reserved</span>
                <span className={styles.metricValue}>{reservedVolumeM3.toFixed(1)} m³</span>
              </div>
            </div>

            <div className={styles.pagination} aria-label="Table pagination">
              <button type="button" className={styles.pageBtn} disabled>
                Prev
              </button>
              <button type="button" className={`${styles.pageBtn} ${styles.pageBtnActive}`}>
                1
              </button>
              <button type="button" className={styles.pageBtn}>
                2
              </button>
              <button type="button" className={styles.pageBtn}>
                3
              </button>
              <button type="button" className={styles.pageBtn}>
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
