'use client';

import { useState } from 'react';
import { FelledTreeForm } from './FelledTreeForm';
import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';
import { createFelledTree } from '../api/felled-trees.api';
import type { FelledTreeCreateInput } from '../types/felled-trees.types';
import { FelledTreeDetails } from './FelledTreeDetails';
import type { FelledTree } from '../types/felled-trees.types';

import { useFelledTrees } from '../hooks/useFelledTrees';
import type { FellingStatus } from '../types/felled-trees.types';

import styles from './FelledTreesPage.module.css';

const STATUS_CLASS: Record<FellingStatus, string> = {
  PENDING: styles.warn,
  COMPLETED: styles.ok,
};

export function FelledTreesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRecord, setSelectedRecord] =
  useState<FelledTree | null>(null);
  const { items, loading, error, setItems } = useFelledTrees();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [treeId, setTreeId] = useState('');
  const [status, setStatus] = useState('');
  const [recordId, setRecordId] = useState('');

  // Store applied filter values.
  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    siteLocation: '',
    treeId: '',
    status: '',
    recordId: '',
  });


  // Store date validation error.
  const [filterError, setFilterError] = useState('');

  // Save a new record and update the list
  async function handleCreateRecord(values: FelledTreeCreateInput) {
    const newRecord = await createFelledTree(values);

    setItems((previous) => [...previous, newRecord]);

    handleReset();
    setShowAddForm(false);
  }

  // Validate and apply selected filters.
  function handleSearch() {
    if (dateFrom && dateTo && dateFrom > dateTo) {
      setFilterError('From date cannot be later than To date.');
      return;
    }

    setFilterError('');

    setAppliedFilters({
      dateFrom,
      dateTo,
      siteLocation: siteLocation.trim(),
      treeId: treeId.trim(),
      status,
      recordId: recordId.trim(),
    });
  }

  // Clear all filter values.
  function handleReset() {
    setDateFrom('');
    setDateTo('');
    setSiteLocation('');
    setTreeId('');
    setStatus('');
    setRecordId('');
    setFilterError('');

    setAppliedFilters({
      dateFrom: '',
      dateTo: '',
      siteLocation: '',
      treeId: '',
      status: '',
      recordId: '',
    });
  }

  // Filter records using the applied filter values.
  const filteredItems = items.filter((item) => {
    return (
      (!appliedFilters.dateFrom ||
        item.fellingDate >= appliedFilters.dateFrom) &&
      (!appliedFilters.dateTo ||
        item.fellingDate <= appliedFilters.dateTo) &&
      (!appliedFilters.siteLocation ||
        item.siteLocation.toLowerCase().includes(
          appliedFilters.siteLocation.toLowerCase()
        )) &&
      (!appliedFilters.treeId ||
        item.treeId.toLowerCase().includes(
          appliedFilters.treeId.toLowerCase()
        )) &&
      (!appliedFilters.status ||
        item.status === appliedFilters.status) &&
      (!appliedFilters.recordId ||
        item.recordId.toLowerCase().includes(
          appliedFilters.recordId.toLowerCase()
        ))
    );
  });

  
  if (selectedRecord) {
    return (
      <section className={styles.page}>
        <FelledTreeDetails
          record={selectedRecord}
          onBack={() => setSelectedRecord(null)}
          onEdit={() => {}}
        />
      </section>
    );
}
  if (showAddForm) {
  return (
    <section className={styles.page}>
      <FelledTreeForm
        mode="add"
        onSubmit={handleCreateRecord}
        onCancel={() => setShowAddForm(false)}
      />
    </section>
  );
}

return (
  <section className={styles.page} aria-labelledby="felled-trees-title">
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>FR-16</p>
          <h1 id="felled-trees-title" className={styles.title}>
            Felled Trees
          </h1>
        </div>

        <Button
          leftIcon={<Icon name="plus" />}
          onClick={() => setShowAddForm(true)}
>
          Add Felled Tree
        </Button>
      </header>

      <div className={styles.filterCard}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
  >
      <div className={styles.filterGrid}>
        <label className={styles.filterField}>
          Felling Date From
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
          />
        </label>

        <label className={styles.filterField}>
          Felling Date To
          <input
            type="date"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
          />
        </label>

        <label className={styles.filterField}>
          Site / Location
          <input
            type="text"
            placeholder="Enter site or location"
            value={siteLocation}
            onChange={(event) => setSiteLocation(event.target.value)}
          />
        </label>

        <label className={styles.filterField}>
          Tree ID
          <input
            type="text"
            placeholder="e.g. TREE-001"
            value={treeId}
            onChange={(event) => setTreeId(event.target.value)}
          />
        </label>

        <label className={styles.filterField}>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>

        <label className={styles.filterField}>
          Record ID
          <input
            type="text"
            placeholder="e.g. FR-001"
            value={recordId}
            onChange={(event) => setRecordId(event.target.value)}
          />
        </label>
      </div>

    {filterError && (
      <p className={styles.filterError} role="alert">
        {filterError}
      </p>
    )}

    <div className={styles.filterActions}>
      <Button
        type="submit"
        variant="secondary"
        leftIcon={<Icon name="search" />}
      >
        Search
      </Button>

      <Button
        variant="secondary"
        onClick={handleReset}
      >
        Reset
      </Button>
    </div>
  </form>
</div>

      <div className={styles.card}>
        {loading && <p className={styles.muted}>Loading records...</p>}

        {Boolean(error) && (
          <p role="alert">Could not load felled tree records.</p>
        )}

        {!loading && !error && (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Record ID</th>
                    <th scope="col">Felling Date</th>
                    <th scope="col">Site / Location</th>
                    <th scope="col">Tree ID</th>
                    <th scope="col">Actual Dimensions</th>
                    <th scope="col">Felling Team</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>

                      <td className={styles.ref}>
                        {item.recordId}
                      </td>

                      <td>{item.fellingDate}</td>
                      <td>{item.siteLocation}</td>

                      <td className={styles.ref}>
                        {item.treeId}
                      </td>

                      <td>
                        {item.actualLength} m / {item.actualDiameter} cm
                      </td>

                      <td>{item.fellingTeam}</td>

                      <td>
                        <span
                          className={`${styles.status} ${STATUS_CLASS[item.status]}`}
                        >
                          {item.status === 'COMPLETED'
                            ? 'Completed'
                            : 'Pending'}
                        </span>
                      </td>

                      <td>
                        <div className={styles.actions}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRecord(item)}
                            >
                              View
                          </Button>

                          <Button variant="ghost" size="sm" disabled>
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={9}>No felled tree records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className={styles.muted}>
              Total records: {filteredItems.length}
            </p>
          </>
        )}
      </div>
    </section>
  );
}