'use client';

import { Button } from '@/shared/components/ui/Button';
import styles from './ReplantingRecordsList.module.css';
import { ReplantingFilters } from './ReplantingFilters';
import { ReplantingRecordsTable } from './ReplantingRecordsTable';
import { useState } from 'react';

const sampleRecords = [
  {
    id: 'RP-001',
    plantingDate: '2026-11-20',
    site: 'Site A',
    species: 'Teak',
    treeCount: 150,
    status: 'Completed',
  },
  {
    id: 'RP-002',
    plantingDate: '2026-11-21',
    site: 'Site B',
    species: 'Mahogany',
    treeCount: 100,
    status: 'In Progress',
  },
  {
    id: 'RP-003',
    plantingDate: '2026-11-22',
    site: 'Site C',
    species: 'Pine',
    treeCount: 200,
    status: 'Pending',
  },
];


export function ReplantingRecordsList() {
  const [filters, setFilters] = useState({
  dateFrom: '',
  dateTo: '',
  site: '',
  species: '',
  status: '',
  recordId: '',
});


const filteredRecords = sampleRecords.filter((record) => {
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

        <Button type="button">
          Add Replanting Record
        </Button>
      </header>
      <ReplantingFilters onSearch={setFilters} />
      <ReplantingRecordsTable records={filteredRecords} />
    </section>
  );
}
