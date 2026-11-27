'use client';

import { Button } from '@/shared/components/ui/Button';
import type { FelledTree } from '../types/felled-trees.types';
import styles from './FelledTreeDetails.module.css';

interface FelledTreeDetailsProps {
  record: FelledTree;
  onBack: () => void;
  onEdit: () => void;
}

export function FelledTreeDetails({
  record,
  onBack,
  onEdit,
}: FelledTreeDetailsProps) {
  const isCompleted = record.status === 'COMPLETED';

  // Record information
  const details = [
    { label: 'Record ID', value: record.recordId },
    { label: 'Felling Date', value: record.fellingDate },
    { label: 'Felling Team', value: record.fellingTeam },
    { label: 'Site / Location', value: record.siteLocation },
    { label: 'Tree ID', value: record.treeId },
    { label: 'Permit ID', value: record.permitId },
    {
      label: 'Actual Length',
      value: `${record.actualLength} m`,
    },
    {
      label: 'Actual Diameter',
      value: `${record.actualDiameter} cm`,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>FR-16</p>
          <h1 className={styles.title}>Felled Tree Details</h1>
        </div>

        <Button variant="secondary" onClick={onBack}>
          Back to List
        </Button>
      </div>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.sectionTitle}>
            Record Information
          </h2>

          <span
            className={`${styles.status} ${
              isCompleted ? styles.completed : styles.pending
            }`}
          >
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
        </div>

        <dl className={styles.grid}>
          {details.map((detail) => (
            <div key={detail.label} className={styles.field}>
              <dt className={styles.label}>{detail.label}</dt>
              <dd className={styles.value}>{detail.value}</dd>
            </div>
          ))}

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <dt className={styles.label}>Remarks</dt>
            <dd className={styles.value}>
              {record.remarks?.trim() || 'No remarks provided.'}
            </dd>
          </div>
        </dl>

        <div className={styles.actions}>
          <Button variant="secondary" disabled>
            Manage Logs
          </Button>

          <Button onClick={onEdit}>
            Edit Record
          </Button>
        </div>
      </section>
    </div>
  );
}