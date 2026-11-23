import { Button } from '@/shared/components/ui/Button';
import styles from './ReplantingRecordsList.module.css';
import { ReplantingFilters } from './ReplantingFilters';
import { ReplantingRecordsTable } from './ReplantingRecordsTable';

export function ReplantingRecordsList() {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Replanting Records</h1>
          <p className={styles.description}>
            View and manage replanting activities.
          </p>
        </div>

        <Button type="button">
          Add Replanting Record
        </Button>
      </header>
      <ReplantingFilters />
      <ReplantingRecordsTable records={[]} />
    </section>
  );
}
