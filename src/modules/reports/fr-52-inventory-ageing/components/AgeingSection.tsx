'use client';

import type { AgeingBucket } from '../types';
import styles from './AgeingSection.module.css';

interface AgeingSectionProps {
  buckets: AgeingBucket[];
  isLoading?: boolean;
}

export function AgeingSection({ buckets, isLoading = false }: AgeingSectionProps) {
  const maxVolume = Math.max(...buckets.map((b) => b.volumeM3), 1);

  return (
    <section className={styles.wrapper}>
      <div className={styles.cardHeader}>
        <h2 className={styles.sectionTitle}>Stock ageing</h2>
      </div>

      <div className={styles.container}>
        {/* Chart Panel */}
        <div className={styles.chartPanel}>
          <div className={styles.panelHeader}>
            <span className={styles.chartTitle}>Ageing chart (volume by age bucket)</span>
          </div>

          {isLoading ? (
            <div className={styles.chartSkeleton}>
              <div className={styles.skeletonBar} style={{ height: '75%' }} />
              <div className={styles.skeletonBar} style={{ height: '55%' }} />
              <div className={styles.skeletonBar} style={{ height: '35%' }} />
              <div className={styles.skeletonBar} style={{ height: '55%' }} />
            </div>
          ) : (
            <div className={styles.chartBody}>
              <div className={styles.barsContainer}>
                {buckets.map((bucket) => {
                  const heightPercent = Math.max(Math.round((bucket.volumeM3 / maxVolume) * 100), 10);
                  const isCritical = bucket.id === '90+';
                  const isWarning = bucket.id === '61-90';

                  let barColorClass = styles.bar;
                  if (isCritical) barColorClass = `${styles.bar} ${styles.barCritical}`;
                  else if (isWarning) barColorClass = `${styles.bar} ${styles.barWarning}`;

                  return (
                    <div key={bucket.id} className={styles.barColumn}>
                      <div className={styles.barTrack}>
                        <span className={styles.barValue}>{bucket.volumeM3} m³</span>
                        <div
                          className={barColorClass}
                          style={{ height: `${heightPercent}%` }}
                          title={`${bucket.label}: ${bucket.volumeM3} m³ (${bucket.itemCount} items)`}
                        />
                      </div>
                      <span className={styles.barLabel}>{bucket.label}</span>
                      <span className={styles.barItems}>{bucket.itemCount} items</span>
                    </div>
                  );
                })}
              </div>

              <div className={styles.chartLegend}>
                <span className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.dotNormal}`} />
                  &le; 60 days
                </span>
                <span className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.dotWarning}`} />
                  61–90 days
                </span>
                <span className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.dotCritical}`} />
                  90+ days
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bucket Table Panel */}
        <div className={styles.tablePanel}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <colgroup>
                <col style={{ width: '44%' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '28%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Age bucket</th>
                  <th className={styles.alignRight}>Items</th>
                  <th className={styles.alignRight}>Volume (m³)</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={`skel-${idx}`}>
                        <td>
                          <div className={styles.skeletonCell} style={{ width: '80px' }} />
                        </td>
                        <td className={styles.alignRight}>
                          <div className={styles.skeletonCell} style={{ width: '40px', marginLeft: 'auto' }} />
                        </td>
                        <td className={styles.alignRight}>
                          <div className={styles.skeletonCell} style={{ width: '50px', marginLeft: 'auto' }} />
                        </td>
                      </tr>
                    ))
                  : buckets.map((bucket) => (
                      <tr key={bucket.id}>
                        <td className={styles.bucketLabel}>{bucket.label}</td>
                        <td className={`${styles.alignRight} ${styles.tabularNum}`}>
                          {bucket.itemCount}
                        </td>
                        <td className={`${styles.alignRight} ${styles.tabularNum}`}>
                          {bucket.volumeM3.toFixed(1)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
