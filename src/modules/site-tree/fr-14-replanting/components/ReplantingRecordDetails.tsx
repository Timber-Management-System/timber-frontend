'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import { useReplantingRecord } from '../hooks/useReplantingRecord';
import styles from './ReplantingRecordDetails.module.css';

interface ReplantingRecordDetailsProps {
  recordId: string;
}

export function ReplantingRecordDetails({
  recordId,
}: ReplantingRecordDetailsProps) {
  const router = useRouter();
  const { record, loading, error } = useReplantingRecord(recordId);

  if (loading) {
    return (
      <section className={styles.container}>
        <p role="status" className={styles.description}>
          Loading record details...
        </p>
      </section>
    );
  }

  if (error || !record) {
    return (
      <section className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Replanting Record Details
          </h1>
        </header>

        <div className={styles.card}>
          <p role="alert" className={styles.description}>
            {error
              ? 'Could not load record details.'
              : 'Record not found.'}
          </p>

          <div className={styles.actions}>
            <Button
              variant="secondary"
              onClick={() => router.push('/site-tree/replanting')}
            >
              Back to Records
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Replanting Record Details
        </h1>

        <p className={styles.description}>
          View the details and current status of a replanting record.
        </p>
      </header>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Record Information</h2>
        <h3 className={styles.recordId}>Record ID: {record.id}</h3>

        <dl className={styles.details}>
          <div className={styles.field}>
            <dt>Planting Date</dt>
            <dd>{record.plantingDate}</dd>
          </div>

          <div className={styles.field}>
            <dt>Site / Location</dt>
            <dd>{record.site}</dd>
          </div>

          <div className={styles.field}>
            <dt>Tree Species</dt>
            <dd>{record.species}</dd>
          </div>

          <div className={styles.field}>
            <dt>No. of Trees</dt>
            <dd>{record.treeCount}</dd>
          </div>

          <div className={styles.field}>
            <dt>Responsible Team</dt>
            <dd>{record.responsibleTeam || 'Not specified'}</dd>
          </div>

          <div className={styles.field}>
            <dt>Status</dt>
            <dd>
              <span
                className={`${styles.statusBadge} ${
                  record.status === 'Completed'
                    ? styles.completed
                    : record.status === 'In Progress'
                      ? styles.inProgress
                      : styles.pending
                }`}
              >
                {record.status}
              </span>
            </dd>
          </div>
        </dl>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => router.push('/site-tree/replanting')}
          >
            Back to Records
          </Button>
        </div>
      </div>
    </section>
  );
}