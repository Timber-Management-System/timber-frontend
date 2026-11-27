'use client';

import type { GroupByOption, StockGroupSummary } from '../types';
import styles from './StockGroupSummarySection.module.css';

interface StockGroupSummarySectionProps {
  groupBy: GroupByOption;
  onGroupByChange: (option: GroupByOption) => void;
  summaries: StockGroupSummary[];
  isLoading?: boolean;
}

const GROUP_OPTIONS: GroupByOption[] = ['Species', 'Grade', 'Size', 'Location'];

export function StockGroupSummarySection({
  groupBy,
  onGroupByChange,
  summaries,
  isLoading = false,
}: StockGroupSummarySectionProps) {
  return (
    <section className={styles.card} aria-label="Stock Group Summary">
      <div className={styles.header}>
        <h2 className={styles.title}>Stock summary</h2>
        <div className={styles.groupByControls}>
          <span className={styles.groupByLabel}>Group by</span>
          <div className={styles.tabGroup} role="tablist">
            {GROUP_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                role="tab"
                aria-selected={groupBy === opt}
                className={`${styles.tabBtn} ${groupBy === opt ? styles.tabBtnActive : ''}`}
                onClick={() => onGroupByChange(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{groupBy}</th>
              <th className={styles.alignRight}>Items</th>
              <th className={styles.alignRight}>Volume (m³)</th>
              <th className={styles.alignRight}>% of stock</th>
              <th className={styles.alignRight}>Avg age (days)</th>
              <th className={styles.alignRight}>Oldest (days)</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={`skel-${idx}`}>
                    <td>
                      <div className={styles.skeletonCell} style={{ width: '90px' }} />
                    </td>
                    <td className={styles.alignRight}>
                      <div className={styles.skeletonCell} style={{ width: '40px', marginLeft: 'auto' }} />
                    </td>
                    <td className={styles.alignRight}>
                      <div className={styles.skeletonCell} style={{ width: '50px', marginLeft: 'auto' }} />
                    </td>
                    <td className={styles.alignRight}>
                      <div className={styles.skeletonCell} style={{ width: '45px', marginLeft: 'auto' }} />
                    </td>
                    <td className={styles.alignRight}>
                      <div className={styles.skeletonCell} style={{ width: '35px', marginLeft: 'auto' }} />
                    </td>
                    <td className={styles.alignRight}>
                      <div className={styles.skeletonCell} style={{ width: '40px', marginLeft: 'auto' }} />
                    </td>
                  </tr>
                ))
              : summaries.map((row) => (
                  <tr key={row.groupKey}>
                    <td className={styles.keyText}>{row.groupKey}</td>
                    <td className={`${styles.alignRight} ${styles.tabularNum}`}>{row.itemCount}</td>
                    <td className={`${styles.alignRight} ${styles.tabularNum}`}>{row.volumeM3.toFixed(1)}</td>
                    <td className={`${styles.alignRight} ${styles.tabularNum}`}>{row.percentage}%</td>
                    <td className={`${styles.alignRight} ${styles.tabularNum}`}>{row.avgAgeDays}</td>
                    <td className={`${styles.alignRight} ${styles.tabularNum}`}>
                      <span className={row.oldestAgeDays > 90 ? styles.critAge : ''}>
                        {row.oldestAgeDays}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
