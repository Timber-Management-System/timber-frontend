'use client';

import { Button } from '@/shared/components/ui/Button';
import styles from './ReplantingRecordsList.module.css';
import { ReplantingFilters } from './ReplantingFilters';
import { ReplantingRecordsTable } from './ReplantingRecordsTable';
import { useState } from 'react';
import { useReplantingRecords } from '../hooks/useReplantingRecords';
import { useRouter } from 'next/navigation';


export function ReplantingRecordsList() {
  const router = useRouter();
  const { items, loading, error } = useReplantingRecords();
  const [filters, setFilters] = useState({
  dateFrom: '',
  dateTo: '',
  site: '',
  species: '',
  status: '',
  recordId: '',
});


const filteredRecords = items.filter((record) => {
  return (
    (!filters.dateFrom || record.plantingDate >= filters.dateFrom) &&
    (!filters.dateTo || record.plantingDate <= filters.dateTo) &&
    (!filters.site || record.site === filters.site) &&
    (!filters.species || record.species === filters.species) &&
    (!filters.status || record.status === filters.status) &&
    (!filters.recordId ||
      record.id.toLowerCase().includes(
        filters.recordId.trim().toLowerCase()
      ))
  );
});

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Replanting Records</h1>
          <p className={styles.description}>
            View and manage replanting activities.
          </p>
        </div>

        <Button
  type="button"
  onClick={() => router.push('/site-tree/replanting/add')}
>
  Add Replanting Record
</Button>

      </header>
      <ReplantingFilters onSearch={setFilters} />
      {loading && <p>Loading replanting records...</p>}

{Boolean(error) && (
  <p role="alert">Could not load replanting records.</p>
)}

{!loading && !error && (
  <ReplantingRecordsTable records={filteredRecords} />
)}
    </section>
  );
}
