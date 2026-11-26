'use client';

import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';

import { useFelledTrees } from '../hooks/useFelledTrees';
import type { FellingStatus } from '../types/felled-trees.types';

import styles from './FelledTreesPage.module.css';

const STATUS_CLASS: Record<FellingStatus, string> = {
  PENDING: styles.warn,
  COMPLETED: styles.ok,
};

export function FelledTreesPage() {
  const { items, loading, error } = useFelledTrees();

  return (
    <section className={styles.page} aria-labelledby="felled-trees-title">
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>FR-16</p>
          <h1 id="felled-trees-title" className={styles.title}>
            Felled Trees
          </h1>
        </div>

        <Button leftIcon={<Icon name="plus" />} disabled>
          Add Felled Tree
        </Button>
      </header>

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
                  {items.map((item, index) => (
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
                          <Button variant="ghost" size="sm" disabled>
                            View
                          </Button>

                          <Button variant="ghost" size="sm" disabled>
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={9}>No felled tree records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className={styles.muted}>
              Total records: {items.length}
            </p>
          </>
        )}
      </div>
    </section>
  );
}